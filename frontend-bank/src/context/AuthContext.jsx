import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Create the authentication context
const AuthContext = createContext();

/**
 * AuthProvider component to manage authentication state
 * Provides authentication data and methods to all child components
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login handler function
   * @param {Object} credentials - User credentials
   * @returns {Promise} - Login result
   */
  const login = async (credentials) => {
    setLoading(true);
    try {
      const result = await authService.login(credentials);
      setUser(result.user || {});
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register handler function
   * @param {Object} userData - User registration data
   * @returns {Promise} - Registration result
   */
  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout handler function
   * Clears user data and redirects to login
   */
  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/login');
  };

  // Context value with auth state and methods
  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
