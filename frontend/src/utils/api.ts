import axios, { AxiosError } from 'axios';
import type { AuthCredentials, RegisterCredentials, AuthResponse } from '../types';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token management functions
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const getUsername = (): string | null => {
  return localStorage.getItem('username');
};

export const setUsername = (username: string): void => {
  localStorage.setItem('username', username);
};

export const getUserId = (): number | null => {
  const userId = localStorage.getItem('userId');
  return userId ? parseInt(userId) : null;
};

export const setUserId = (userId: number | undefined): void => {
  if (userId !== undefined && userId !== null) {
    localStorage.setItem('userId', userId.toString());
  }
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    try {
      const { confirmPassword, ...registerData } = credentials;
      const response = await api.post('/api/auth/register', registerData);
      
      console.log('Register response:', response.data);
      
      // Backend returns: { message, username, userId }
      const data = response.data;
      return {
        token: '', // No token returned on register
        username: data.username,
        userId: data.userId || 0,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Register error:', error.response?.data);
        // Backend error format: { error: "message" }
        throw new Error(error.response?.data?.error || 'Registration failed');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  // Login user
  login: async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      
      console.log('Login response:', response.data);
      
      // Backend returns: { message, token, username, userId }
      const data = response.data;
      
      if (!data.userId) {
        console.error('Backend did not return userId! Full response:', data);
      }
      
      return {
        token: data.token,
        username: data.username,
        userId: data.userId || 0,
        message: data.message,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Login error:', error.response?.data);
        // Backend error format: { error: "message" }
        throw new Error(error.response?.data?.error || 'Login failed');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  // Logout user
  logout: (): void => {
    removeToken();
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
  },
};

// User API calls
export const userAPI = {
  // Get all users - NOTE: This endpoint doesn't exist in your backend yet!
  getAllUsers: async (): Promise<Array<{id: number; username: string}>> => {
    try {
      console.warn('GET /api/users endpoint not implemented in backend yet');
      return [];
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new Error(error.response?.data?.error || 'Failed to fetch users');
      }
      throw new Error('An unexpected error occurred');
    }
  },
};

export default api;