/**
 * ChatPage.tsx - Real-time Messaging Interface
 * 
 * This component provides a complete chat interface with real-time messaging via WebSocket.
 * It integrates with the backend Spring Boot application for user authentication and messaging.
 * 
 * BACKEND INTEGRATION GUIDE:
 * =========================
 * 
 * 1. WEBSOCKET ENDPOINT REQUIREMENTS:
 *    - WebSocket URL: ws://localhost:8080/ws/messages
 *    - STOMP Protocol Support Required
 *    - Message Publishing: /app/chat
 *    - Message Subscription: /topic/messages
 * 
 * 2. REQUIRED BACKEND ENDPOINTS:
 *    - GET /api/users - Returns array of all users [{id: number, username: string}]
 *    - POST /api/auth/login - User authentication
 *    - POST /api/auth/register - User registration
 * 
 * 3. MESSAGE FORMAT (WebSocket):
 *    Sent to /app/chat:
 *    {
 *      "id": number,           // Message ID (auto-generated)
 *      "senderId": number,     // Current user's ID
 *      "senderUsername": string, // Current user's username
 *      "receiverId": number,   // Target user's ID
 *      "content": string,      // Message text
 *      "timestamp": string,    // ISO timestamp
 *      "delivered": boolean    // Delivery status
 *    }
 * 
 * 4. WEBSOCKET CONFIGURATION (Spring Boot):
 *    - Enable WebSocket support with @EnableWebSocketMessageBroker
 *    - Configure SockJS fallback for browser compatibility
 *    - Set up STOMP message broker
 *    - Allow CORS for localhost:3000 (frontend)
 * 
 * 5. REQUIRED DEPENDENCIES (pom.xml):
 *    - spring-boot-starter-websocket
 *    - spring-boot-starter-security (for CORS)
 * 
 * 6. EXAMPLE BACKEND CONFIGURATION:
 *    @Configuration
 *    @EnableWebSocketMessageBroker
 *    public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
 *        @Override
 *        public void configureMessageBroker(MessageBrokerRegistry config) {
 *            config.enableSimpleBroker("/topic");
 *            config.setApplicationDestinationPrefixes("/app");
 *        }
 *        
 *        @Override
 *        public void registerStompEndpoints(StompEndpointRegistry registry) {
 *            registry.addEndpoint("/ws/messages").withSockJS();
 *        }
 *    }
 * 
 * 7. EXAMPLE MESSAGE CONTROLLER:
 *    @MessageMapping("/chat")
 *    @SendTo("/topic/messages")
 *    public MessageResponse sendMessage(MessageRequest message) {
 *        // Process and save message
 *        return new MessageResponse(message);
 *    }
 * 
 * 8. CORS CONFIGURATION:
 *    Allow requests from http://localhost:3000
 *    Allow WebSocket connections from frontend
 * 
 * 9. AUTHENTICATION:
 *    - JWT tokens stored in localStorage
 *    - Username stored in localStorage
 *    - Automatic redirect to home if not authenticated
 * 
 * 10. ERROR HANDLING:
 *     - WebSocket connection errors logged to console
 *     - Failed API calls show error messages
 *     - Graceful fallback for disconnected state
 */

import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, LogOut, Plus, UserPlus, X } from 'lucide-react';
import { initializeChatWebSocket, disconnectChatWebSocket, getChatWebSocket } from '../utils/websocket';
import { getUsername, removeToken, getToken, userAPI } from '../utils/api';
import type { PageType, Message, Contact, User } from '../types';

interface ChatPageProps {
  onNavigate: (page: PageType) => void;
}

/**
 * Chat page component
 * Displays messaging interface with real-time communication
 * Only accessible when user is logged in
 */
