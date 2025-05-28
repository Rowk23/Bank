import axiosInstance from '../utils/axiosConfig';
import authService from './authService';
import accountsService from './accountsService';

/**
 * Transactions Service
 * Handles API requests related to transactions
 * Implements secure communication with the backend API
 */
const transactionsService = {
  /**
   * Get all transactions for the current user across all accounts
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
      
      // Get user accounts first
      const userAccounts = await accountsService.getUserAccounts();
      
      // Get account IDs for filtering transactions
      const userAccountIds = userAccounts.map(account => account.id);
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      // Filter transactions that involve the user's accounts
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
          userTransactions = userTransactions.filter(t => t.amount >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          userTransactions = userTransactions.filter(t => t.amount <= parseFloat(filters.maxAmount));
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
   * Get transactions for a specific account
   * @param {string} accountId - ID of the account
   * @param {Object} filters - Optional filters for transactions
   * @returns {Promise} - Response with account transactions
   */
  getAccountTransactions: async (accountId, filters) => {
    try {
      if (!accountId) {
        throw new Error('Account ID is required');
      }
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      // Filter transactions that involve this account (as sender or receiver)
      let accountTransactions = transactionsResponse.data.filter(transaction => 
        transaction.FROMid === parseInt(accountId) || 
        transaction.TOid === parseInt(accountId)
      );
      
      // Apply any client-side filters if provided
      if (filters && Object.keys(filters).length > 0) {
        // Apply the same filtering logic as in getUserTransactions
        if (filters.type) {
          accountTransactions = accountTransactions.filter(t => t.type === filters.type);
        }
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          accountTransactions = accountTransactions.filter(t => new Date(t.time) >= fromDate);
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          accountTransactions = accountTransactions.filter(t => new Date(t.time) <= toDate);
        }
        if (filters.minAmount) {
          accountTransactions = accountTransactions.filter(t => t.amount >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          accountTransactions = accountTransactions.filter(t => t.amount <= parseFloat(filters.maxAmount));
        }
        if (filters.currency) {
          accountTransactions = accountTransactions.filter(t => t.currency === filters.currency);
        }
      }
      
      return accountTransactions;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch account transactions' };
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
   * Create a new transaction
   * @param {Object} transactionData - Transaction data
   * @returns {Promise} - Response with created transaction
   */
  createTransaction: async (transactionData) => {
    try {
      if (!transactionData.FROMid || !transactionData.amount) {
        throw new Error('Missing required transaction fields');
      }
      
      // Add timestamp if not provided
      const transaction = {
        ...transactionData,
        time: transactionData.time || new Date().toISOString(),
        identifier: transactionData.identifier || `TRX-${Date.now()}`
      };
      
      const response = await axiosInstance.post('/transactions', transaction);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create transaction' };
    }
  }
};

export default transactionsService;
