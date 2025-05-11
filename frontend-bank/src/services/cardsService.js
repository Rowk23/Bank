import axiosInstance from '../utils/axiosConfig';
import authService from './authService';
import accountsService from './accountsService';

/**
 * Cards Service
 * Handles API requests related to bank cards
 * Implements secure communication with the backend API
 */
const cardsService = {
  /**
   * Get all cards associated with the current user
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
      const userAccounts = await accountsService.getUserAccounts();
      
      // Get account IDs for filtering cards
      const userAccountIds = userAccounts.map(account => account.id);
      
      // Get all cards
      const cardsResponse = await axiosInstance.get('/cards');
      
      // Filter cards that belong to the user's accounts
      const userCards = cardsResponse.data.filter(card => 
        userAccountIds.includes(card.AccountsId)
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
   * @param {Object} filters - Optional filters for transactions
   * @returns {Promise} - Response with card transactions
   */
  getCardTransactions: async (cardId, filters) => {
    try {
      // First get the card details to find its associated account
      const card = await cardsService.getCardDetails(cardId);
      
      // Get the account ID associated with this card
      const accountId = card.AccountsId;
      
      if (!accountId) {
        throw { message: 'Card is not associated with any account' };
      }
      
      // Get all transactions
      const transactionsResponse = await axiosInstance.get('/transactions');
      
      // Filter transactions related to this account
      let cardTransactions = transactionsResponse.data.filter(transaction => 
        transaction.FROMid === accountId || transaction.TOid === accountId
      );
      
      // Apply any client-side filters if provided
      if (filters && Object.keys(filters).length > 0) {
        // Apply the same filtering logic as in transactionsService
        if (filters.type) {
          cardTransactions = cardTransactions.filter(t => t.type === filters.type);
        }
        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          cardTransactions = cardTransactions.filter(t => new Date(t.time) >= fromDate);
        }
        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          cardTransactions = cardTransactions.filter(t => new Date(t.time) <= toDate);
        }
        if (filters.minAmount) {
          cardTransactions = cardTransactions.filter(t => t.amount >= parseFloat(filters.minAmount));
        }
        if (filters.maxAmount) {
          cardTransactions = cardTransactions.filter(t => t.amount <= parseFloat(filters.maxAmount));
        }
        if (filters.currency) {
          cardTransactions = cardTransactions.filter(t => t.currency === filters.currency);
        }
      }
      
      return cardTransactions;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch card transactions' };
    }
  },
  
  /**
   * Create a new card for a specific account
   * @param {Object} cardData - Card data including AccountsId
   * @returns {Promise} - Response with created card
   */
  createCard: async (cardData) => {
    try {
      // Ensure AccountsId is provided
      if (!cardData.AccountsId) {
        throw new Error('Account ID is required to create a card');
      }
      
      const response = await axiosInstance.post('/cards', cardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create card' };
    }
  },
  
  /**
   * Update a card
   * @param {string} cardId - ID of the card to update
   * @param {Object} cardData - Updated card data
   * @returns {Promise} - Response with updated card
   */
  updateCard: async (cardId, cardData) => {
    try {
      const response = await axiosInstance.put(`/cards/${cardId}`, cardData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update card' };
    }
  },
  
  /**
   * Delete a card
   * @param {string} cardId - ID of the card to delete
   * @returns {Promise} - Response with deletion status
   */
  deleteCard: async (cardId) => {
    try {
      const response = await axiosInstance.delete(`/cards/${cardId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete card' };
    }
  }
};

export default cardsService;
