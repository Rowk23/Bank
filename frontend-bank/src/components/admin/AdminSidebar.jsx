import { NavLink } from 'react-router-dom';
import './AdminComponents.css';

/**
 * Admin Sidebar Component
 * Provides navigation for the admin dashboard
 * Highlights the active section
 */
const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h3 className="sidebar-title">Admin Panel</h3>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/admin-dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Dashboard Overview
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-dashboard/users" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Manage Users
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-dashboard/accounts" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Manage Accounts
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-dashboard/transactions" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Transactions Log
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-dashboard/cards" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Manage Cards
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/admin-dashboard/edit-admin" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Admin Profile
            </NavLink>
          </li>
          <li className="separator"></li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Back to User Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
