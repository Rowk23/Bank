import { useState, useEffect } from 'react';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import usersService from '../../services/usersService';
import authService from '../../services/authService';
import './ProfilePages.css';

/**
 * Profile Page Component
 * Displays user profile information
 */
const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user from authService
  useEffect(() => {
    const user = authService.getCurrentUser();
    setLocalUser(user);
  }, []);

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileData = await usersService.getUserProfile();
        setProfile(profileData);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    console.log('authService user:', localUser);
    console.log('Profile from backend:', profile);
  }, [localUser, profile]);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || '';

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar-container">
          <ProfileSidebar />
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <h1>My Profile</h1>
          </div>

          {loading ? (
            <div className="profile-loading">
              <div className="loading-spinner"></div>
              <p>Loading profile data...</p>
            </div>
          ) : error ? (
            <div className="profile-error">
              <p>{error}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="profile-details">
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {getInitial(profile?.first_name || localUser?.first_name)}
                  {getInitial(profile?.last_name || localUser?.last_name)}
                </div>
              </div>

              <div className="profile-info-container">
                <div className="profile-info-section">
                  <h2>Personal Information</h2>
                  <div className="profile-info-grid">
                    <div className="profile-info-item">
                      <span className="info-label">First Name</span>
                      <span className="info-value">{profile?.First_name || localUser?.First_name || 'N/A'}</span>
                    </div>

                    <div className="profile-info-item">
                      <span className="info-label">Last Name</span>
                      <span className="info-value">{profile?.Last_name || localUser?.Last_name || 'N/A'}</span>
                    </div>

                    <div className="profile-info-item">
                      <span className="info-label">Username</span>
                      <span className="info-value">{profile?.username || localUser?.username || 'N/A'}</span>
                    </div>

                    <div className="profile-info-item">
                      <span className="info-label">Email</span>
                      <span className="info-value">{profile?.email || localUser?.email || 'N/A'}</span>
                    </div>

                    <div className="profile-info-item">
                      <span className="info-label">CNP</span>
                      <span className="info-value">{profile?.cnp || localUser?.cnp || 'N/A'}</span>
                    </div>

                    <div className="profile-info-item">
                      <span className="info-label">Account Type</span>
                      <span className="info-value">{profile?.type || localUser?.type || 'Standard'}</span>
                    </div>
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => (window.location.href = '/profile/edit')}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
