import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, Settings, LogOut, Plus, UserPlus, X } from 'lucide-react';
import { initializeChatWebSocket, disconnectChatWebSocket, getChatWebSocket } from '../utils/websocket';
import { getUsername, removeToken, getToken, userAPI } from '../utils/api';
import type { PageType, Message, Contact, User } from '../types';

interface ChatPageProps {
  onNavigate: (page: PageType) => void;
}

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
    
    setCurrentUser({ id: 1, username }); // TODO: Get actual user ID from backend
    
    // Fetch all users
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

  // Initialize WebSocket connection only when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const wsUrl = 'ws://localhost:8080/ws/messages';
    const chatWs = initializeChatWebSocket(wsUrl);

    // Set up message handler
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

export default ChatPage;
