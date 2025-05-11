import axiosInstance from '../utils/axiosConfig';
import authService from './authService';

/**
 * Admin Service
 * Handles API requests related to admin functionality
 * Implements secure communication with the backend API
 * Restricted to users with admin role
 */
const adminService = {
  /**
   * Check if the current user has admin privileges
   * @returns {Boolean} - True if user is an admin
   */
  isAdmin: () => {
    const currentUser = authService.getCurrentUser();
    return currentUser && currentUser.role === 'admin';
  },
  
  /**
   * Get admin profile information
   * @returns {Promise} - Response with admin profile data
   */
  getAdminProfile: async () => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && currentUser.id) {
        // If we have the user ID, fetch the complete admin data
        const response = await axiosInstance.get(`/users/${currentUser.id}`);
        
        // Merge the response data with the current user data
        const mergedUserData = {
          ...currentUser,
          ...response.data,
          // Ensure ID is consistent
          id: currentUser.id
        };
        
        return mergedUserData;
      } else {
        // If no user ID is available, return the current user from localStorage
        return currentUser || {};
      }
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch admin profile' };
    }
  },
  
  /**
   * Update admin profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated admin profile
   */
  updateAdminProfile: async (profileData) => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // Update the admin with the PUT endpoint
      const response = await axiosInstance.put(`/users/${currentUser.id}`, {
        ...currentUser,
        ...profileData,
        Id: currentUser.id // Ensure ID is included and matches the URL parameter
      });
      
      // Update the user in localStorage
      if (response.status === 204) { // NoContent response
        const updatedUser = {
          ...currentUser,
          ...profileData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update admin profile' };
    }
  },
  
  /**
   * Get all users (admin only)
   * @returns {Promise} - Response with all users
   */
  getAllUsers: async () => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },
  
  /**
   * Get all accounts (admin only)
   * @returns {Promise} - Response with all accounts
   */
  getAllAccounts: async () => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.get('/accounts');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch accounts' };
    }
  },
  
  /**
   * Get all transactions (admin only)
   * @returns {Promise} - Response with all transactions
   */
  getAllTransactions: async () => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.get('/transactions');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch transactions' };
    }
  },
  
  /**
   * Get all cards (admin only)
   * @returns {Promise} - Response with all cards
   */
  getAllCards: async () => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.get('/cards');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch cards' };
    }
  },
  
  /**
   * Create a new user (admin only)
   * @param {Object} userData - User data
   * @returns {Promise} - Response with created user
   */
  createUser: async (userData) => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create user' };
    }
  },
  
  /**
   * Update a user (admin only)
   * @param {string} userId - ID of the user to update
   * @param {Object} userData - Updated user data
   * @returns {Promise} - Response with updated user
   */
  updateUser: async (userId, userData) => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },
  
  /**
   * Delete a user (admin only)
   * @param {string} userId - ID of the user to delete
   * @returns {Promise} - Response with deletion status
   */
  deleteUser: async (userId) => {
    try {
      // Ensure user is authenticated and has admin role
      if (!adminService.isAdmin()) {
        throw { message: 'Unauthorized: Admin access required' };
      }
      
      const response = await axiosInstance.delete(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  }
};

export default adminService;
