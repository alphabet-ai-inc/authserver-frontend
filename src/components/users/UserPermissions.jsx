/**
 * UserPermissions.jsx
 * -------------------
 * User permissions and access control management.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../NavBar';

export const UserPermissions = () => {
  const { id } = useParams();
  const { jwtToken } = useAuth();
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jwtToken) return;

    const fetchData = async () => {
      try {
        // Fetch user info
        const userResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const userData = await userResponse.json();
        setUserInfo(userData);

        // Fetch permissions
        const permResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}/permissions`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const permData = await permResponse.json();
        setPermissions(Array.isArray(permData) ? permData : []);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, jwtToken]);

  const handlePermissionChange = (permissionId, checked) => {
    setPermissions(prev =>
      prev.map(perm =>
        perm.id === permissionId ? { ...perm, granted: checked } : perm
      )
    );
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${id}/permissions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ permissions })
      });

      if (response.ok) {
        alert('Permissions updated successfully!');
      } else {
        alert('Failed to update permissions');
      }
    } catch (error) {
      console.error('Error saving permissions:', error);
      alert('Error saving permissions');
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
            <p className="mt-3">Loading permissions...</p>
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
              <i className="bi bi-shield-check text-primary me-2"></i>
              User Permissions
            </h3>
            <p className="text-muted mb-0">
              {userInfo && `${userInfo.first_name} ${userInfo.last_name}`} • Role: {userInfo?.role}
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

        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="bi bi-list-check me-2"></i>
              Permission Matrix
            </h5>
          </div>
          <div className="card-body">
            {permissions.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-shield-slash display-4 text-muted mb-3"></i>
                <h5>No permissions configured</h5>
                <p className="text-muted">This user doesn't have any specific permissions assigned.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th width="50"></th>
                      <th>Permission</th>
                      <th>Description</th>
                      <th>Category</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map(perm => (
                      <tr key={perm.id}>
                        <td>
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={perm.granted || false}
                              onChange={(e) => handlePermissionChange(perm.id, e.target.checked)}
                            />
                          </div>
                        </td>
                        <td>
                          <strong>{perm.name}</strong>
                          <br />
                          <small className="text-muted">{perm.code}</small>
                        </td>
                        <td>{perm.description}</td>
                        <td>
                          <span className="badge bg-secondary">{perm.category}</span>
                        </td>
                        <td>
                          <span className={`badge ${perm.granted ? 'bg-success' : 'bg-secondary'}`}>
                            {perm.granted ? 'Granted' : 'Denied'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="card-footer">
            <div className="d-flex justify-content-between">
              <div>
                <span className="text-muted">
                  {permissions.filter(p => p.granted).length} of {permissions.length} permissions granted
                </span>
              </div>
              <div>
                <button className="btn btn-primary me-2" onClick={handleSave}>
                  <i className="bi bi-check-circle me-2"></i>
                  Save Permissions
                </button>
                <button className="btn btn-outline-secondary" onClick={() => navigate(`/user/${id}`)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Permission Groups */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-folder me-2"></i>
                  System Permissions
                </h6>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="sys_admin" />
                  <label className="form-check-label" htmlFor="sys_admin">
                    System Administration
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="sys_config" />
                  <label className="form-check-label" htmlFor="sys_config">
                    System Configuration
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="sys_monitor" />
                  <label className="form-check-label" htmlFor="sys_monitor">
                    System Monitoring
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-people me-2"></i>
                  User Management
                </h6>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="user_create" />
                  <label className="form-check-label" htmlFor="user_create">
                    Create Users
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="user_edit" />
                  <label className="form-check-label" htmlFor="user_edit">
                    Edit Users
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="user_delete" />
                  <label className="form-check-label" htmlFor="user_delete">
                    Delete Users
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-database me-2"></i>
                  Data Access
                </h6>
              </div>
              <div className="card-body">
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="data_read" />
                  <label className="form-check-label" htmlFor="data_read">
                    Read Data
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="data_write" />
                  <label className="form-check-label" htmlFor="data_write">
                    Write Data
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="data_export" />
                  <label className="form-check-label" htmlFor="data_export">
                    Export Data
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserPermissions;