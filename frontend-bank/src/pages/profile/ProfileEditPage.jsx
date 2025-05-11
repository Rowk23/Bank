import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import usersService from '../../services/usersService';
import './ProfilePages.css';

/**
 * Profile Edit Page Component
 * Allows users to update their profile information
 */
const ProfileEditPage = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // Form validation errors
  const [errors, setErrors] = useState({});

  // Load user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const profileData = await usersService.getUserProfile();
        
        // Update form with profile data
        setFormData(prevData => ({
          ...prevData,
          first_name: profileData.first_name || user?.first_name || '',
          last_name: profileData.last_name || user?.last_name || '',
          email: profileData.email || user?.email || '',
          username: profileData.username || user?.username || ''
        }));
        
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  /**
   * Handle input field changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form fields
   * @returns {Boolean} - True if validation passes
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validate required fields
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    // Validate password fields if user is trying to change password
    if (formData.new_password || formData.confirm_password) {
      if (!formData.current_password) {
        newErrors.current_password = 'Current password is required to set a new password';
      }
      
      if (formData.new_password.length < 6) {
        newErrors.new_password = 'New password must be at least 6 characters';
      }
      
      if (formData.new_password !== formData.confirm_password) {
        newErrors.confirm_password = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset status messages
    setError(null);
    setSuccess(null);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare data for API
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        username: formData.username
      };
      
      // Add password fields if user is changing password
      if (formData.new_password && formData.current_password) {
        updateData.current_password = formData.current_password;
        updateData.new_password = formData.new_password;
      }
      
      // Update user profile
      const updatedProfile = await usersService.updateUserProfile(updateData);
      
      // Update user context
      setUser(updatedProfile);
      
      setSuccess('Profile updated successfully');
      
      // Clear password fields
      setFormData(prevData => ({
        ...prevData,
        current_password: '',
        new_password: '',
        confirm_password: ''
      }));
      
      // Redirect after successful update
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
      
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>
        
        <div className="profile-content">
          <div className="profile-header">
            <h1>Edit Profile</h1>
          </div>
          
          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile data...</p>
            </div>
          ) : (
            <div className="profile-edit-form-container">
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <form className="profile-edit-form" onSubmit={handleSubmit}>
                <div className="form-section">
                  <h2>Personal Information</h2>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="first_name">First Name</label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        disabled={saving}
                        className={errors.first_name ? 'input-error' : ''}
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
                        disabled={saving}
                        className={errors.last_name ? 'input-error' : ''}
                      />
                      {errors.last_name && (
                        <div className="error-message">{errors.last_name}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={saving}
                      className={errors.email ? 'input-error' : ''}
                    />
                    {errors.email && (
                      <div className="error-message">{errors.email}</div>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      disabled={saving}
                      className={errors.username ? 'input-error' : ''}
                    />
                    {errors.username && (
                      <div className="error-message">{errors.username}</div>
                    )}
                  </div>
                </div>
                
                <div className="form-section">
                  <h2>Change Password</h2>
                  <p className="form-section-info">Leave blank if you don't want to change your password</p>
                  
                  <div className="form-group">
                    <label htmlFor="current_password">Current Password</label>
                    <input
                      type="password"
                      id="current_password"
                      name="current_password"
                      value={formData.current_password}
                      onChange={handleChange}
                      disabled={saving}
                      className={errors.current_password ? 'input-error' : ''}
                    />
                    {errors.current_password && (
                      <div className="error-message">{errors.current_password}</div>
                    )}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="new_password">New Password</label>
                      <input
                        type="password"
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleChange}
                        disabled={saving}
                        className={errors.new_password ? 'input-error' : ''}
                      />
                      {errors.new_password && (
                        <div className="error-message">{errors.new_password}</div>
                      )}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="confirm_password">Confirm New Password</label>
                      <input
                        type="password"
                        id="confirm_password"
                        name="confirm_password"
                        value={formData.confirm_password}
                        onChange={handleChange}
                        disabled={saving}
                        className={errors.confirm_password ? 'input-error' : ''}
                      />
                      {errors.confirm_password && (
                        <div className="error-message">{errors.confirm_password}</div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate('/profile')}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
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

export default ProfileEditPage;
