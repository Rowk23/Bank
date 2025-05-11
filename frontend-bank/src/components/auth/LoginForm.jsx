import { useState } from 'react';
import './AuthForms.css';

/**
 * Login Form Component
 * Handles user input for authentication
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Boolean} props.isLoading - Loading state
 */
const LoginForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  // Track field validation state
  const [errors, setErrors] = useState({});

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  /**
   * Validate form fields
   * @returns {Boolean} - True if validation passes
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your username"
          className={errors.username ? 'input-error' : ''}
          aria-invalid={!!errors.username}
          aria-describedby={errors.username ? 'username-error' : undefined}
        />
        {errors.username && (
          <div className="error-message" id="username-error">
            {errors.username}
          </div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your password"
          className={errors.password ? 'input-error' : ''}
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error' : undefined}
        />
        {errors.password && (
          <div className="error-message" id="password-error">
            {errors.password}
          </div>
        )}
      </div>
      
      <button 
        type="submit" 
        className="auth-button" 
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default LoginForm;
