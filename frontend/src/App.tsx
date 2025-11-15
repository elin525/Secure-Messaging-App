import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import ChatPage from './components/ChatPage';
import { getToken } from './utils/api';
import type { PageType } from './types';
import { getUserId } from './utils/api';

/**
 * Main App component
 * Handles routing between different pages
 */
const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // User is logged in, redirect to chat page
      setCurrentPage('chat');
    }
  }, []);

  // Render current page based on state
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'signin':
        return <SignInPage onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUpPage onNavigate={setCurrentPage} />;
      case 'chat':
        return <ChatPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
};

export default App;
