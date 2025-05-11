import axios from 'axios';
import authService from '../services/authService';

/**
 * Configure axios with interceptors for handling authentication and errors
 * This ensures all requests include the auth token and errors are handled consistently
 */

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Using environment variable from .env file
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (expired token, etc.)
    if (error.response && error.response.status === 401) {
      // Clear auth data and redirect to login
      authService.logout();
      window.location.href = '/login';
    }
    
    // Handle 403 Forbidden errors
    if (error.response && error.response.status === 403) {
      console.error('Access forbidden');
    }
    
    // Handle 500 server errors
    if (error.response && error.response.status >= 500) {
      console.error('Server error occurred');
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
