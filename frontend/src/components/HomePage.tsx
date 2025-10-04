import React from 'react';
import Navbar from './Navbar';
import type { PageType } from '../types';

interface HomePageProps {
  onNavigate: (page: PageType) => void;
}

/**
 * Landing page component
 * Displays hero section with app description and CTA buttons
 */
const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex flex-col">
      <Navbar onNavigate={onNavigate} />
      
      {/* Hero section */}
      <div className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 w-full">
          <div className="max-w-5xl">
            {/* Hero heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
              Connect and Chat in <span className="text-indigo-600">Real-Time</span>
            </h1>
            
            {/* Description */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 mb-6 sm:mb-7 md:mb-8 leading-relaxed max-w-3xl">
              Experience seamless communication with instant messaging powered by WebSocket technology. Fast, secure, and reliable.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="bg-indigo-600 text-white font-bold px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl text-sm sm:text-base md:text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => onNavigate('signin')}
                className="bg-white text-gray-900 font-bold px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl text-sm sm:text-base md:text-lg hover:bg-gray-50 transition-all border-2 border-gray-300 hover:border-gray-400 shadow-md transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;