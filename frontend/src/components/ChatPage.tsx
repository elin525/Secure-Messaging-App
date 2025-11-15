import React, { useState, useEffect, useRef } from 'react';
import { Send, LogOut, MessageSquare } from 'lucide-react';
import { initializeChatWebSocket, disconnectChatWebSocket, getChatWebSocket } from '../utils/websocket';
import { getUsername, getToken, getUserId, authAPI } from '../utils/api';
import type { PageType, Message } from '../types';

interface ChatPageProps {
  onNavigate: (page: PageType) => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<{ id: number; username: string } | null>(null);
  const [recipientUsername, setRecipientUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check authentication on component mount
  useEffect(() => {
    const token = getToken();
    const username = getUsername();
    const userId = getUserId();
    
    if (!token || !username || !userId) {
      // User is not logged in, redirect to home
      onNavigate('home');
      return;
    }
    
    setCurrentUser({ id: userId, username });
    setIsLoading(false);
  }, [onNavigate]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize WebSocket connection only when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const wsUrl = 'http://localhost:8080/ws';
    const chatWs = initializeChatWebSocket(wsUrl);

    // Set up message handler
    const handleMessage = (message: Message) => {
      console.log('Message received in chat:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    };

    // Set up error handler
    const handleError = (error: string) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    // Connect to WebSocket
    chatWs.connect(handleMessage, handleError);
    
    // Give it a moment to connect
    setTimeout(() => {
      const ws = getChatWebSocket();
      if (ws && ws.isConnected()) {
        setIsConnected(true);
      }
    }, 1000);

    // Cleanup on unmount
    return () => {
      disconnectChatWebSocket();
      setIsConnected(false);
    };
  }, [currentUser]);

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    const trimmedRecipient = recipientUsername.trim();

    if (!trimmedMessage || !trimmedRecipient) {
      alert('Please enter both a recipient username and a message');
      return;
    }

    if (trimmedMessage.length > 1000) {
      alert('Message too long (max 1000 characters)');
      return;
    }

    if (!currentUser) {
      alert('Not logged in');
      return;
    }

    const chatWs = getChatWebSocket();
    if (chatWs && chatWs.isConnected()) {
      // Send message via WebSocket with sender username
      chatWs.sendChatMessage(currentUser.username, trimmedRecipient, trimmedMessage);
      
      // Clear input
      setNewMessage('');
      
      console.log('Message sent to:', trimmedRecipient);
    } else {
      alert('WebSocket not connected. Please wait or refresh the page.');
      console.warn('WebSocket not connected, message not sent');
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
    authAPI.logout();
    disconnectChatWebSocket();
    onNavigate('home');
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
              <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-600" strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">MyNetRunner Chat</span>
              <p className="text-xs text-gray-500">
                {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">
              {currentUser.username}
            </span>
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
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4">
        {/* Recipient input */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Send message to:
          </label>
          <input
            type="text"
            value={recipientUsername}
            onChange={(e) => setRecipientUsername(e.target.value)}
            placeholder="Enter recipient's username"
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-600 focus:outline-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the exact username of the person you want to message
          </p>
        </div>

        {/* Messages area */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 mb-4 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <Send className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm mt-1">Enter a recipient username and start chatting!</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isSentByMe = message.senderUsername === currentUser.username;
                return (
                  <div
                    key={index}
                    className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isSentByMe
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                      }`}
                    >
                      <p className="text-xs font-semibold mb-1">
                        {isSentByMe ? 'You' : message.senderUsername}
                      </p>
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isSentByMe ? 'text-indigo-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  recipientUsername
                    ? "Type a message..."
                    : "Enter a recipient username first..."
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                rows={1}
                style={{ minHeight: '48px', maxHeight: '120px' }}
                disabled={!isConnected || !recipientUsername}
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {newMessage.length}/1000 characters
              </p>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !recipientUsername || !isConnected}
              className="bg-indigo-600 text-white p-3 rounded-2xl hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;