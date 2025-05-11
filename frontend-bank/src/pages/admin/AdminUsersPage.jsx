import { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import './AdminPages.css';

/**
 * Admin Users Page
 * Displays a list of all users in the system
 * Allows admin to manage users (view, edit, delete)
 * Restricted to users with admin role
 */
const AdminUsersPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Check if user is authenticated and has admin role
  const isAuthenticated = authService.isAuthenticated();
  const isAdmin = adminService.isAdmin();

  useEffect(() => {
    // Fetch users if user is authenticated and has admin role
    if (isAuthenticated && isAdmin) {
      fetchUsers();
    }
  }, [isAuthenticated, isAdmin]);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to load users');
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle role filter change
  const handleFilterChange = (e) => {
    setFilterRole(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.Username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.First_name} ${user.Last_name}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.Type === filterRole;
    
    return matchesSearch && matchesRole;
  });

  // Pagination
  const indexOfLastUser = currentPage * itemsPerPage;
  const indexOfFirstUser = indexOfLastUser - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Open delete confirmation modal
  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Close delete confirmation modal
  const closeDeleteModal = () => {
    setUserToDelete(null);
    setShowDeleteModal(false);
  };

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await adminService.deleteUser(userToDelete.id);
      setUsers(users.filter(user => user.id !== userToDelete.id));
      closeDeleteModal();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
      closeDeleteModal();
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
    <div className="admin-users-page">
      <div className="admin-layout">
        <div className="admin-sidebar-container">
          <AdminSidebar />
        </div>
        
        <div className="admin-content">
          <h1 className="admin-page-title">Manage Users</h1>
          
          {/* Search and Filter */}
          <div className="admin-search-filter">
            <input
              type="text"
              placeholder="Search users..."
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            
            <select
              value={filterRole}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            
            <button
              className="admin-button refresh-btn"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loading ? (
            <div className="admin-loading">Loading users...</div>
          ) : error ? (
            <div className="admin-error">{error}</div>
          ) : (
            <>
              {/* Users Table */}
              {currentUsers.length > 0 ? (
                <div className="admin-table-container">
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentUsers.map(user => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.Username}</td>
                          <td>{user.First_name} {user.Last_name}</td>
                          <td>{user.Email}</td>
                          <td>
                            <span className={`status-badge ${user.Type.toLowerCase()}`}>
                              {user.Type}
                            </span>
                          </td>
                          <td className="actions-cell">
                            <button
                              className="admin-button edit-btn"
                              onClick={() => navigate(`/admin-dashboard/users/${user.id}/edit`)}
                            >
                              Edit
                            </button>
                            
                            {/* Don't allow deleting your own account */}
                            {user.id !== authService.getCurrentUser()?.id && (
                              <button
                                className="admin-button delete-btn"
                                onClick={() => openDeleteModal(user)}
                              >
                                Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="admin-pagination">
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="pagination-button"
                      >
                        Previous
                      </button>
                      
                      <div className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </div>
                      
                      <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="pagination-button"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="admin-no-data">No users found</div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <h2 className="admin-modal-title">Confirm Deletion</h2>
            <p className="admin-modal-message">
              Are you sure you want to delete the user <strong>{userToDelete?.Username}</strong>?
              This action cannot be undone.
            </p>
            <div className="admin-modal-actions">
              <button
                className="admin-button cancel-btn"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="admin-button delete-btn"
                onClick={handleDeleteUser}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
