import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import './AdminPages.css';

/**
 * Admin Dashboard Page
 * Displays overview statistics and recent activity
 * Restricted to users with admin role
 */
const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    accounts: 0,
    transactions: 0,
    cards: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Check if user is authenticated and has admin role
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = adminService.isAdmin();

  useEffect(() => {
    // Fetch dashboard data if user is authenticated and has admin role
    if (isAuthenticated && isAdmin) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  // Fetch dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel for better performance
      const [users, accounts, transactions, cards] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllAccounts(),
        adminService.getAllTransactions(),
        adminService.getAllCards()
      ]);

      // Set statistics
      setStats({
        users: users.length,
        accounts: accounts.length,
        transactions: transactions.length,
        cards: cards.length
      });

      // Get recent users (last 5)
      const sortedUsers = [...users].sort((a, b) => b.id - a.id);
      setRecentUsers(sortedUsers.slice(0, 5));

      // Get recent transactions (last 5)
      const sortedTransactions = [...transactions].sort((a, b) => 
        new Date(b.time) - new Date(a.time)
      );
      setRecentTransactions(sortedTransactions.slice(0, 5));

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency for display
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-dashboard-page">
      <div className="admin-layout">
        <div className="admin-sidebar-container">
          <AdminSidebar />
        </div>
        
        <div className="admin-content">
          <h1 className="admin-page-title">Admin Dashboard</h1>
          
          {loading ? (
            <div className="admin-loading">Loading dashboard data...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <>
              {/* Statistics Cards */}
              <div className="admin-stats-grid">
                <div className="admin-stats-card users">
                  <div className="admin-stats-title">Total Users</div>
                  <div className="admin-stats-value">{stats.users}</div>
                  <div className="admin-stats-description">Registered users in the system</div>
                </div>
                
                <div className="admin-stats-card accounts">
                  <div className="admin-stats-title">Total Accounts</div>
                  <div className="admin-stats-value">{stats.accounts}</div>
                  <div className="admin-stats-description">Active bank accounts</div>
                </div>
                
                <div className="admin-stats-card transactions">
                  <div className="admin-stats-title">Total Transactions</div>
                  <div className="admin-stats-value">{stats.transactions}</div>
                  <div className="admin-stats-description">Processed transactions</div>
                </div>
                
                <div className="admin-stats-card cards">
                  <div className="admin-stats-title">Total Cards</div>
                  <div className="admin-stats-value">{stats.cards}</div>
                  <div className="admin-stats-description">Issued bank cards</div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="admin-recent-activity">
                <div className="admin-section">
                  <h2 className="admin-section-title">Recent Users</h2>
                  
                  {recentUsers.length > 0 ? (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.Username}</td>
                            <td>{user.First_name} {user.Last_name}</td>
                            <td>{user.Email}</td>
                            <td>
                              <span className={`status-badge ${user.Type.toLowerCase()}`}>
                                {user.Type}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="admin-no-data">No users found</div>
                  )}
                </div>
                
                <div className="admin-section">
                  <h2 className="admin-section-title">Recent Transactions</h2>
                  
                  {recentTransactions.length > 0 ? (
                    <table className="admin-data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>From</th>
                          <th>To</th>
                          <th>Amount</th>
                          <th>Type</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentTransactions.map(transaction => (
                          <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.FROMid}</td>
                            <td>{transaction.TOid}</td>
                            <td>{formatCurrency(transaction.amount, transaction.currency)}</td>
                            <td>
                              <span className={`status-badge ${transaction.type.toLowerCase()}`}>
                                {transaction.type}
                              </span>
                            </td>
                            <td>{formatDate(transaction.time)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="admin-no-data">No transactions found</div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
