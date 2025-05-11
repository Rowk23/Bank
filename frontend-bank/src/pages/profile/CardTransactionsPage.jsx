import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import TransactionItem from '../../components/profile/TransactionItem';
import TransactionFilters from '../../components/profile/TransactionFilters';
import profileService from '../../services/profile/profileService';
import './ProfilePages.css';

/**
 * Card Transactions Page Component
 * Displays all transactions associated with a specific card
 * Allows filtering and sorting of transactions
 */
const CardTransactionsPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    currency: ''
  });

  // Fetch card details and transactions when component mounts
  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setLoading(true);
        
        // Fetch card details
        const cardData = await profileService.getCardDetails(cardId);
        setCard(cardData);
        
        // Fetch card transactions
        const transactionsData = await profileService.getCardTransactions(cardId);
        setTransactions(transactionsData);
        setFilteredTransactions(transactionsData);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching card transactions:', err);
        setError('Failed to load card transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (cardId) {
      fetchCardData();
    }
  }, [cardId]);

  /**
   * Handle filter changes and apply them to transactions
   * @param {Object} newFilters - Updated filter values
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Apply filters to transactions
    let filtered = [...transactions];
    
    // Filter by transaction type
    if (newFilters.type) {
      filtered = filtered.filter(t => t.type === newFilters.type);
    }
    
    // Filter by date range
    if (newFilters.dateFrom) {
      const fromDate = new Date(newFilters.dateFrom);
      filtered = filtered.filter(t => new Date(t.time) >= fromDate);
    }
    
    if (newFilters.dateTo) {
      const toDate = new Date(newFilters.dateTo);
      filtered = filtered.filter(t => new Date(t.time) <= toDate);
    }
    
    // Filter by amount range
    if (newFilters.minAmount) {
      filtered = filtered.filter(t => t.amount >= parseFloat(newFilters.minAmount));
    }
    
    if (newFilters.maxAmount) {
      filtered = filtered.filter(t => t.amount <= parseFloat(newFilters.maxAmount));
    }
    
    // Filter by currency
    if (newFilters.currency) {
      filtered = filtered.filter(t => t.currency === newFilters.currency);
    }
    
    setFilteredTransactions(filtered);
  };

  /**
   * Clear all filters and reset to original transactions
   */
  const handleClearFilters = () => {
    setFilters({
      type: '',
      dateFrom: '',
      dateTo: '',
      minAmount: '',
      maxAmount: '',
      currency: ''
    });
    setFilteredTransactions(transactions);
  };

  /**
   * Format card number to show only last 4 digits
   * @param {string} number - Card number
   * @returns {string} - Formatted card number
   */
  const formatCardNumber = (number) => {
    if (!number) return 'XXXX-XXXX-XXXX-XXXX';
    const lastFour = number.slice(-4);
    return `XXXX-XXXX-XXXX-${lastFour}`;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <Link to={`/profile/cards/${cardId}`} className="back-link">
              &larr; Back to Card Details
            </Link>
            <h1>Card Transactions</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading transactions...</p>
            </div>
          ) : error ? (
            <div className="profile-error">
              <p>{error}</p>
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {card && (
                <div className="card-info-summary">
                  <h2>Card Information</h2>
                  <p>Card Number: {formatCardNumber(card.cardNumber)}</p>
                  {card.accountNumber && <p>Account: {card.accountNumber}</p>}
                </div>
              )}
              
              <div className="transactions-container">
                <div className="transactions-header">
                  <h2>Transactions</h2>
                  <div className="transactions-count">
                    {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <TransactionFilters 
                  filters={filters} 
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
                
                {filteredTransactions.length === 0 ? (
                  <div className="empty-transactions">
                    <p>No transactions found for this card{Object.values(filters).some(v => v) ? ' with the selected filters' : ''}.</p>
                    {Object.values(filters).some(v => v) && (
                      <button 
                        className="btn btn-secondary"
                        onClick={handleClearFilters}
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="transactions-list">
                    {filteredTransactions.map(transaction => (
                      <TransactionItem 
                        key={transaction.id} 
                        transaction={transaction} 
                        linkTo={`/profile/cards/${cardId}/transaction/${transaction.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardTransactionsPage;
