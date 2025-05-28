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
      console.log('Login response:', response.data);

      // Store the JWT token in localStorage for subsequent requests
      if (response.data) {
        const token = response.data;

        try {
          const payload = token.split('.')[1];
          const decodedPayload = JSON.parse(atob(payload));
          const { id, role } = decodedPayload;
          const { username } = credentials;

          const userData = {
            id,
            role,
            username,
            token
          };
          console.log('Before setting user in localStorage', userData);
          localStorage.setItem('user', JSON.stringify(userData));
          console.log('After setting user in localStorage', localStorage.getItem('user'));

          localStorage.setItem('token', token);
        } catch (jwtError) {
          console.error('Error parsing JWT token:', jwtError);

          const fallbackUserData = {
                    username: credentials.username,
                    token
                  };

          console.log('Before fallback setting user:', fallbackUserData);
          localStorage.setItem('user', JSON.stringify(fallbackUserData));
          console.log('After fallback setting user:', localStorage.getItem('user'));

          localStorage.setItem('token', token);
        }
      }

    console.log('Stored user just before return:', JSON.parse(localStorage.getItem('user')));
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
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || null;
  }
};

export default authService;
