import { useState, useEffect } from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import AccountItem from '../../components/profile/AccountItem';
import accountsService from '../../services/accountsService';
import './ProfilePages.css';

/**
 * Accounts Page Component
 * Displays all accounts associated with the user
 */
const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all user accounts when component mounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        
        // Fetch user accounts
        const accountsData = await accountsService.getUserAccounts();
        
        setAccounts(accountsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching accounts:', err);
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  /**
   * Calculate total balance across all accounts
   * @returns {Object} - Total balance with currency breakdown
   */
  const calculateTotalBalance = () => {
    const totals = {};
    
    accounts.forEach(account => {
      const { currency, balance } = account;
      
      if (!totals[currency]) {
        totals[currency] = 0;
      }
      
      totals[currency] += balance;
    });
    
    return totals;
  };

  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @param {string} currency - Currency code
   * @returns {string} - Formatted amount with currency symbol
   */
  const formatAmount = (amount, currency = 'USD') => {
    if (amount === undefined || amount === null) return '0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <h1>My Accounts</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading accounts...</p>
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
            <div className="accounts-container">
              {accounts.length === 0 ? (
                <div className="empty-accounts">
                  <p>You don't have any accounts yet.</p>
                  <button className="btn btn-primary">Open New Account</button>
                </div>
              ) : (
                <>
                  <div className="accounts-summary">
                    <h2>Account Summary</h2>
                    <div className="balance-summary">
                      <div className="balance-title">Total Balance</div>
                      <div className="balance-breakdown">
                        {Object.entries(calculateTotalBalance()).map(([currency, amount]) => (
                          <div key={currency} className="balance-item">
                            <span className="balance-amount">{formatAmount(amount, currency)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="accounts-list">
                    <h2>Your Accounts</h2>
                    {accounts.map(account => (
                      <AccountItem 
                        key={account.id} 
                        account={account} 
                      />
                    ))}
                  </div>
                </>
              )}
              
              <div className="accounts-actions">
                <button className="btn btn-primary">Open New Account</button>
                <button className="btn btn-secondary">Download Statement</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountsPage;
