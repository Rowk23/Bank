import { NavLink } from 'react-router-dom';
import './ProfileComponents.css';

/**
 * Profile Sidebar Component
 * Provides navigation for the profile section
 * Highlights the active section
 */
const ProfileSidebar = () => {
  return (
    <div className="profile-sidebar">
      <h3 className="sidebar-title">Account Settings</h3>
      
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? 'active' : ''}
              end
            >
              Profile Overview
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile/edit" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Edit Profile
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile/accounts" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              My Accounts
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile/cards" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              My Cards
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile/transactions" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Transaction History
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              Back to Dashboard
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfileSidebar;
