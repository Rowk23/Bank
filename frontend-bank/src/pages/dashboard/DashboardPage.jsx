import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardPage.css';

/**
 * Dashboard Page Component
 * Main landing page after authentication
 * Displays user information and account summary
 */
const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Simulate loading of dashboard data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle logout button click
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
              <div className="account-card">
                <div className="account-card-header">
                  <h4>Checking Account</h4>
                  <span className="account-number">XXXX-XXXX-1234</span>
                </div>
                <div className="account-card-balance">
                  <span className="balance-label">Available Balance</span>
                  <span className="balance-amount">$2,500.00</span>
                </div>
                <div className="account-card-footer">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
              
              <div className="account-card">
                <div className="account-card-header">
                  <h4>Savings Account</h4>
                  <span className="account-number">XXXX-XXXX-5678</span>
                </div>
                <div className="account-card-balance">
                  <span className="balance-label">Available Balance</span>
                  <span className="balance-amount">$10,750.00</span>
                </div>
                <div className="account-card-footer">
                  <button className="btn btn-primary">View Details</button>
                </div>
              </div>
            </div>
          </section>
          
          <section className="recent-transactions">
            <h3>Recent Transactions</h3>
            <div className="transactions-list">
              <div className="transaction-item">
                <div className="transaction-icon deposit">
                  <span>↓</span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-title">Salary Deposit</span>
                  <span className="transaction-date">May 10, 2025</span>
                </div>
                <div className="transaction-amount deposit">
                  +$3,500.00
                </div>
              </div>
              
              <div className="transaction-item">
                <div className="transaction-icon withdrawal">
                  <span>↑</span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-title">Grocery Store</span>
                  <span className="transaction-date">May 8, 2025</span>
                </div>
                <div className="transaction-amount withdrawal">
                  -$125.30
                </div>
              </div>
              
              <div className="transaction-item">
                <div className="transaction-icon withdrawal">
                  <span>↑</span>
                </div>
                <div className="transaction-details">
                  <span className="transaction-title">Monthly Rent</span>
                  <span className="transaction-date">May 5, 2025</span>
                </div>
                <div className="transaction-amount withdrawal">
                  -$1,200.00
                </div>
              </div>
            </div>
            <div className="view-all-container">
              <button className="btn btn-secondary">View All Transactions</button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
