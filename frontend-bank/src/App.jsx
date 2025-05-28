import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import ProfileEditPage from './pages/profile/ProfileEditPage';
import CardsPage from './pages/profile/CardsPage';
import CardDetailsPage from './pages/profile/CardDetailsPage';
import CardTransactionsPage from './pages/profile/CardTransactionsPage';
import CardTransactionDetailsPage from './pages/profile/CardTransactionDetailsPage';
import TransactionsPage from './pages/profile/TransactionsPage';
import TransactionDetailsPage from './pages/profile/TransactionDetailsPage';
import AccountsPage from './pages/profile/AccountsPage';
import AccountDetailsPage from './pages/profile/AccountDetailsPage';
import AccountTransactionsPage from './pages/profile/AccountTransactionsPage';
import ExchangeRatesPage from './pages/profile/ExchangeRatesPage';
import OpenAccountPage from './pages/profile/OpenAccountPage';

// Admin imports
import AdminRouteGuard from './components/admin/AdminRouteGuard';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProfileEditPage from './pages/admin/AdminProfileEditPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import './App.css';

// Payments Imports
import PaymentsPage from './pages/payments/PaymentsPage';
import NewPaymentPage from './pages/payments/NewPaymentPage';
import PaymentSuccessPage from './pages/payments/PaymentSuccessPage';
import PaymentErrorPage from './pages/payments/PaymentErrorPage';


/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

/**
 * Main App component
 * Sets up routing and authentication provider
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          
          {/* Profile routes */}
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><ProfileEditPage /></ProtectedRoute>} />
          
          {/* Cards routes */}
          <Route path="/profile/cards" element={<ProtectedRoute><CardsPage /></ProtectedRoute>} />
          <Route path="/profile/cards/:cardId" element={<ProtectedRoute><CardDetailsPage /></ProtectedRoute>} />
          <Route path="/profile/cards/:cardId/transactions" element={<ProtectedRoute><CardTransactionsPage /></ProtectedRoute>} />
          <Route path="/profile/cards/:cardId/transactions/:transactionId" element={<ProtectedRoute><CardTransactionDetailsPage /></ProtectedRoute>} />
          
          {/* Transactions routes */}
          <Route path="/profile/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
          <Route path="/profile/transactions/:id" element={<ProtectedRoute><TransactionDetailsPage /></ProtectedRoute>} />
          
          {/* Accounts routes */}
          <Route path="/profile/accounts" element={<ProtectedRoute><AccountsPage /></ProtectedRoute>} />
          <Route path="/profile/accounts/:id" element={<ProtectedRoute><AccountDetailsPage /></ProtectedRoute>} />
          <Route path="/profile/accounts/:id/transactions" element={<ProtectedRoute><AccountTransactionsPage /></ProtectedRoute>} />
          <Route path="/profile/accounts/:id/transactions/:transactionId" element={<ProtectedRoute><TransactionDetailsPage /></ProtectedRoute>} />
          <Route path="/accounts/new" element={<OpenAccountPage />} />
          
          {/* Admin routes - protected by AdminRouteGuard */}
          <Route element={<AdminRouteGuard />}>
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin-dashboard/edit-admin" element={<AdminProfileEditPage />} />
            <Route path="/admin-dashboard/users" element={<AdminUsersPage />} />
          </Route>

          {/* Payment routes */}
          <Route path="/payments" element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>} />
          <Route path="/payments/new" element={<ProtectedRoute><NewPaymentPage /></ProtectedRoute>} />
          <Route path="/payments/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
          <Route path="/payments/error" element={<ProtectedRoute><PaymentErrorPage /></ProtectedRoute>} />

          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />

          {/* Exchange rates page */}
          <Route path="/exchange-rates" element={<ExchangeRatesPage />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App
