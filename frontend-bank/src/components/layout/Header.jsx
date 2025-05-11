import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminService';
import './Layout.css';

/**
 * Header Component
 * Main navigation bar for the application
 * Shows different options based on authentication status and user role
 */
const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (isAuthenticated) {
      setIsAdmin(adminService.isAdmin());
    } else {
      setIsAdmin(false);
    }
  }, [isAuthenticated, user]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-container">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="logo">
            <span className="logo-text">Bank</span>
            <span className="logo-accent">App</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <button 
          className="mobile-menu-button" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Navigation links */}
        <nav className={`main-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-links">
            {isAuthenticated ? (
              <>
                <li>
                  <Link 
                    to="/dashboard" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile/accounts" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Accounts
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile/cards" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Cards
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile/transactions" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Transactions
                  </Link>
                </li>
                
                {/* Admin dashboard link - only visible for admin users */}
                {isAdmin && (
                  <li>
                    <Link 
                      to="/admin-dashboard" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="nav-link admin-link"
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                
                <li>
                  <button 
                    onClick={handleLogout}
                    className="logout-button"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="nav-link"
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
