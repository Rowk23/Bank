import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import './AuthPages.css';

/**
 * Login Page Component
 * Handles user authentication and form submission
 */
const LoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle login form submission
   * @param {Object} credentials - User credentials from form
   */
  const handleLogin = async (credentials) => {
    setError('');
    setLoading(true);
    
    try {
      await login(credentials);
      navigate('/dashboard'); // Redirect to dashboard after successful login
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Log in to access your banking services</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <LoginForm onSubmit={handleLogin} isLoading={loading} />
        
        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
