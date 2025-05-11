import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import TransactionItem from '../../components/profile/TransactionItem';
import accountsService from '../../services/accountsService';
import transactionsService from '../../services/transactionsService';
import './ProfilePages.css';

/**
 * Account Details Page Component
 * Displays detailed information about a specific account
 * Shows recent transactions and account statistics
 */
const AccountDetailsPage = () => {
  const { id: accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch account details and recent transactions when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch account details
        const accountData = await accountsService.getAccountDetails(accountId);
        setAccount(accountData);
        
        // Fetch recent transactions for this account
        const transactionsData = await transactionsService.getAccountTransactions(accountId);
        
        // Sort transactions by date (newest first) and take the 5 most recent
        const sortedTransactions = transactionsData
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);
        
        setRecentTransactions(sortedTransactions);
        setError(null);
      } catch (err) {
        console.error('Error fetching account details:', err);
        setError('Failed to load account details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (accountId) {
      fetchData();
    }
  }, [accountId]);

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

  /**
   * Format amount with currency symbol
   * @param {number} amount - Account balance
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
   * Calculate account statistics based on transactions
   * @returns {Object} - Account statistics
   */
  const calculateAccountStats = () => {
    if (!recentTransactions || recentTransactions.length === 0) {
      return {
        incoming: 0,
        outgoing: 0,
        incomingCount: 0,
        outgoingCount: 0
      };
    }
    
    let incoming = 0;
    let outgoing = 0;
    let incomingCount = 0;
    let outgoingCount = 0;
    
    recentTransactions.forEach(transaction => {
      // Check if this account is the receiver (incoming transaction)
      if (transaction.TOid === parseInt(accountId)) {
        incoming += transaction.amount;
        incomingCount++;
      }
      
      // Check if this account is the sender (outgoing transaction)
      if (transaction.FROMid === parseInt(accountId)) {
        outgoing += transaction.amount;
        outgoingCount++;
      }
    });
    
    return {
      incoming,
      outgoing,
      incomingCount,
      outgoingCount
    };
  };

  // Calculate account statistics
  const stats = calculateAccountStats();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <Link to="/profile/accounts" className="back-link">
              &larr; Back to Accounts
            </Link>
            <h1>Account Details</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading account details...</p>
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
          ) : account ? (
            <div className="account-details-container">
              <div className="account-details-header">
                <div className="account-details-title">
                  <h2>{account.currency} Account</h2>
                  <div className="account-iban">{formatIBAN(account.IBAN)}</div>
                </div>
                
                <div className="account-balance-container">
                  <div className="account-balance-label">Current Balance</div>
                  <div className="account-balance-amount">
                    {formatAmount(account.balance, account.currency)}
                  </div>
                </div>
              </div>
              
              <div className="account-stats-container">
                <div className="account-stat-item">
                  <div className="stat-label">Incoming</div>
                  <div className="stat-value positive">
                    {formatAmount(stats.incoming, account.currency)}
                  </div>
                  <div className="stat-subtitle">
                    {stats.incomingCount} transaction{stats.incomingCount !== 1 ? 's' : ''}
                  </div>
                </div>
                
                <div className="account-stat-item">
                  <div className="stat-label">Outgoing</div>
                  <div className="stat-value negative">
                    {formatAmount(stats.outgoing, account.currency)}
                  </div>
                  <div className="stat-subtitle">
                    {stats.outgoingCount} transaction{stats.outgoingCount !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              
              <div className="account-details-section">
                <div className="section-header">
                  <h3>Recent Transactions</h3>
                  <Link to={`/profile/accounts/${accountId}/transactions`} className="view-all-link">
                    View All
                  </Link>
                </div>
                
                {recentTransactions.length === 0 ? (
                  <div className="empty-transactions">
                    <p>No transactions found for this account.</p>
                  </div>
                ) : (
                  <div className="transactions-list">
                    {recentTransactions.map(transaction => (
                      <TransactionItem 
                        key={transaction.id} 
                        transaction={transaction}
                        linkTo={`/profile/accounts/${accountId}/transactions/${transaction.id}`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="account-actions-container">
                <button className="btn btn-primary">Transfer Money</button>
                <button className="btn btn-secondary">Download Statement</button>
                <button className="btn btn-outline">Manage Account</button>
              </div>
            </div>
          ) : (
            <div className="profile-error">
              <p>Account not found.</p>
              <Link to="/profile/accounts" className="btn btn-primary">
                Back to Accounts
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