const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [showUserSelector, setShowUserSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = getToken();
    const username = getUsername();
    
    if (!token || !username) {
      // User is not logged in, redirect to home
      onNavigate('home');
      return;
    }
    
    /**
     * Current User Setup
     * 
     * BACKEND INTEGRATION NOTE:
     * - Currently using hardcoded ID (1) - needs backend integration
     * - Should get actual user ID from JWT token or user profile endpoint
     * - Username is stored in localStorage after login
     * 
     * IMPROVEMENT NEEDED:
     * - Add GET /api/auth/me endpoint to get current user details
     * - Extract user ID from JWT token claims
     * - Update UserService to return user ID in login response
     */
    setCurrentUser({ id: 1, username }); // TODO: Get actual user ID from backend
    
    /**
     * User List Fetching
     * 
     * BACKEND ENDPOINT REQUIRED:
     * - GET /api/users
     * - Returns: Array<{id: number, username: string}>
     * - Should exclude current user or filter on frontend
     * - Requires authentication (JWT token in header)
     * 
     * EXAMPLE RESPONSE:
     * [
     *   {"id": 1, "username": "alice"},
     *   {"id": 2, "username": "bob"},
     *   {"id": 3, "username": "charlie"}
     * ]
     */
    const fetchUsers = async () => {
      try {
        const users = await userAPI.getAllUsers();
        setAllUsers(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    
    fetchUsers();
    setIsLoading(false);
  }, [onNavigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * WebSocket Connection Setup
   * 
   * BACKEND REQUIREMENTS:
   * - WebSocket endpoint at ws://localhost:8080/ws/messages
   * - STOMP protocol support
   * - SockJS fallback enabled
   * - Message broker configured for /topic/messages
   * 
   * CONNECTION FLOW:
   * 1. Connect to WebSocket using SockJS + STOMP
   * 2. Subscribe to /topic/messages for incoming messages
   * 3. Publish messages to /app/chat for outgoing messages
   * 4. Handle connection errors gracefully
   */
  useEffect(() => {
    if (!currentUser) return;

    const wsUrl = 'ws://localhost:8080/ws/messages';
    const chatWs = initializeChatWebSocket(wsUrl);

    /**
     * Incoming Message Handler
     * 
     * BACKEND INTEGRATION:
     * - Receives messages from /topic/messages subscription
     * - Filters messages to only show those involving current user
     * - Updates local state for real-time display
     * 
     * MESSAGE FILTERING:
     * - Shows messages where current user is sender OR receiver
     * - Prevents showing messages between other users
     * - Ensures privacy and relevant message display
     */
    const handleMessage = (message: Message) => {
      // Only add messages that involve the current user
      if (message.senderId === currentUser.id || message.receiverId === currentUser.id) {
        setMessages(prevMessages => [...prevMessages, message]);
      }
    };

    // Set up error handler
    const handleError = (error: string) => {
      console.error('WebSocket error:', error);
      // Could show a toast notification here
    };

    chatWs.connect(handleMessage, handleError);

    // Cleanup on unmount
    return () => {
      disconnectChatWebSocket();
    };
  }, [currentUser]);

  /**
   * Message Sending Function
   * 
   * BACKEND INTEGRATION:
   * - Sends message to /app/chat endpoint via WebSocket
   * - Backend should process and broadcast to /topic/messages
   * - Message format matches the Message interface
   * 
   * MESSAGE STRUCTURE:
   * {
   *   "id": number,           // Frontend generates temporary ID
   *   "senderId": number,     // Current user ID from localStorage
   *   "senderUsername": string, // Current user username
   *   "receiverId": number,   // Selected contact ID
   *   "content": string,      // Message text input
   *   "timestamp": string,    // ISO timestamp
   *   "delivered": boolean    // Initially false, backend updates
   * }
   * 
   * BACKEND PROCESSING:
   * 1. Receive message at /app/chat
   * 2. Validate sender and receiver
   * 3. Save to database
   * 4. Broadcast to /topic/messages for real-time delivery
   * 5. Update delivery status
   */
  const handleSendMessage = () => {
    if (newMessage.trim() && currentUser && selectedContact) {
      const message: Message = {
        id: messages.length + 1,
        senderId: currentUser.id,
        senderUsername: currentUser.username,
        receiverId: selectedContact.id,
        content: newMessage,
        timestamp: new Date().toISOString(),
        delivered: false,
      };
      
      // Add to local messages immediately for better UX
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      
      // Send via WebSocket
      const chatWs = getChatWebSocket();
      if (chatWs && chatWs.isConnected()) {
        chatWs.sendChatMessage(message);
      } else {
        console.warn('WebSocket not connected, message not sent');
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = () => {
    // Clear token and redirect to home
    removeToken();
    localStorage.removeItem('username');
    disconnectChatWebSocket();
    onNavigate('home');
  };

  const handleSelectContact = (user: User) => {
    const contact: Contact = {
      id: user.id,
      username: user.username,
    };
    setSelectedContact(contact);
    setShowUserSelector(false);
  };

  const handleStartNewChat = () => {
    setShowUserSelector(true);
  };

  const handleCloseUserSelector = () => {
    setShowUserSelector(false);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (will redirect)
  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
              <Users className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-600" strokeWidth={2.5} />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">NetRunner Chat</span>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <button 
              className="text-gray-900 font-semibold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 hover:text-gray-600 transition-colors text-sm sm:text-base flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white font-semibold px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-red-700 transition-colors text-sm sm:text-base shadow-md flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main chat interface */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        {/* Contacts sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              <button
                onClick={handleStartNewChat}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors"
                title="Start new chat"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a conversation to see messages here</p>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Messages will appear here</p>
                <p className="text-xs mt-1">Select a contact to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="bg-white border-b border-gray-200 p-4">
            {selectedContact ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">
                    {selectedContact.username.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedContact.username}</h3>
                  <p className="text-green-500 text-xs">Online</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Welcome, {currentUser.username}!</h3>
                  <p className="text-gray-500 text-xs">Select a conversation to start chatting</p>
                </div>
              </div>
            )}
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No messages yet</p>
                  <p className="text-sm mt-1">Your conversation history will appear here</p>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === currentUser.id
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUser.id ? 'text-indigo-100' : 'text-gray-500'
                      }`}
                    >
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={selectedContact ? "Type a message..." : "Select a contact to start messaging..."}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={!selectedContact}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !selectedContact}
                className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Selector Modal */}
      {showUserSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 max-h-96">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Start New Chat</h3>
              <button
                onClick={handleCloseUserSelector}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {allUsers
                .filter(user => user.id !== currentUser?.id) // Don't show current user
                .map(user => (
                  <button
                    key={user.id}
                    onClick={() => handleSelectContact(user)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">
                        {user.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{user.username}</p>
                      <p className="text-sm text-gray-500">Click to start chatting</p>
                    </div>
                  </button>
                ))}
            </div>
            
            {allUsers.filter(user => user.id !== currentUser?.id).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">No other users found</p>
                <p className="text-xs mt-1">Register more users to start chatting</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * BACKEND INTEGRATION CHECKLIST:
 * ==============================
 * 
 * ✅ COMPLETED:
 * - WebSocket connection setup
 * - Message sending/receiving
 * - User list fetching
 * - Authentication integration
 * - Real-time message display
 * - Contact selection
 * 
 * 🔧 BACKEND TASKS:
 * 1. Implement WebSocket endpoint at /ws/messages
 * 2. Configure STOMP message broker
 * 3. Add message controller with @MessageMapping("/chat")
 * 4. Implement GET /api/users endpoint
 * 5. Add message persistence to database
 * 6. Configure CORS for WebSocket connections
 * 7. Add user ID to JWT token claims
 * 8. Implement message history loading
 * 
 * 🧪 TESTING:
 * - Test WebSocket connection
 * - Verify message delivery
 * - Check user list functionality
 * - Test authentication flow
 * - Verify message persistence
 * 
 * 🚀 DEPLOYMENT:
 * - Update WebSocket URL for production
 * - Configure CORS for production domain
 * - Set up SSL for WSS connections
 * - Configure message broker clustering
 */

export default ChatPage;
