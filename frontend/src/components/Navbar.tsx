import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NavbarProps {
  onNavigate?: (page: 'signin' | 'signup') => void;
}

/**
 * Navigation bar component
 * Displays logo and auth buttons
 */
const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo section */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center">
  <MessageSquare className="w-8 h-8 sm:w-9 sm:h-9 text-indigo-600" strokeWidth={2.5} fill="white" />
</div>
          <span className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">NetRunner Chat</span>
        </div>
        
        {/* Auth buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => onNavigate?.('signin')}
            className="text-gray-900 font-semibold px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 hover:text-gray-600 transition-colors text-sm sm:text-base"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigate?.('signup')}
            className="bg-indigo-600 text-white font-semibold px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base shadow-md"
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
