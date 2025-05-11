import axiosInstance from '../utils/axiosConfig';
import authService from './authService';

/**
 * Users Service
 * Handles API requests related to user profiles
 * Implements secure communication with the backend API
 */
const usersService = {
  /**
   * Get the current user's profile information
   * @returns {Promise} - Response with user profile data
   */
  getUserProfile: async () => {
    try {
      // Get the current user from localStorage (set during login)
      const currentUser = authService.getCurrentUser();
      
      if (currentUser && currentUser.id) {
        // If we have the user ID, fetch the complete user data
        const response = await axiosInstance.get(`/users/${currentUser.id}`);
        
        // Merge the response data with the current user data to ensure we have all information
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
      throw error.response?.data || { message: 'Failed to fetch user profile' };
    }
  },
  
  /**
   * Update the user's profile information
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} - Response with updated user profile
   */
  updateUserProfile: async (profileData) => {
    try {
      // Get the current user from localStorage
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // Update the user with the PUT endpoint
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
      throw error.response?.data || { message: 'Failed to update user profile' };
    }
  },
  
  /**
   * Get a specific user by ID
   * @param {string} userId - ID of the user
   * @returns {Promise} - Response with user details
   */
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user details' };
    }
  }
};

export default usersService;
