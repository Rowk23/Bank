import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import './AdminPages.css';

/**
 * Admin Profile Edit Page
 * Allows admin users to update their profile information
 * Restricted to users with admin role
 */
const AdminProfileEditPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    Username: '',
    First_name: '',
    Last_name: '',
    Email: '',
    CNP: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  // Check if user is authenticated and has admin role
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = adminService.isAdmin();

  useEffect(() => {
    // Fetch admin profile data if user is authenticated and has admin role
    if (isAuthenticated && isAdmin) {
      fetchAdminProfile();
    }
  }, [isAuthenticated, isAdmin]);

  // Fetch admin profile from API
  const fetchAdminProfile = async () => {
    setLoading(true);
    try {
      const adminProfile = await adminService.getAdminProfile();
      
      // Set form data with admin profile data
      setFormData({
        Username: adminProfile.Username || '',
        First_name: adminProfile.First_name || '',
        Last_name: adminProfile.Last_name || '',
        Email: adminProfile.Email || '',
        CNP: adminProfile.CNP || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load admin profile');
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};
    
    // Username validation
    if (!formData.Username.trim()) {
      errors.Username = 'Username is required';
    } else if (formData.Username.length < 3) {
      errors.Username = 'Username must be at least 3 characters';
    }
    
    // First name validation
    if (!formData.First_name.trim()) {
      errors.First_name = 'First name is required';
    }
    
    // Last name validation
    if (!formData.Last_name.trim()) {
      errors.Last_name = 'Last name is required';
    }
    
    // Email validation
    if (!formData.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      errors.Email = 'Email is invalid';
    }
    
    // CNP validation (Romanian personal identification number)
    if (!formData.CNP.trim()) {
      errors.CNP = 'CNP is required';
    } else if (!/^\d{13}$/.test(formData.CNP)) {
      errors.CNP = 'CNP must be 13 digits';
    }
    
    // Password validation (only if user is changing password)
    if (formData.newPassword || formData.confirmPassword) {
      if (!formData.currentPassword) {
        errors.currentPassword = 'Current password is required to set a new password';
      }
      
      if (formData.newPassword.length > 0 && formData.newPassword.length < 8) {
        errors.newPassword = 'New password must be at least 8 characters';
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError(null);
    setSuccess(null);
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);
    
    try {
      // Prepare data for API
      const profileData = {
        Username: formData.Username,
        First_name: formData.First_name,
        Last_name: formData.Last_name,
        Email: formData.Email,
        CNP: formData.CNP,
        Type: 'admin' // Ensure admin type is preserved
      };
      
      // Add password if user is changing it
      if (formData.newPassword) {
        profileData.Password = formData.newPassword;
        // Note: In a real application, you would need to verify the current password
        // on the server side before allowing a password change
      }
      
      // Update admin profile
      await adminService.updateAdminProfile(profileData);
      
      setSuccess('Profile updated successfully');
      setSaving(false);
      
      // Clear password fields after successful update
      setFormData(prevData => ({
        ...prevData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="admin-profile-edit-page">
      <div className="admin-layout">
        <div className="admin-sidebar-container">
          <AdminSidebar />
        </div>
        
        <div className="admin-content">
          <h1 className="admin-page-title">Edit Admin Profile</h1>
          
          {loading ? (
            <div className="admin-loading">Loading profile data...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <div className="admin-form">
              <h2 className="admin-form-title">Personal Information</h2>
              
              {success && (
                <div className="admin-success-message">{success}</div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label htmlFor="Username">Username</label>
                    <input
                      type="text"
                      id="Username"
                      name="Username"
                      value={formData.Username}
                      onChange={handleChange}
                    />
                    {validationErrors.Username && (
                      <div className="admin-error-message">{validationErrors.Username}</div>
                    )}
                  </div>
                  
                  <div className="admin-form-group">
                    <label htmlFor="Email">Email</label>
                    <input
                      type="email"
                      id="Email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleChange}
                    />
                    {validationErrors.Email && (
                      <div className="admin-error-message">{validationErrors.Email}</div>
                    )}
                  </div>
                </div>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label htmlFor="First_name">First Name</label>
                    <input
                      type="text"
                      id="First_name"
                      name="First_name"
                      value={formData.First_name}
                      onChange={handleChange}
                    />
                    {validationErrors.First_name && (
                      <div className="admin-error-message">{validationErrors.First_name}</div>
                    )}
                  </div>
                  
                  <div className="admin-form-group">
                    <label htmlFor="Last_name">Last Name</label>
                    <input
                      type="text"
                      id="Last_name"
                      name="Last_name"
                      value={formData.Last_name}
                      onChange={handleChange}
                    />
                    {validationErrors.Last_name && (
                      <div className="admin-error-message">{validationErrors.Last_name}</div>
                    )}
                  </div>
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="CNP">CNP (Personal Identification Number)</label>
                  <input
                    type="text"
                    id="CNP"
                    name="CNP"
                    value={formData.CNP}
                    onChange={handleChange}
                  />
                  {validationErrors.CNP && (
                    <div className="admin-error-message">{validationErrors.CNP}</div>
                  )}
                </div>
                
                <h2 className="admin-form-title">Change Password (Optional)</h2>
                
                <div className="admin-form-group">
                  <label htmlFor="currentPassword">Current Password</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                  {validationErrors.currentPassword && (
                    <div className="admin-error-message">{validationErrors.currentPassword}</div>
                  )}
                </div>
                
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                    />
                    {validationErrors.newPassword && (
                      <div className="admin-error-message">{validationErrors.newPassword}</div>
                    )}
                  </div>
                  
                  <div className="admin-form-group">
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {validationErrors.confirmPassword && (
                      <div className="admin-error-message">{validationErrors.confirmPassword}</div>
                    )}
                  </div>
                </div>
                
                <div className="admin-form-actions">
                  <button
                    type="button"
                    className="admin-button cancel-btn"
                    onClick={() => navigate('/admin-dashboard')}
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="admin-button submit-btn"
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfileEditPage;
