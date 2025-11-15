import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { authAPI } from '../utils/api';
import type { PageType } from '../types';

interface SignUpPageProps {
  onNavigate: (page: PageType) => void;
}

/**
 * Sign up page component
 * Allows new users to create an account
 */
const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await authAPI.register(formData);
      console.log('Registration successful:', response);
      
      // Show success message and redirect to login
      alert(`Registration successful! Welcome ${response.username}! Please sign in to continue.`);
      onNavigate('signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-indigo-50 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 md:p-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-6 sm:mb-7">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-600" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">Create Account</h2>
        <p className="text-sm sm:text-base text-gray-600 text-center mb-6 sm:mb-7">Sign up to start chatting instantly</p>
        
        {/* Error message */}
        {error && (
          <div className="mb-5 sm:mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {/* Form */}
        <div className="space-y-4">
          {/* Username field */}
          <div>
            <label htmlFor="username" className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Choose a username"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-indigo-600 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">3-20 characters, alphanumeric and underscores only</p>
          </div>
          
          {/* Password field */}
          <div>
            <label htmlFor="password" className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Create a password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-indigo-600 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
          </div>
          
          {/* Confirm password field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-900 font-semibold mb-2 text-sm sm:text-base">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              placeholder="Confirm your password"
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg border-2 border-gray-200 focus:border-indigo-600 focus:outline-none text-gray-900 placeholder-gray-400 transition-colors"
              disabled={isLoading}
            />
          </div>
          
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-2.5 sm:py-3 rounded-lg hover:bg-indigo-700 transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </div>
        
        {/* Sign in link */}
        <p className="text-center mt-5 sm:mt-6 text-sm sm:text-base text-gray-600">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('signin')}
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;