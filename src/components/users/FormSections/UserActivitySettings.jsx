/**
 * UserActivitySettings.jsx
 * ------------------------
 * Form section for user activity tracking and usage settings.
 * Includes last used app, last used database, language preference, and session settings.
 */

import DynamicField from "../../DynamicField.jsx";
import { LANGUAGE_OPTIONS, APP_OPTIONS } from "../../../config/selectOptions.js";

export const UserActivitySettings = ({
  formData,
  errors,
  disabled = false
}) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
          Activity & Usage Settings
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Configure user activity tracking, language preferences, and usage patterns.
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        <DynamicField
          type="select"
          id="lan"
          name="lan"
          label="Language Preference"
          value={formData.lan}
          error={errors.lan}
          options={ LANGUAGE_OPTIONS }
          multiple={false}
          required={true}
          colWidth={12}
          disabled={disabled}
          placeholder="Select Language"
        />

        <DynamicField
          type="select"
          id="last_app"
          name="last_app"
          label="Last Application Used"
          value={formData.last_app}
          error={errors.last_app}
          options={ APP_OPTIONS }
          multiple={false}
          required={false}
          colWidth={6}
          disabled={disabled}
          placeholder="Select Application"
        />

        <DynamicField
          type="select"
          id="last_db"
          name="last_db"
          label="Last Database Used"
          value={formData.last_db}
          error={errors.last_db}
          // options={ DB_OPTIONS }
          multiple={false}
          required={false}
          colWidth={6}
          disabled={disabled}
          placeholder="Select Database"
        />

        <DynamicField
          type="number"
          id="tries"
          name="tries"
          label="Login Attempts"
          value={formData.tries}
          error={errors.tries}
          colWidth={6}
          disabled={disabled}
          min={0}
          max={100}
          placeholder="Number of failed login attempts"
        />
      </div>
    </div>
  </section>
);

export default UserActivitySettings;