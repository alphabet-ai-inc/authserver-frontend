/**
 * ThisUser Component
 * --------------
 * Displays detailed information about a specific user.
 * - Redirects to /login if not authenticated.
 * - Shows comprehensive user details with organized sections.
 * - Provides edit and delete actions.
 *
 * Dependencies:
 * - React Router (useParams, useNavigate)
 * - AuthContext (for JWT token)
 * - Unix2Ymd utility for timestamp formatting
 * - HandleDel utility for delete operations
 * - Bootstrap and Bootstrap Icons for styling
 *
 * @component
 */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { formatUnixTimestamp } from "../../utils/Unix2Ymd";
import { useHandleDelete } from "../../utils/HandleDel";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";
import NavBar from "../NavBar";

// Sticky Action Bar Component for User Detail View
const StickyActionBar = ({ onEdit, onDelete, hasDelete, userName }) => (
  <div className="sticky-top bg-white shadow-sm border-bottom py-3" style={{ zIndex: 1020, top: '56px' }}>
    <div className="container-fluid">
      <div className="row align-items-center">
        <div className="col">
          <h4 className="mb-0 text-dark">
            <i className="bi bi-person-badge text-primary me-2"></i>
            Viewing: {userName || 'User Profile'}
          </h4>
          <small className="text-muted">
            Review user details and account information
          </small>
        </div>
        <div className="col-auto">
          <div className="d-flex gap-2">
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
              onClick={onEdit}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit User
            </button>
            {hasDelete && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={onDelete}
              >
                <i className="bi bi-trash me-2"></i>
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Status Indicator Component
const StatusIndicator = ({ user }) => (
  <div className="d-flex gap-2 flex-wrap">
    <span className={`badge ${user.active ? 'bg-success' : 'bg-secondary'} bg-opacity-25 text-dark`}>
      <i className={`bi ${user.active ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-secondary'} me-1`}></i>
      data-testid={user.active ? "status-active" : "status-inactive"}
    </span>
    {user.blocked && (
      <span className="badge bg-danger bg-opacity-25 text-dark">
        <i className="bi bi-slash-circle-fill text-danger me-1"></i>
        data-testid="status-blocked"
      </span>
    )}
    <span className="badge bg-info bg-opacity-25 text-dark">
      <i className="bi bi-shield me-1"></i>
      {user.role || 'No Role'}
    </span>
  </div>
);

// Last Activity Component with formatted time
const ActivityDetails = ({ user }) => {
  const formatActivityTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'Never';
    return formatUnixTimestamp(timestamp);
  };

  const formatRelativeTime = (timestamp) => {
    if (!timestamp || timestamp === 0) return 'Never';

    const date = new Date(timestamp * 1000); // Assuming seconds timestamp
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="d-flex flex-column gap-1">
      <div className="d-flex align-items-center gap-2">
        <i className="bi bi-clock-history text-muted"></i>
        <span className="small">Last Login: {formatActivityTime(user.last_login)}</span>
      </div>
      {user.last_login > 0 && (
        <small className="text-muted ms-4">
          ({formatRelativeTime(user.last_login)})
        </small>
      )}
      <div className="d-flex align-items-center gap-2 mt-1">
        <i className="bi bi-activity text-muted"></i>
        <span className="small">Last Action: {user.last_action || 'None recorded'}</span>
      </div>
      <div className="d-flex align-items-center gap-2 mt-1">
        <i className="bi bi-lock text-muted"></i>
        <span className="small">Last Try: {formatActivityTime(user.last_try)}</span>
      </div>
      {user.last_try > 0 && (
        <small className="text-muted ms-4">
          Login attempts: {user.tries || 0}
        </small>
      )}
    </div>
  );
};

const ThisUser = () => {
  const { jwtToken, sessionChecked, setJwtToken } = useAuth();
  let { id } = useParams();
  const navigate = useNavigate();
  const [alertClassName, setAlertClassName] = useState("d-none");
  const [alertMessage, setAlertMessage] = useState("");
  const [thisUser, setThisUser] = useState({});
  const [loading, setLoading] = useState(true);

  const handleEdit = () => {
    navigate(`/edituser/${id}`);
  };

  const handleDelete = useHandleDelete(id, "user"); // Assuming HandleDel supports user deletion

  useEffect(() => {
    if (!jwtToken) {
      Swal.fire({
        title: "Token Invalid",
        text: "Your token is invalid. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then(() => {
        setJwtToken(null);
        navigate("/login");
      });
      return;
    }

    setLoading(true);
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + jwtToken);

    const requestOptions = {
      method: "GET",
      headers: headers,
    };

    fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/users/${id}`, requestOptions)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data.error) {
          setAlertClassName("alert-danger");
          setAlertMessage(data.message);
          setThisUser({});
        } else {
          setThisUser(data);
          setAlertClassName("d-none");
          setAlertMessage("");
        }
      })
      .catch((err) => {
        console.error('Error fetching user:', err);
        setAlertClassName("alert-danger");
        setAlertMessage("Failed to load user data. Please try again.");
        setThisUser({});
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, jwtToken, sessionChecked, navigate, setJwtToken]);

  // Helper function to render fields with proper formatting
  const renderField = (value, defaultValue = "Not specified") => {
    if (value === null || value === undefined || value === "") {
      return defaultValue;
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  // Format timestamp fields
  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return "Never";
    return formatUnixTimestamp(timestamp);
  };

  const getUserName = () => {
    if (thisUser.first_name && thisUser.last_name) {
      return `${thisUser.first_name} ${thisUser.last_name}`;
    }
    return thisUser.email || `User #${thisUser.id}`;
  };

  return (
    <>
      <NavBar />
      <StickyActionBar
        onEdit={handleEdit}
        onDelete={handleDelete}
        hasDelete={thisUser.id > 0}
        userName={getUserName()}
      />
      <div className="container-fluid" style={{ marginTop: '20px' }}>
        <div className="card mb-3 shadow-sm border-0">
          <div className="card-body p-4">
            {/* Loading State */}
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading user data...</p>
              </div>
            )}

            {/* Error Alert */}
            <div className={`alert ${alertClassName} mb-4`} role="alert">
              {alertMessage}
            </div>

            {/* User Profile Header */}
            {!loading && thisUser.id && (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h2 className="card-title mb-1 text-primary">
                      <i className="bi bi-person-circle me-2"></i> {getUserName()}
                    </h2>
                    <StatusIndicator user={thisUser} />
                  </div>
                  <div className="text-end">
                    <div className="text-muted small">User ID: {thisUser.id}</div>
                    <div className="text-muted small">Code: {renderField(thisUser.code)}</div>
                  </div>
                </div>

                {/* Account Overview Section */}
                <div className="section mb-4">
                  <div className="section-header bg-primary text-white p-3 rounded-top">
                    <h5 className="mb-0">
                      <i className="bi bi-person-lines-fill me-2"></i>Account Overview
                    </h5>
                  </div>
                  <div className="section-content p-3 border border-top-0 rounded-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Full Name</div>
                          <div className="info-value">
                            {renderField(thisUser.first_name)} {renderField(thisUser.last_name)}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Email Address</div>
                          <div className="info-value">
                            <i className="bi bi-envelope me-1 text-primary"></i>
                            {renderField(thisUser.email)}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">User Code</div>
                          <div className="info-value">
                            <code className="bg-light rounded p-1">{renderField(thisUser.code)}</code>
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Account Created</div>
                          <div className="info-value">
                            <i className="bi bi-calendar-plus me-1 text-success"></i>
                            {formatTimestamp(thisUser.created)}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Role</div>
                          <div className="info-value">
                            <span className="badge bg-info bg-opacity-25 text-dark px-3 py-1">
                              {renderField(thisUser.role)}
                            </span>
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Profile ID</div>
                          <div className="info-value">{renderField(thisUser.profile_id)}</div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Group ID</div>
                          <div className="info-value">{renderField(thisUser.group_id)}</div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Company ID</div>
                          <div className="info-value">{renderField(thisUser.company_id)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity & Sessions Section */}
                <div className="section mb-4">
                  <div className="section-header bg-info text-white p-3 rounded-top">
                    <h5 className="mb-0">
                      <i className="bi bi-activity me-2"></i>Activity & Sessions
                    </h5>
                  </div>
                  <div className="section-content p-3 border border-top-0 rounded-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Last Session</div>
                          <div className="info-value">
                            <code className="bg-light rounded p-1 small">
                              {renderField(thisUser.last_session)}
                            </code>
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Last App Used</div>
                          <div className="info-value">{renderField(thisUser.last_app)}</div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Last Database Used</div>
                          <div className="info-value">{renderField(thisUser.last_db)}</div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Recent Activity</div>
                          <div className="info-value">
                            <ActivityDetails user={thisUser} />
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Account Updated</div>
                          <div className="info-value">
                            <i className="bi bi-calendar-check me-1 text-warning"></i>
                            {formatTimestamp(thisUser.updated)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security & Access Section */}
                <div className="section mb-4">
                  <div className="section-header bg-warning text-dark p-3 rounded-top">
                    <h5 className="mb-0">
                      <i className="bi bi-shield-lock me-2"></i>Security & Access
                    </h5>
                  </div>
                  <div className="section-content p-3 border border-top-0 rounded-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Account Status</div>
                          <div className="info-value">
                            <div className="d-flex flex-column gap-1">
                              <span className={`badge ${thisUser.active ? 'bg-success' : 'bg-secondary'}`}>
                                {thisUser.active ? 'Active' : 'Inactive'}
                              </span>
                              {thisUser.blocked && (
                                <span className="badge bg-danger">Blocked</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Login Attempts</div>
                          <div className="info-value">
                            <div className="d-flex align-items-center gap-2">
                              <span className={`badge ${thisUser.tries > 3 ? 'bg-warning' : 'bg-light'}`}>
                                {renderField(thisUser.tries, 0)} tries
                              </span>
                              {thisUser.last_try > 0 && (
                                <small className="text-muted">
                                  Last: {formatTimestamp(thisUser.last_try)}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Activation Time</div>
                          <div className="info-value">
                            {formatTimestamp(thisUser.activation_time)}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">DBS Auth ID</div>
                          <div className="info-value">{renderField(thisUser.dbsauth_id)}</div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Language Preference</div>
                          <div className="info-value">
                            <span className="badge bg-secondary">
                              {renderField(thisUser.lan, 'Default')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Information Section */}
                <div className="section mb-4">
                  <div className="section-header bg-secondary text-white p-3 rounded-top">
                    <h5 className="mb-0">
                      <i className="bi bi-gear me-2"></i>System Information
                    </h5>
                  </div>
                  <div className="section-content p-3 border border-top-0 rounded-bottom">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">User ID</div>
                          <div className="info-value">
                            <code className="bg-light rounded p-1">{thisUser.id}</code>
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Created</div>
                          <div className="info-value">
                            <i className="bi bi-clock-history me-1"></i>
                            {formatTimestamp(thisUser.created)}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Last Updated</div>
                          <div className="info-value">
                            <i className="bi bi-arrow-clockwise me-1"></i>
                            {formatTimestamp(thisUser.updated)}
                          </div>
                        </div>
                        <div className="info-item mb-3">
                          <div className="info-label text-muted small">Profile Completion</div>
                          <div className="info-value">
                            <div className="progress" style={{ height: '8px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{
                                  width: thisUser.active ? '100%' : '60%'
                                }}
                              ></div>
                            </div>
                            <small className="text-muted">
                              {thisUser.active ? 'Complete' : 'Partial'}
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="row g-3 mb-4">
                  <div className="col-md-3">
                    <div className="card bg-primary bg-opacity-10 border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-primary bg-opacity-25 rounded p-2 me-3">
                            <i className="bi bi-clock text-primary"></i>
                          </div>
                          <div>
                            <div className="text-muted small">Last Login</div>
                            <div className="h6 mb-0">
                              {thisUser.last_login ? formatTimestamp(thisUser.last_login) : 'Never'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-success bg-opacity-10 border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-success bg-opacity-25 rounded p-2 me-3">
                            <i className="bi bi-check-circle text-success"></i>
                          </div>
                          <div>
                            <div className="text-muted small">Status</div>
                            <div className="h6 mb-0">
                              {thisUser.active ? 'Active' : 'Inactive'}
                              {thisUser.blocked && ' / Blocked'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-info bg-opacity-10 border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-info bg-opacity-25 rounded p-2 me-3">
                            <i className="bi bi-shield text-info"></i>
                          </div>
                          <div>
                            <div className="text-muted small">Role</div>
                            <div className="h6 mb-0">{renderField(thisUser.role)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card bg-warning bg-opacity-10 border-0 h-100">
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <div className="bg-warning bg-opacity-25 rounded p-2 me-3">
                            <i className="bi bi-key text-warning"></i>
                          </div>
                          <div>
                            <div className="text-muted small">Attempts</div>
                            <div className="h6 mb-0">{renderField(thisUser.tries, 0)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Empty State - User not found */}
            {!loading && !thisUser.id && alertClassName === "d-none" && (
              <div className="text-center py-5">
                <div className="text-muted mb-3">
                  <i className="bi bi-person-x display-4"></i>
                </div>
                <h5 className="text-muted">User Not Found</h5>
                <p className="text-muted mb-4">The user with ID {id} could not be found.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/users")}
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Back to Users List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .section-header {
          font-weight: 600;
        }

        .section-content {
          background-color: #f8f9fa;
        }

        .info-item {
          border-bottom: 1px solid #e9ecef;
          padding-bottom: 0.75rem;
        }

        .info-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .info-label {
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .info-value {
          font-weight: 500;
        }

        .card-title {
          font-weight: 700;
        }

        .user-profile-icon {
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .progress {
          background-color: #e9ecef;
        }
      `}</style>
    </>
  );
};

export { ThisUser };