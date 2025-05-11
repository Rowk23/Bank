import axiosInstance from '../../utils/axiosConfig';
import authService from '../authService';

/**
 * Profile Service
 * Handles API requests related to user profile, cards, and transactions
 * Implements secure communication with the backend API
 */
const profileService = {
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
   * Get all cards associated with the user
   * @returns {Promise} - Response with user's cards
   */
  getUserCards: async () => {
    try {
      // Get the current user from localStorage
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // First get the user's accounts
      // According to the backend documentation, a User can have multiple Accounts
      // and an Account can have multiple Cards
      const accountsResponse = await axiosInstance.get('/accounts');
      
      // Filter accounts that belong to the current user
      const userAccounts = accountsResponse.data.filter(account => 
        account.ownerId === parseInt(currentUser.id) || 
        account.UsersId === parseInt(currentUser.id)
      );
      
      // Get all cards
      const cardsResponse = await axiosInstance.get('/cards');
      
      // Filter cards that belong to the user's accounts
      const userAccountIds = userAccounts.map(account => account.id);
      const userCards = cardsResponse.data.filter(card => 
        userAccountIds.includes(card.accountId)
      );
      
      return userCards;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user cards' };
    }
  },
  
  /**
   * Get details of a specific card
   * @param {string} cardId - ID of the card
   * @returns {Promise} - Response with card details
   */
  getCardDetails: async (cardId) => {
    try {
      // Use the existing endpoint to get card details
      const response = await axiosInstance.get(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch card details' };
    }
  },
  
  /**
   * Get transactions for a specific card
   * @param {string} cardId - ID of the card
   * @returns {Promise} - Response with card transactions
   */
  getCardTransactions: async (cardId) => {
    try {
      // First get the card details to find its associated account
      const cardResponse = await axiosInstance.get(`/cards/${cardId}`);
      const card = cardResponse.data;
      
      // Get the account ID associated with this card
      // Note: The exact field name might vary based on the actual API response
      const accountId = card.accountId;
      
      if (!accountId) {
        throw { message: 'Card is not associated with any account' };
      }
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      // Filter transactions related to this account
      // According to the backend documentation, a Transaction has FROMid and TOid
      // which reference Accounts
      const cardTransactions = transactionsResponse.data.filter(transaction => 
        transaction.FROMid === accountId || transaction.TOid === accountId
      );
      
      return cardTransactions;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch card transactions' };
    }
  },
  
  /**
   * Get all user transactions
   * @param {Object} filters - Optional filters for transactions
   * @returns {Promise} - Response with user transactions
   */
  getUserTransactions: async (filters) => {
    try {
      // Get the current user from localStorage
      const currentUser = authService.getCurrentUser();
      
      if (!currentUser || !currentUser.id) {
        throw { message: 'User not authenticated' };
      }
      
      // First get the user's accounts
      const accountsResponse = await axiosInstance.get('/accounts');
      
      // Filter accounts that belong to the current user
      const userAccounts = accountsResponse.data.filter(account => 
        account.ownerId === parseInt(currentUser.id) || 
        account.UsersId === parseInt(currentUser.id)
      );
      
      // Get account IDs for filtering transactions
      const userAccountIds = userAccounts.map(account => account.id);
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      let userTransactions = transactionsResponse.data.filter(transaction => 
        userAccountIds.includes(transaction.FROMid) || 
        userAccountIds.includes(transaction.TOid)
      );
      
      // Apply any client-side filters if provided
      if (filters && Object.keys(filters).length > 0) {
        // Filter by transaction type
        if (filters.type) {
          userTransactions = userTransactions.filter(t => t.type === filters.type);
        }
        // Filter by date range
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          userTransactions = userTransactions.filter(t => new Date(t.time) >= fromDate);
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          userTransactions = userTransactions.filter(t => new Date(t.time) <= toDate);
        }
        // Filter by amount range
        if (filters.minAmount) {
          userTransactions = userTransactions.filter(t => t.amount >= filters.minAmount);
        }
        if (filters.maxAmount) {
          userTransactions = userTransactions.filter(t => t.amount <= filters.maxAmount);
        }
        // Filter by currency
        if (filters.currency) {
          userTransactions = userTransactions.filter(t => t.currency === filters.currency);
        }
      }
      
      return userTransactions;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user transactions' };
    }
  },
  
  /**
   * Get details of a specific transaction
   * @param {string} transactionId - ID of the transaction
   * @returns {Promise} - Response with transaction details
   */
  getTransactionDetails: async (transactionId) => {
    try {
      // Use the existing endpoint to get transaction details
      const response = await axiosInstance.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch transaction details' };
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
   * Get all accounts associated with the user
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
      
      // Filter accounts that belong to the current user
      const userAccounts = accountsResponse.data.filter(account => 
        account.ownerId === parseInt(currentUser.id) || 
        account.UsersId === parseInt(currentUser.id)
      );
      
      return userAccounts;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user accounts' };
    }
  },
  
  /**
   * Get transactions for a specific account
   * @param {string} accountId - ID of the account
   * @returns {Promise} - Response with account transactions
   */
  getAccountTransactions: async (accountId) => {
    try {
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      // Filter transactions that involve this account (as sender or receiver)
      const accountTransactions = transactionsResponse.data.filter(transaction => 
        transaction.FROMid === parseInt(accountId) || 
        transaction.TOid === parseInt(accountId)
      );
      
      return accountTransactions;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch account transactions' };
    }
  }
};

export default profileService;
