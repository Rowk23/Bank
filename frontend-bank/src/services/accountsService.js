import axiosInstance from '../utils/axiosConfig';
import authService from './authService';

/**
 * Accounts Service
 * Handles API requests related to bank accounts
 * Implements secure communication with the backend API
 */
const accountsService = {
  /**
   * Get all accounts associated with the current user
   * @returns {Promise} - Response with user's accounts
   */
  getUserAccounts: async () => {
    try {
      // Get the current user from localStorage
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // Get all accounts
      const accountsResponse = await axiosInstance.get('/accounts');
      accountsResponse.data.forEach(account => console.log('Account fields:', Object.keys(account)));
      
      // Filter accounts that belong to the current user
      const userAccounts = accountsResponse.data.filter(account =>
        Number(account.usersId) === Number(currentUser.id)

      );
      
      return userAccounts;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user accounts' };
    }
  },
  
  /**
   * Get details of a specific account
   * @param {string} accountId - ID of the account
   * @returns {Promise} - Response with account details
   */
  getAccountDetails: async (accountId) => {
    try {
      // Use the existing endpoint to get account details
      const response = await axiosInstance.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch account details' };
    }
  },
  
  /**
   * Create a new account for the current user
   * @param {Object} accountData - Account data (currency, etc.)
   * @returns {Promise} - Response with created account
   */
  createAccount: async (accountData) => {
    try {
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // Create a new account with the current user as owner
      const newAccount = {
        ...accountData,
        ownerId: parseInt(currentUser.id),
        UsersId: parseInt(currentUser.id),
        balance: accountData.initialBalance || 0
      };
      
      const response = await axiosInstance.post('/accounts', newAccount);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create account' };
    }
  },
  
  /**
   * Update an existing account
   * @param {string} accountId - ID of the account to update
   * @param {Object} accountData - Updated account data
   * @returns {Promise} - Response with updated account
   */
  updateAccount: async (accountId, accountData) => {
    try {
      const response = await axiosInstance.put(`/accounts/${accountId}`, accountData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update account' };
    }
  },
  
  /**
   * Delete an account
   * @param {string} accountId - ID of the account to delete
   * @returns {Promise} - Response with deletion status
   */
  deleteAccount: async (accountId) => {
    try {
      const response = await axiosInstance.delete(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete account' };
    }
  }
};

export default accountsService;
