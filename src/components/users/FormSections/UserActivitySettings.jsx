/**
 * UserActivitySettings.jsx
 * ------------------------
 * Form section for user activity tracking and usage settings.
 * Includes last used app, last used database, language preference, and session settings.
 */

import { useState, useEffect } from 'react';

export const UserActivitySettings = ({
  formData,
  errors,
  handleChange,
  appOptions = [],
  dbOptions = [],
  disabled = false
}) => {
  const [languageOptions] = useState([
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'es', label: 'Spanish', flag: '🇪🇸' },
    { value: 'fr', label: 'French', flag: '🇫🇷' },
    { value: 'de', label: 'German', flag: '🇩🇪' },
    { value: 'it', label: 'Italian', flag: '🇮🇹' },
    { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
    { value: 'zh', label: 'Chinese', flag: '🇨🇳' },
    { value: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { value: 'ru', label: 'Russian', flag: '🇷🇺' },
    { value: 'ar', label: 'Arabic', flag: '🇸🇦' },
  ]);

  // Mock data for app and database options - replace with actual API calls
  useEffect(() => {
    // In a real app, you would fetch these from your backend
    // For now, we'll use the props if provided
    if (appOptions.length === 0) {
      // Mock app options - replace with actual API call
      // These would be set via props from parent component
    }

    if (dbOptions.length === 0) {
      // Mock database options - replace with actual API call
      // These would be set via props from parent component
    }
  }, [appOptions, dbOptions]);

  const handleResetActivity = () => {
    if (window.confirm('Reset all activity data? This will clear last login, last action, and login attempts.')) {
      // This would be handled by the parent component
      console.log('Reset activity requested');
    }
  };

  return (
    <div>
      <h5 className="card-title mb-4">
        <i className="bi bi-activity me-2 text-primary"></i>
        Activity & Usage Settings
      </h5>

      <p className="text-muted mb-4">
        Configure user activity tracking, language preferences, and usage patterns.
      </p>

      {/* Language and Regional Settings */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-translate me-2"></i>
            Language & Regional Settings
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="lan" className="form-label">
                <i className="bi bi-globe me-1"></i>
                Language Preference *
              </label>
              <select
                className={`form-select ${errors.lan ? 'is-invalid' : ''}`}
                id="lan"
                name="lan"
                value={formData.lan || 'en'}
                onChange={handleChange}
                disabled={disabled}
              >
                <option value="">Select Language</option>
                {languageOptions.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.flag} {lang.label}
                  </option>
                ))}
              </select>
              {errors.lan && (
                <div className="invalid-feedback">{errors.lan}</div>
              )}
              <small className="text-muted">
                Default interface language for this user
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="date_format" className="form-label">
                <i className="bi bi-calendar me-1"></i>
                Date Format
              </label>
              <select
                className="form-select"
                id="date_format"
                disabled={disabled}
                defaultValue="auto"
              >
                <option value="auto">Auto-detect (based on language)</option>
                <option value="mm/dd/yyyy">MM/DD/YYYY (US)</option>
                <option value="dd/mm/yyyy">DD/MM/YYYY (EU)</option>
                <option value="yyyy-mm-dd">YYYY-MM-DD (ISO)</option>
              </select>
              <small className="text-muted">
                Date display format preference
              </small>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="time_zone" className="form-label">
                <i className="bi bi-clock me-1"></i>
                Time Zone
              </label>
              <select
                className="form-select"
                id="time_zone"
                disabled={disabled}
                defaultValue="auto"
              >
                <option value="auto">Auto-detect (based on IP)</option>
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time (EST)</option>
                <option value="CST">Central Time (CST)</option>
                <option value="PST">Pacific Time (PST)</option>
                <option value="GMT">GMT (London)</option>
                <option value="CET">CET (Central Europe)</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="currency" className="form-label">
                <i className="bi bi-currency-dollar me-1"></i>
                Currency
              </label>
              <select
                className="form-select"
                id="currency"
                disabled={disabled}
                defaultValue="USD"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="AUD">AUD (A$)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Last Used Resources */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-clock-history me-2"></i>
            Recent Usage
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="last_app" className="form-label">
                <i className="bi bi-app me-1"></i>
                Last Application Used
              </label>
              <select
                className={`form-select ${errors.last_app ? 'is-invalid' : ''}`}
                id="last_app"
                name="last_app"
                value={formData.last_app || ''}
                onChange={handleChange}
                disabled={disabled}
              >
                <option value="">Not specified</option>
                {appOptions.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                    {app.description && ` - ${app.description}`}
                  </option>
                ))}
              </select>
              {errors.last_app && (
                <div className="invalid-feedback">{errors.last_app}</div>
              )}
              <small className="text-muted">
                Most recently accessed application
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="last_db" className="form-label">
                <i className="bi bi-database me-1"></i>
                Last Database Used
              </label>
              <select
                className={`form-select ${errors.last_db ? 'is-invalid' : ''}`}
                id="last_db"
                name="last_db"
                value={formData.last_db || ''}
                onChange={handleChange}
                disabled={disabled}
              >
                <option value="">Not specified</option>
                {dbOptions.map((db) => (
                  <option key={db.id} value={db.id}>
                    {db.name} ({db.type})
                  </option>
                ))}
              </select>
              {errors.last_db && (
                <div className="invalid-feedback">{errors.last_db}</div>
              )}
              <small className="text-muted">
                Most recently accessed database
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="card mb-4 border-0 shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-laptop me-2"></i>
            Session & Interface Settings
          </h6>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="auto_logout"
                  name="auto_logout"
                  defaultChecked={true}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor="auto_logout">
                  Auto Logout
                </label>
              </div>
              <small className="text-muted">
                Automatically log out after 30 minutes of inactivity
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="email_notifications"
                  name="email_notifications"
                  defaultChecked={true}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor="email_notifications">
                  Email Notifications
                </label>
              </div>
              <small className="text-muted">
                Send email notifications for important events
              </small>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="theme_preference" className="form-label">
                <i className="bi bi-palette me-1"></i>
                Theme Preference
              </label>
              <select
                className="form-select"
                id="theme_preference"
                disabled={disabled}
                defaultValue="light"
              >
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
                <option value="auto">Auto (System Preference)</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="default_view" className="form-label">
                <i className="bi bi-eye me-1"></i>
                Default View
              </label>
              <select
                className="form-select"
                id="default_view"
                disabled={disabled}
                defaultValue="list"
              >
                <option value="list">List View</option>
                <option value="grid">Grid View</option>
                <option value="table">Table View</option>
                <option value="cards">Card View</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Management */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <h6 className="mb-0">
            <i className="bi bi-gear me-2"></i>
            Activity Management
          </h6>
        </div>
        <div className="card-body">
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Note:</strong> These settings affect how the user's activity is tracked and displayed.
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="tries" className="form-label">
                <i className="bi bi-shield-exclamation me-1"></i>
                Login Attempts
              </label>
              <input
                type="number"
                className={`form-control ${errors.tries ? 'is-invalid' : ''}`}
                id="tries"
                name="tries"
                value={formData.tries || 0}
                onChange={handleChange}
                disabled={disabled}
                min="0"
                max="100"
              />
              {errors.tries && (
                <div className="invalid-feedback">{errors.tries}</div>
              )}
              <small className="text-muted">
                Number of failed login attempts (0 to reset)
              </small>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="activity_tracking" className="form-label">
                <i className="bi bi-activity me-1"></i>
                Activity Tracking
              </label>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={handleResetActivity}
                  disabled={disabled}
                  id="reset_activity_button"
                >
                  <i className="bi bi-arrow-clockwise me-1"></i>
                  Reset Activity
                </button>
                <button
                  type="button"
                  className="btn btn-outline-info btn-sm"
                  disabled={disabled}
                  id="view_activity_log_button"
                >
                  <i className="bi bi-graph-up me-1"></i>
                  View Activity Log
                </button>
              </div>
              <small className="text-muted d-block mt-1">
                Manage user activity data and tracking
              </small>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="track_activity"
                  name="track_activity"
                  defaultChecked={true}
                  disabled={disabled}
                />
                <label className="form-check-label" htmlFor="track_activity">
                  Enable detailed activity tracking
                </label>
              </div>
              <small className="text-muted">
                Record detailed user actions for analytics and audit purposes
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Section */}
      <div className="mt-4 p-3 bg-light rounded" id="settings_summary">
        <h6 className="mb-2">
          <i className="bi bi-info-circle me-2"></i>
          Current Settings Summary
        </h6>
        <div className="row">
          <div className="col-md-4">
            <small className="text-muted d-block">Language:</small>
            <strong id="summary_language">
              {languageOptions.find(lang => lang.value === formData.lan)?.label || 'English'}
            </strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Last App:</small>
            <strong id="summary_last_app">
              {formData.last_app ? `App #${formData.last_app}` : 'Not specified'}
            </strong>
          </div>
          <div className="col-md-4">
            <small className="text-muted d-block">Failed Logins:</small>
            <strong className={formData.tries > 3 ? 'text-danger' : ''} id="summary_failed_logins">
              {formData.tries || 0} attempts
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivitySettings;