import { Navigate, Outlet } from 'react-router-dom';
import adminService from '../../services/adminService';
import authService from '../../services/authService';

/**
 * Admin Route Guard Component
 * Protects admin routes from unauthorized access
 * Redirects to login if not authenticated
 * Redirects to dashboard if authenticated but not admin
 */
const AdminRouteGuard = () => {
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = adminService.isAdmin();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to user dashboard
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and admin, render the protected route
  return <Outlet />;
};

export default AdminRouteGuard;
