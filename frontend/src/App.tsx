import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import { getToken } from './utils/api';
import type { PageType } from './types';

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
      // User is logged in, could redirect to chat page
      console.log('User is already logged in');
  
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
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return <div className="min-h-screen">{renderPage()}</div>;
};

export default App;
