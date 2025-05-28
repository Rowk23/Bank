// src/routes/Routes.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

// Admin Pages
import CardsPage from '@/pages/admin/CardsPage';
import CardDetailsPage from '@/pages/admin/CardDetailsPage';
import CardTransactionsPage from '@/pages/admin/CardTransactionsPage';
import TransactionsPage from '@/pages/admin/TransactionsPage';
import TransactionDetailsPage from '@/pages/admin/TransactionDetailsPage';

// Payment Pages
import PaymentsPage from '@/pages/payments/PaymentsPage';
import NewPaymentPage from '@/pages/payments/NewPaymentPage';
import PaymentSuccessPage from '@/pages/payments/PaymentSuccessPage';
import PaymentErrorPage from '@/pages/payments/PaymentErrorPage';

// Other Pages
import ExchangeRatesPage from '@/pages/ExchangeRatesPage';
import NotFoundPage from '@/pages/NotFoundPage';
import UnauthorizedPage from '@/pages/UnauthorizedPage';
import OpenAccountPage from './pages/profile/OpenAccountPage';

const AppRoutes = () => {
  const { user } = useAuth();

  const AdminRoute = ({ children }) => {
    if (!user) return <Navigate to="/login" />;
    if (user.role !== 'admin') return <UnauthorizedPage />;
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Admin Dashboard Routes */}
        <Route
          path="/admin-dashboard/cards"
          element={
            <AdminRoute>
              <CardsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-dashboard/cards/:id"
          element={
            <AdminRoute>
              <CardDetailsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-dashboard/cards/:id/transactions"
          element={
            <AdminRoute>
              <CardTransactionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-dashboard/transactions"
          element={
            <AdminRoute>
              <TransactionsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin-dashboard/transactions/:id"
          element={
            <AdminRoute>
              <TransactionDetailsPage />
            </AdminRoute>
          }
        />

        <Route path="/accounts/new" element={<OpenAccountPage />} />

        {/* Payments */}
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/payments/new" element={<NewPaymentPage />} />
        <Route path="/payments/success" element={<PaymentSuccessPage />} />
        <Route path="/payments/error" element={<PaymentErrorPage />} />

        {/* Exchange Rates */}
        <Route path="/exchange-rates" element={<ExchangeRatesPage />} />

        {/* Errors */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
