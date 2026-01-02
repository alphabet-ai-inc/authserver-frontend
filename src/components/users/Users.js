/**
 * Users Component
 * --------------
 * Displays a list of users fetched from the backend.
 * - Redirects to /login if not authenticated.
 * - Shows a table of users with details and status indicators.
 * - Provides filtering and status management capabilities.
 *
 * Dependencies:
 * - React Router (Link, useNavigate)
 * - AuthContext (for JWT token)
 * - Bootstrap and Bootstrap Icons for styling
 *
 * @component
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import NavBar from "../NavBar";

// Sticky Action Bar Component for Users List
const UsersStickyActionBar = ({ userCount, onAddNew, filterActive, onFilterToggle }) => (
  <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="mb-0 text-dark">
            <i className="bi bi-people text-primary me-2"></i>
            User Management
          </h4>
          <small className="text-muted">
            {userCount === 0 ? 'No users found' : `Managing ${userCount} ${userCount === 1 ? 'user' : 'users'}`}
          </small>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2 align-items-center">
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                id="filterActive"
                checked={filterActive}
                onChange={onFilterToggle}
              />
              <label className="form-check-label" htmlFor="filterActive">
                Active Only
              </label>
            </div>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => window.history.back()}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddNew}
            >
              <i className="bi bi-person-plus me-2"></i>
              Add New User
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// User Status Badge Component
const UserStatusBadge = ({ user }) => (
  <div className="d-flex flex-column gap-1">
    <span className={`badge ${user.active ? 'bg-success' : 'bg-secondary'} bg-opacity-25 text-dark`}>
      <i className={`bi ${user.active ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-secondary'} me-1`}></i>
      {user.active ? 'Active' : 'Inactive'}
    </span>
    {user.blocked && (
      <span className="badge bg-danger bg-opacity-25 text-dark">
        <i className="bi bi-slash-circle-fill text-danger me-1"></i>
        Blocked
      </span>
    )}
  </div>
);

// Last Activity Component
const LastActivity = ({ user }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never';

    const date = new Date(timestamp * 1000); // Assuming seconds timestamp
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="d-flex flex-column">
      <span className="text-truncate" style={{maxWidth: '150px'}} title={user.last_action || 'No action recorded'}>
        {user.last_action || '—'}
      </span>
      <small className="text-muted">
        {user.last_login ? formatTime(user.last_login) : 'Never logged in'}
      </small>
    </div>
  );
};

const Users = () => {
    const { jwtToken } = useAuth();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filterActiveOnly, setFilterActiveOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Fetch users from backend
    useEffect(() => {
        if (jwtToken === "") {
            navigate("/login");
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            setError(null);

            const headers = new Headers();
            headers.append("Content-Type", "application/json");
            headers.append("Authorization", "Bearer " + jwtToken);

            const requestOptions = {
                method: "GET",
                headers: headers,
            };

            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users`, requestOptions);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                    setFilteredUsers(data);
                } else {
                    console.log('Unexpected data format (expected array of users):', data);
                    setUsers([]);
                    setFilteredUsers([]);
                }
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again later.');
                setUsers([]);
                setFilteredUsers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [jwtToken, navigate]);

    // Apply filters when users or filter settings change
    useEffect(() => {
        let result = users;

        if (filterActiveOnly) {
            result = result.filter(user => user.active);
        }

        setFilteredUsers(result);
    }, [users, filterActiveOnly]);

    // Handler for sticky action bar
    const handleAddNewUser = () => {
        navigate("/edituser/0"); // Assuming you have an edit user page
    };

    // Toggle active filter
    const handleFilterToggle = () => {
        setFilterActiveOnly(!filterActiveOnly);
    };

    // Calculate statistics
    const stats = {
        total: users.length,
        active: users.filter(user => user.active).length,
        blocked: users.filter(user => user.blocked).length,
        recentLogins: users.filter(user => {
            if (!user.last_login) return false;
            const lastLogin = new Date(user.last_login * 1000);
            const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
            return lastLogin > weekAgo;
        }).length,
    };

    return (
        <>
            <NavBar />
            <UsersStickyActionBar
                userCount={filteredUsers?.length || 0}
                onAddNew={handleAddNewUser}
                filterActive={filterActiveOnly}
                onFilterToggle={handleFilterToggle}
            />

            <div className="container-fluid" style={{ marginTop: '20px' }}>
                {/* Add User Card */}
                <div className="card mb-4 border-dashed bg-light">
                    <div
                        onClick={handleAddNewUser}
                        className="card-body text-center p-4 text-decoration-none cursor-pointer"
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="text-primary mb-2">
                            <i className="bi bi-person-plus display-6"></i>
                        </div>
                        <h3 className="h5 text-dark mb-1">Add New User</h3>
                        <p className="text-muted mb-0">Create a new user account</p>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Loading users...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center py-5">
                            <div className="text-danger mb-3">
                                <i className="bi bi-exclamation-triangle display-4"></i>
                            </div>
                            <h5 className="text-danger">Error Loading Users</h5>
                            <p className="text-muted mb-4">{error}</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => window.location.reload()}
                            >
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                {!loading && !error && (
                    <div className="card shadow-sm border-0">
                        <div className="card-header bg-white py-3 border-bottom">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0 text-dark">
                                    <i className="bi bi-table me-2"></i>
                                    User Details
                                </h5>
                                <div className="text-muted small">
                                    Showing {filteredUsers.length} of {users.length} users
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-0">
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="ps-4">
                                                <i className="bi bi-person me-1"></i>
                                                User
                                            </th>
                                            <th scope="col">
                                                <i className="bi bi-envelope me-1"></i>
                                                Email
                                            </th>
                                            <th scope="col">
                                                <i className="bi bi-shield me-1"></i>
                                                Role
                                            </th>
                                            <th scope="col">
                                                <i className="bi bi-activity me-1"></i>
                                                Status
                                            </th>
                                            <th scope="col">
                                                <i className="bi bi-calendar me-1"></i>
                                                Last Activity
                                            </th>
                                            <th scope="col">
                                                <i className="bi bi-gear me-1"></i>
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="user-row">
                                                <td className="ps-4">
                                                    <div className="d-flex align-items-center">
                                                        <div className="user-icon bg-primary bg-opacity-10 text-primary rounded-circle p-2 me-3">
                                                            <i className="bi bi-person-fill"></i>
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold text-dark">
                                                                {user.first_name} {user.last_name}
                                                            </div>
                                                            <div className="text-muted small">
                                                                ID: {user.id} • Code: {user.code || '—'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="text-truncate" style={{maxWidth: '200px'}} title={user.email}>
                                                        <i className="bi bi-envelope-fill text-primary me-1"></i>
                                                        {user.email || '—'}
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="badge bg-info bg-opacity-25 text-dark">
                                                        {user.role || 'No role'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <UserStatusBadge user={user} />
                                                </td>
                                                <td>
                                                    <LastActivity user={user} />
                                                </td>
                                                <td>
                                                    <div className="d-flex gap-2">
                                                        <Link
                                                            to={`/edituser/${user.id}`}
                                                            className="btn btn-sm btn-outline-primary"
                                                            title="Edit User"
                                                        >
                                                            <i className="bi bi-pencil"></i>
                                                        </Link>
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            title="View Details"
                                                            onClick={() => navigate(`/user/${user.id}`)}
                                                        >
                                                            <i className="bi bi-eye"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Empty State */}
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-5">
                                    <div className="text-muted mb-3">
                                        <i className="bi bi-people display-4"></i>
                                    </div>
                                    <h5 className="text-muted">No users found</h5>
                                    <p className="text-muted mb-4">
                                        {filterActiveOnly ? 'No active users found' : 'Get started by adding your first user'}
                                    </p>
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleAddNewUser}
                                    >
                                        <i className="bi bi-person-plus me-2"></i>
                                        Add First User
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Statistics Cards */}
                {!loading && !error && users.length > 0 && (
                    <div className="mt-4">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <div className="card bg-primary bg-opacity-10 border-0">
                                    <div className="card-body py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-primary bg-opacity-25 rounded p-2 me-3">
                                                <i className="bi bi-people text-primary"></i>
                                            </div>
                                            <div>
                                                <div className="text-muted small">Total Users</div>
                                                <div className="h5 mb-0 text-primary">{stats.total}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-success bg-opacity-10 border-0">
                                    <div className="card-body py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-success bg-opacity-25 rounded p-2 me-3">
                                                <i className="bi bi-check-circle text-success"></i>
                                            </div>
                                            <div>
                                                <div className="text-muted small">Active Users</div>
                                                <div className="h5 mb-0 text-success">{stats.active}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-danger bg-opacity-10 border-0">
                                    <div className="card-body py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-danger bg-opacity-25 rounded p-2 me-3">
                                                <i className="bi bi-slash-circle text-danger"></i>
                                            </div>
                                            <div>
                                                <div className="text-muted small">Blocked Users</div>
                                                <div className="h5 mb-0 text-danger">{stats.blocked}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="card bg-warning bg-opacity-10 border-0">
                                    <div className="card-body py-3">
                                        <div className="d-flex align-items-center">
                                            <div className="bg-warning bg-opacity-25 rounded p-2 me-3">
                                                <i className="bi bi-clock-history text-warning"></i>
                                            </div>
                                            <div>
                                                <div className="text-muted small">Recent Logins (7d)</div>
                                                <div className="h5 mb-0 text-warning">{stats.recentLogins}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                .user-row:hover {
                    background-color: #f8f9fa !important;
                    transform: translateY(-1px);
                    transition: all 0.2s ease;
                }

                .user-icon {
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .border-dashed {
                    border: 2px dashed #dee2e6 !important;
                }

                .cursor-pointer {
                    cursor: pointer;
                }

                .card:hover .border-dashed {
                    border-color: #0d6efd !important;
                }

                .table th {
                    border-top: none;
                    font-weight: 600;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #6c757d;
                }

                .table td {
                    border-top: 1px solid #f8f9fa;
                    vertical-align: middle;
                }

                .card-header {
                    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
                }

                .badge {
                    font-size: 0.75rem;
                    font-weight: 500;
                    padding: 0.35em 0.65em;
                }
            `}</style>
        </>
    );
};

export { Users };