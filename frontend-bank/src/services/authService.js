import axios from 'axios';

// Base API URL configuration
const API_URL = import.meta.env.VITE_API_URL; // Using environment variable from .env file

/**
 * Authentication service for handling user login, registration, and token management
 * Implements secure communication with the backend API
 */
const authService = {
  /**
   * Login user with credentials
   * @param {Object} credentials - User credentials (username and password)
   * @returns {Promise} - Response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      
      // Store the JWT token in localStorage for subsequent requests
      if (response.data && response.data.token) {
        const token = response.data.token;
        localStorage.setItem('token', token);
        
        // Parse the JWT payload to extract user information
        try {
          // JWT structure: header.payload.signature
          // We need the payload (second part)
          const payload = token.split('.')[1];
          // Decode the base64 payload
          const decodedPayload = JSON.parse(atob(payload));
          
          // Extract user ID and role from payload
          // According to the backend documentation, the claims are 'id' and 'role'
          const userId = decodedPayload.id;
          const userRole = decodedPayload.role;
          
          // Store user information
          const userData = {
            id: userId,
            role: userRole,
            // Include any other information from the payload or response
            // that might be useful for the application
            ...credentials // Include username from credentials
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (jwtError) {
          console.error('Error parsing JWT token:', jwtError);
          // Fallback to storing whatever user data is in the response
          localStorage.setItem('user', JSON.stringify(response.data.user || { username: credentials.username }));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during login' };
    }
  },
  
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Response with the created user data
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'An error occurred during registration' };
    }
  },
  
  /**
   * Logout the current user by removing stored tokens
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  /**
   * Get the current authenticated user
   * @returns {Object|null} - User object or null if not authenticated
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  /**
   * Check if user is authenticated
   * @returns {Boolean} - True if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Get the authentication token
   * @returns {String|null} - JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export default authService;
