/**
 * UserSettings.jsx
 * ----------------
 * User personal settings and preferences.
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavBar from '../../components/NavBar';

export const UserSettings = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // These would come from an API in a real app
  const [settings, setSettings] = useState({
    emailNotifications: true,
    desktopNotifications: false,
    autoSave: true,
    theme: 'light',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'yyyy-mm-dd',
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    // In a real app, this would call an API
    alert('Settings saved successfully!');
  };

  return (
    <>
      <NavBar />
      <div className="container-fluid mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3>
              <i className="bi bi-gear text-primary me-2"></i>
              User Settings
            </h3>
            <p className="text-muted mb-0">Personal preferences and configuration</p>
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
          <div className="col-md-3">
            <div className="card">
              <div className="card-body">
                <nav className="nav flex-column">
                  <button className="nav-link text-start active">
                    <i className="bi bi-bell me-2"></i>
                    Notifications
                  </button>
                  <button className="nav-link text-start">
                    <i className="bi bi-display me-2"></i>
                    Interface
                  </button>
                  <button className="nav-link text-start">
                    <i className="bi bi-shield me-2"></i>
                    Privacy
                  </button>
                  <button className="nav-link text-start">
                    <i className="bi bi-key me-2"></i>
                    Security
                  </button>
                  <button className="nav-link text-start">
                    <i className="bi bi-info-circle me-2"></i>
                    About
                  </button>
                </nav>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-bell me-2"></i>
                  Notification Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="emailNotifications">
                    Email Notifications
                  </label>
                  <small className="text-muted d-block">
                    Receive notifications via email
                  </small>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="desktopNotifications"
                    checked={settings.desktopNotifications}
                    onChange={(e) => handleSettingChange('desktopNotifications', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="desktopNotifications">
                    Desktop Notifications
                  </label>
                  <small className="text-muted d-block">
                    Show desktop notifications
                  </small>
                </div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="autoSave"
                    checked={settings.autoSave}
                    onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="autoSave">
                    Auto-save Changes
                  </label>
                  <small className="text-muted d-block">
                    Automatically save changes every 5 minutes
                  </small>
                </div>
              </div>
            </div>

            <div className="card mt-4">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="bi bi-display me-2"></i>
                  Interface Settings
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Theme</label>
                    <select
                      className="form-select"
                      value={settings.theme}
                      onChange={(e) => handleSettingChange('theme', e.target.value)}
                    >
                      <option value="light">Light Theme</option>
                      <option value="dark">Dark Theme</option>
                      <option value="auto">Auto (System Preference)</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Language</label>
                    <select
                      className="form-select"
                      value={settings.language}
                      onChange={(e) => handleSettingChange('language', e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Timezone</label>
                    <select
                      className="form-select"
                      value={settings.timezone}
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="CST">Central Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Date Format</label>
                    <select
                      className="form-select"
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    >
                      <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                      <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                      <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button className="btn btn-primary me-2" onClick={handleSave}>
                <i className="bi bi-check-circle me-2"></i>
                Save Settings
              </button>
              <button className="btn btn-outline-secondary" onClick={() => navigate(`/user/${id}`)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSettings;