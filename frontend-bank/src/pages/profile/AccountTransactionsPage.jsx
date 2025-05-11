import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import TransactionItem from '../../components/profile/TransactionItem';
import TransactionFilters from '../../components/profile/TransactionFilters';
import accountsService from '../../services/accountsService';
import transactionsService from '../../services/transactionsService';
import './ProfilePages.css';

/**
 * Account Transactions Page Component
 * Displays all transactions for a specific account
 * Allows filtering and sorting of transactions
 */
const AccountTransactionsPage = () => {
  const { id: accountId } = useParams();
  const [account, setAccount] = useState(null);
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

  // Fetch account details and transactions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch account details
        const accountData = await accountsService.getAccountDetails(accountId);
        setAccount(accountData);
        
        // Fetch transactions for this account
        const transactionsData = await transactionsService.getAccountTransactions(accountId);
        
        // Sort transactions by date (newest first)
        const sortedTransactions = transactionsData.sort((a, b) => 
          new Date(b.time) - new Date(a.time)
        );
        
        setTransactions(sortedTransactions);
        setFilteredTransactions(sortedTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching account transactions:', err);
        setError('Failed to load transactions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchData();
    }
  }, [accountId]);

  /**
   * Format amount with currency symbol
   * @param {number} amount - Transaction amount
   * @param {string} currency - Currency code
   * @returns {string} - Formatted amount with currency
   */
  const formatAmount = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

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
   * Get unique transaction types from all transactions
   * @returns {Array} - List of unique transaction types
   */
  const getTransactionTypes = () => {
    const types = transactions.map(t => t.type).filter(Boolean);
    return [...new Set(types)];
  };

  /**
   * Get unique currencies from all transactions
   * @returns {Array} - List of unique currencies
   */
  const getCurrencies = () => {
    const currencies = transactions.map(t => t.currency).filter(Boolean);
    return [...new Set(currencies)];
  };

  /**
   * Format IBAN to be more readable
   * @param {string} iban - IBAN string
   * @returns {string} - Formatted IBAN
   */
  const formatIBAN = (iban) => {
    if (!iban) return 'N/A';
    // Format IBAN in groups of 4 characters
    return iban.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <Link to={`/profile/accounts/${accountId}`} className="back-link">
              &larr; Back to Account Details
            </Link>
            <h1>Account Transactions</h1>
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
            <div className="transactions-container">
              {account && (
                <div className="account-summary">
                  <div className="account-summary-details">
                    <div className="account-summary-title">
                      {account.currency} Account
                    </div>
                    <div className="account-summary-iban">
                      {formatIBAN(account.IBAN)}
                    </div>
                  </div>
                  <div className="account-summary-balance">
                    Balance: {formatAmount(account.balance, account.currency)}
                  </div>
                </div>
              )}
              
              <div className="transactions-header">
                <h2>Transaction History</h2>
                <div className="transactions-count">
                  {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <TransactionFilters 
                filters={filters} 
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                transactionTypes={getTransactionTypes()}
                currencies={getCurrencies()}
              />
              
              {filteredTransactions.length === 0 ? (
                <div className="empty-transactions">
                  <p>No transactions found{Object.values(filters).some(v => v) ? ' with the selected filters' : ''}.</p>
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
                      linkTo={`/profile/accounts/${accountId}/transactions/${transaction.id}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountTransactionsPage;
