import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import './AuthPages.css';

/**
 * Register Page Component
 * Handles new user registration and form submission
 */
const RegisterPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  /**
   * Handle registration form submission
   * @param {Object} userData - User registration data from form
   */
  const handleRegister = async (userData) => {
    setError('');
    setLoading(true);
    
    try {
      await register(userData);
      // Redirect to login page after successful registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please login with your credentials.' } 
      });
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Register to access our banking services</p>
        </div>
        
        {error && <div className="auth-error">{error}</div>}
        
        <RegisterForm onSubmit={handleRegister} isLoading={loading} />
        
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
