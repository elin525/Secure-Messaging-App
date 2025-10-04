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
  message?: string;
}

export interface User {
  id: string;
  username: string;
}

// API error response
export interface ApiError {
  message: string;
  status?: number;
}

// Page types for navigation
export type PageType = 'home' | 'signin' | 'signup' | 'chat';
