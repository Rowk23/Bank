import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import transactionsService from '../../services/transactionsService';
import accountsService from '../../services/accountsService';
import './ProfilePages.css';

/**
 * Transaction Details Page Component
 * Displays detailed information about a specific transaction
 */
const TransactionDetailsPage = () => {
  const { id: transactionId } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [accounts, setAccounts] = useState({
    sender: null,
    receiver: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch transaction details when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch transaction details
        const transactionData = await transactionsService.getTransactionDetails(transactionId);
        setTransaction(transactionData);
        
        // Fetch sender and receiver account details if available
        if (transactionData) {
          const accountPromises = [];
          
          if (transactionData.FROMid) {
            accountPromises.push(
              accountsService.getAccountDetails(transactionData.FROMid)
                .then(data => ({ type: 'sender', data }))
                .catch(() => ({ type: 'sender', data: null }))
            );
          }
          
          if (transactionData.TOid) {
            accountPromises.push(
              accountsService.getAccountDetails(transactionData.TOid)
                .then(data => ({ type: 'receiver', data }))
                .catch(() => ({ type: 'receiver', data: null }))
            );
          }
          
          // Wait for all account fetches to complete
          if (accountPromises.length > 0) {
            const results = await Promise.all(accountPromises);
            
            // Update accounts state with results
            const newAccounts = { ...accounts };
            results.forEach(result => {
              newAccounts[result.type] = result.data;
            });
            
            setAccounts(newAccounts);
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching transaction details:', err);
        setError('Failed to load transaction details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (transactionId) {
      fetchData();
    }
  }, [transactionId, accounts]); // Added accounts as a dependency

  /**
   * Format date to a readable format
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

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
   * Get transaction type display text
   * @param {string} type - Transaction type code
   * @returns {string} - Human-readable type
   */
  const getTransactionTypeDisplay = (type) => {
    switch (type) {
      case 'transfer':
        return 'Transfer';
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'payment':
        return 'Payment';
      case 'refund':
        return 'Refund';
      default:
        return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
    }
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
            <Link to="/profile/transactions" className="back-link">
              &larr; Back to Transactions
            </Link>
            <h1>Transaction Details</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading transaction details...</p>
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
          ) : transaction ? (
            <div className="transaction-details-container">
              <div className="transaction-header">
                <div className="transaction-title-container">
                  <h2 className="transaction-title">{transaction.identifier || 'Transaction'}</h2>
                  <div className="transaction-subtitle">
                    {getTransactionTypeDisplay(transaction.type)}
                  </div>
                </div>
                
                <div className="transaction-amount-container">
                  <div className="transaction-amount">
                    {formatAmount(transaction.amount, transaction.currency)}
                  </div>
                  <div className="transaction-date">
                    {formatDate(transaction.time)}
                  </div>
                </div>
              </div>
              
              <div className="transaction-details-content">
                <div className="details-section">
                  <h3>Transaction Information</h3>
                  
                  <div className="details-grid">
                    <div className="details-item">
                      <div className="details-label">Transaction ID</div>
                      <div className="details-value">{transaction.id}</div>
                    </div>
                    
                    <div className="details-item">
                      <div className="details-label">Reference</div>
                      <div className="details-value">{transaction.identifier || 'N/A'}</div>
                    </div>
                    
                    <div className="details-item">
                      <div className="details-label">Type</div>
                      <div className="details-value">{getTransactionTypeDisplay(transaction.type)}</div>
                    </div>
                    
                    <div className="details-item">
                      <div className="details-label">Date & Time</div>
                      <div className="details-value">{formatDate(transaction.time)}</div>
                    </div>
                    
                    <div className="details-item">
                      <div className="details-label">Amount</div>
                      <div className="details-value">{formatAmount(transaction.amount, transaction.currency)}</div>
                    </div>
                    
                    <div className="details-item">
                      <div className="details-label">Currency</div>
                      <div className="details-value">{transaction.currency}</div>
                    </div>
                    
                    {transaction.phone && (
                      <div className="details-item">
                        <div className="details-label">Phone</div>
                        <div className="details-value">{transaction.phone}</div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="details-section">
                  <h3>Account Information</h3>
                  
                  <div className="account-transfer-container">
                    <div className="account-box">
                      <h4>From Account</h4>
                      {accounts.sender ? (
                        <>
                          <div className="account-iban">{formatIBAN(accounts.sender.IBAN)}</div>
                          <div className="account-balance">
                            Balance: {formatAmount(accounts.sender.balance, accounts.sender.currency)}
                          </div>
                        </>
                      ) : (
                        <div className="account-placeholder">
                          Account ID: {transaction.FROMid || 'N/A'}
                        </div>
                      )}
                    </div>
                    
                    <div className="transfer-arrow">→</div>
                    
                    <div className="account-box">
                      <h4>To Account</h4>
                      {accounts.receiver ? (
                        <>
                          <div className="account-iban">{formatIBAN(accounts.receiver.IBAN)}</div>
                          <div className="account-balance">
                            Balance: {formatAmount(accounts.receiver.balance, accounts.receiver.currency)}
                          </div>
                        </>
                      ) : (
                        <div className="account-placeholder">
                          Account ID: {transaction.TOid || 'N/A'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="transaction-actions">
                  <button className="btn btn-secondary">Download Receipt</button>
                  <button className="btn btn-primary">Report an Issue</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="profile-error">
              <p>Transaction not found.</p>
              <Link to="/profile/transactions" className="btn btn-primary">
                Back to Transactions
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPage;
