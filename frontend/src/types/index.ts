// User authentication types
export interface AuthCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends AuthCredentials {
  confirmPassword?: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  userId: number;  // Added userId field
  message?: string;
}

export interface User {
  id: number;
  username: string;
}

// Message types for chat functionality
export interface Message {
  id: number;
  senderId: number;
  senderUsername: string;
  receiverId: number;
  content: string;
  timestamp: string;
  delivered: boolean;
}

export interface Contact {
  id: number;
  username: string;
  lastMessage?: string;
  time?: string;
  unread?: number;
}

// API error response
export interface ApiError {
  message: string;
  status?: number;
}

// Page types for navigation
export type PageType = 'home' | 'signin' | 'signup' | 'chat';