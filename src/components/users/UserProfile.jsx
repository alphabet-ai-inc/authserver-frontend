/**
 * UserProfile.jsx
 * ---------------
 * Displays user's public profile information.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatUnixTimestamp } from '../../utils/Unix2Ymd';
import NavBar from '../../components/NavBar';

export const UserProfile = () => {
  const { id } = useParams();
  const { jwtToken } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jwtToken) return;

    const fetchUser = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}/profile`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, jwtToken]);

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container-fluid mt-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <NavBar />
        <div className="container-fluid mt-4">
          <div className="alert alert-danger">
            User profile not found
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3>
              <i className="bi bi-person-badge text-primary me-2"></i>
              User Profile
            </h3>
            <p className="text-muted mb-0">Public profile information</p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/user/${id}`)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to User
          </button>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <div className="mb-3">
                  <div className="avatar-placeholder bg-primary bg-opacity-10 text-primary rounded-circle d-inline-flex align-items-center justify-content-center"
                       style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <h4>{user.first_name} {user.last_name}</h4>
                <p className="text-muted">{user.role || 'No role specified'}</p>
                <div className="d-flex justify-content-center gap-2">
                  <span className={`badge ${user.active ? 'bg-success' : 'bg-secondary'}`}>
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                  {user.blocked && (
                    <span className="badge bg-danger">Blocked</span>
                  )}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Quick Info
                </h6>
              </div>
              <div className="card-body">
                <dl className="row mb-0">
                  <dt className="col-sm-5">Member Since</dt>
                  <dd className="col-sm-7">{formatUnixTimestamp(user.created)}</dd>

                  <dt className="col-sm-5">Last Updated</dt>
                  <dd className="col-sm-7">{formatUnixTimestamp(user.updated)}</dd>

                  <dt className="col-sm-5">Last Login</dt>
                  <dd className="col-sm-7">{user.last_login ? formatUnixTimestamp(user.last_login) : 'Never'}</dd>

                  <dt className="col-sm-5">User Code</dt>
                  <dd className="col-sm-7"><code>{user.code || 'N/A'}</code></dd>

                  <dt className="col-sm-5">Language</dt>
                  <dd className="col-sm-7">{user.lan || 'Default'}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-person-lines-fill me-2"></i>
                  Contact Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-envelope"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.email || 'Not provided'}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Account Status</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-shield-check"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.active ? 'Active Account' : 'Inactive Account'}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-shield me-2"></i>
                  Access Information
                </h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Primary Role</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-badge"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.role || 'Not assigned'}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Profile ID</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-person-lines-fill"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.profile_id || 'Not assigned'}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Group ID</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-people"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.group_id || 'Not assigned'}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Company ID</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="bi bi-building"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={user.company_id || 'Not assigned'}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-activity me-2"></i>
                  Recent Activity
                </h6>
              </div>
              <div className="card-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  For detailed activity information, visit the{' '}
                  <a
                    href={`/user/${id}/activity`}
                    className="alert-link"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/user/${id}/activity`);
                    }}
                  >
                    Activity Log
                  </a>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Last Action:</span>
                  <strong>{user.last_action || 'No recent actions'}</strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Login Attempts:</span>
                  <strong className={user.tries > 3 ? 'text-danger' : ''}>
                    {user.tries || 0} attempts
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Last Try:</span>
                  <strong>{user.last_try ? formatUnixTimestamp(user.last_try) : 'Never'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfile;