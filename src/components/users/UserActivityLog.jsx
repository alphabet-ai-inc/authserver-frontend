/**
 * UserActivityLog.jsx
 * -------------------
 * Displays user activity history and logs.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatUnixTimestamp } from '../../utils/Unix2Ymd';
import NavBar from '../NavBar';

export const UserActivityLog = () => {
  const { id } = useParams();
  const { jwtToken } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [filter, setFilter] = useState('all'); // all, login, action, system

  useEffect(() => {
    if (!jwtToken) return;

    const fetchData = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const userData = await userResponse.json();
        setUserInfo(userData);

        // Fetch activities
        const activityResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${id}/activities`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const activityData = await activityResponse.json();
        setActivities(Array.isArray(activityData) ? activityData : []);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, jwtToken]);

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.type === filter;
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'login': return 'bi-box-arrow-in-right';
      case 'logout': return 'bi-box-arrow-right';
      case 'create': return 'bi-plus-circle';
      case 'update': return 'bi-pencil';
      case 'delete': return 'bi-trash';
      case 'system': return 'bi-gear';
      default: return 'bi-activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'login': return 'success';
      case 'logout': return 'secondary';
      case 'create': return 'primary';
      case 'update': return 'warning';
      case 'delete': return 'danger';
      case 'system': return 'info';
      default: return 'dark';
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="container-fluid mt-4">
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading activity log...</p>
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
              <i className="bi bi-clock-history text-primary me-2"></i>
              Activity Log
            </h3>
            <p className="text-muted mb-0">
              {userInfo && `${userInfo.first_name} ${userInfo.last_name}`} • User ID: {id}
            </p>
          </div>
          <button
            className="btn btn-outline-secondary"
            onClick={() => navigate(`/user/${id}`)}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Back to User
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row align-items-center">
              <div className="col-md-4">
                <label className="form-label">Filter by Activity Type</label>
                <select
                  className="form-select"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Activities</option>
                  <option value="login">Logins</option>
                  <option value="logout">Logouts</option>
                  <option value="create">Creations</option>
                  <option value="update">Updates</option>
                  <option value="delete">Deletions</option>
                  <option value="system">System Actions</option>
                </select>
              </div>
              <div className="col-md-8 text-end">
                <div className="btn-group">
                  <button className="btn btn-outline-primary">
                    <i className="bi bi-download me-2"></i>
                    Export Log
                  </button>
                  <button className="btn btn-outline-secondary">
                    <i className="bi bi-printer me-2"></i>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity List */}
        <div className="card">
          <div className="card-body">
            {filteredActivities.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                <h5>No activities found</h5>
                <p className="text-muted">No activity records available for this user.</p>
              </div>
            ) : (
              <div className="timeline">
                {filteredActivities.map((activity, index) => (
                  <div key={index} className="timeline-item mb-4">
                    <div className="timeline-marker bg-primary"></div>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className={`badge bg-${getActivityColor(activity.type)} me-2`}>
                            <i className={`bi ${getActivityIcon(activity.type)} me-1`}></i>
                            {activity.type.toUpperCase()}
                          </span>
                          <strong>{activity.description || 'No description'}</strong>
                        </div>
                        <small className="text-muted">
                          {formatUnixTimestamp(activity.timestamp)}
                        </small>
                      </div>
                      {activity.details && (
                        <div className="mt-2">
                          <small className="text-muted">{activity.details}</small>
                        </div>
                      )}
                      {activity.ip_address && (
                        <div className="mt-1">
                          <small className="text-muted">
                            <i className="bi bi-globe me-1"></i>
                            IP: {activity.ip_address}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="row mt-4">
          <div className="col-md-3">
            <div className="card bg-primary bg-opacity-10">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-25 rounded p-2 me-3">
                    <i className="bi bi-activity text-primary"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Total Activities</div>
                    <div className="h5 mb-0">{activities.length}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success bg-opacity-10">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-25 rounded p-2 me-3">
                    <i className="bi bi-box-arrow-in-right text-success"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Successful Logins</div>
                    <div className="h5 mb-0">
                      {activities.filter(a => a.type === 'login' && a.status === 'success').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning bg-opacity-10">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-25 rounded p-2 me-3">
                    <i className="bi bi-exclamation-triangle text-warning"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Failed Attempts</div>
                    <div className="h5 mb-0">
                      {activities.filter(a => a.type === 'login' && a.status === 'failed').length}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info bg-opacity-10">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-25 rounded p-2 me-3">
                    <i className="bi bi-clock text-info"></i>
                  </div>
                  <div>
                    <div className="text-muted small">Last Activity</div>
                    <div className="h6 mb-0">
                      {activities.length > 0 ? formatUnixTimestamp(activities[0].timestamp) : 'Never'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }
        .timeline-item {
          position: relative;
        }
        .timeline-marker {
          position: absolute;
          left: -30px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .timeline-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #0d6efd;
        }
      `}</style>
    </>
  );
};

export default UserActivityLog;