import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import accountsService from '../../services/accountsService';
import transactionsService from '../../services/transactionsService';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch user accounts
        const userAccounts = await accountsService.getUserAccounts();
        setAccounts(userAccounts);

        // Fetch transactions for user accounts
        // Assuming getUserTransactions accepts optional filters, else call without filters
        const userTransactions = await transactionsService.getUserTransactions();
        // Sort transactions by date descending (most recent first)
        userTransactions.sort((a, b) => new Date(b.time) - new Date(a.time));
        setTransactions(userTransactions);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="logo-container">
          <h1>Bank App</h1>
        </div>
        <div className="user-info">
          <span>Welcome, {user?.first_name || 'User'}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="sidebar">
          <nav className="dashboard-nav">
            <ul>
              <li className="active">
                <a href="#dashboard">Dashboard</a>
              </li>
              <li>
                <a href="#accounts">Accounts</a>
              </li>
              <li>
                <a href="#transactions">Transactions</a>
              </li>
              <li>
                <a href="#cards">Cards</a>
              </li>
              <li>
                <a href="#profile">Profile</a>
              </li>
            </ul>
          </nav>
        </div>

        <main className="main-content">
          <section className="welcome-section">
            <h2>Welcome to Your Banking Dashboard</h2>
            <p>Here you can manage your accounts, view transactions, and more.</p>
          </section>

          <section className="accounts-summary">
            <h3>Accounts Summary</h3>
            <div className="accounts-grid">
              {accounts.length === 0 && <p>No accounts found.</p>}
              {accounts.map(account => (
                <div key={account.id} className="account-card">
                  <div className="account-card-header">
                    <h4>{account.type || 'Account'}</h4>
                    <span className="account-number">{maskAccountNumber(account.iban)}</span>
                  </div>
                  <div className="account-card-balance">
                    <span className="balance-label">Available Balance</span>
                    <span className="balance-amount">
                      {account.currency} {account.balance.toFixed(2)}
                    </span>
                  </div>
                  <div className="account-card-footer">
                    <button className="btn btn-primary" onClick={() => navigate(`/accounts/${account.id}`)}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="recent-transactions">
            <h3>Recent Transactions</h3>
            {transactions.length === 0 ? (
              <p>No recent transactions found.</p>
            ) : (
              <div className="transactions-list">
                {transactions.slice(0, 5).map(tx => (
                  <TransactionItem key={tx.id} transaction={tx} />
                ))}
              </div>
            )}
            <div className="view-all-container">
              <button className="btn btn-secondary" onClick={() => navigate('/transactions')}>
                View All Transactions
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

// Helper component to render individual transaction
const TransactionItem = ({ transaction }) => {
  // Determine if deposit or withdrawal from user perspective
  // If user's account is TOid => deposit, if FROMid => withdrawal
  // This example assumes you have access to user account IDs or you can pass them as prop if needed
  // Here, let's just use amount sign as a simple indicator
  const isDeposit = transaction.amount > 0;

  // Format date nicely
  const dateStr = new Date(transaction.time).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="transaction-item">
      <div className={`transaction-icon ${isDeposit ? 'deposit' : 'withdrawal'}`}>
        <span>{isDeposit ? '↓' : '↑'}</span>
      </div>
      <div className="transaction-details">
        <span className="transaction-title">{transaction.type || 'Transaction'}</span>
        <span className="transaction-date">{dateStr}</span>
      </div>
      <div className={`transaction-amount ${isDeposit ? 'deposit' : 'withdrawal'}`}>
        {isDeposit ? '+' : '-'}
        {transaction.currency} {Math.abs(transaction.amount).toFixed(2)}
      </div>
    </div>
  );
};

// Utility to mask IBAN or account numbers for privacy: show last 4 chars only
const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return '****';
  return '****-****-' + accountNumber.slice(-4);
};

export default DashboardPage;
