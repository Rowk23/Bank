import { useState } from 'react';
import './AuthForms.css';

/**
 * Registration Form Component
 * Handles user input for creating a new account
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onSubmit - Form submission handler
 * @param {Boolean} props.isLoading - Loading state
 */
const RegisterForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    cnp: '',
    email: ''
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
    
    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    // Name validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    // CNP validation (Romanian personal identification number)
    if (!formData.cnp.trim()) {
      newErrors.cnp = 'CNP is required';
    } else if (!/^\d{13}$/.test(formData.cnp)) {
      newErrors.cnp = 'CNP must be 13 digits';
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
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
      // Remove confirmPassword as it's not needed for API
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...registrationData } = formData;
      onSubmit(registrationData);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter your first name"
            className={errors.first_name ? 'input-error' : ''}
            aria-invalid={!!errors.first_name}
          />
          {errors.first_name && (
            <div className="error-message">{errors.first_name}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter your last name"
            className={errors.last_name ? 'input-error' : ''}
            aria-invalid={!!errors.last_name}
          />
          {errors.last_name && (
            <div className="error-message">{errors.last_name}</div>
          )}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Choose a username"
          className={errors.username ? 'input-error' : ''}
          aria-invalid={!!errors.username}
        />
        {errors.username && (
          <div className="error-message">{errors.username}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your email"
          className={errors.email ? 'input-error' : ''}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <div className="error-message">{errors.email}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="cnp">CNP (Personal Identification Number)</label>
        <input
          type="text"
          id="cnp"
          name="cnp"
          value={formData.cnp}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Enter your 13-digit CNP"
          className={errors.cnp ? 'input-error' : ''}
          aria-invalid={!!errors.cnp}
          maxLength={13}
        />
        {errors.cnp && (
          <div className="error-message">{errors.cnp}</div>
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
          placeholder="Create a password"
          className={errors.password ? 'input-error' : ''}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <div className="error-message">{errors.password}</div>
        )}
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? 'input-error' : ''}
          aria-invalid={!!errors.confirmPassword}
        />
        {errors.confirmPassword && (
          <div className="error-message">{errors.confirmPassword}</div>
        )}
      </div>
      
      <button 
        type="submit" 
        className="auth-button" 
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
};

export default RegisterForm;
