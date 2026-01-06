/**
 * UserAccessPermissions.jsx
 * -------------------------
 * Form section for user access control and permissions.
 * Includes role assignment, profile selection, and group membership.
 * It is necessary to study the cathegories commented out below
 * and decide whether to include them or not or which ones are covered by
 * the current fields. Selection options are imported from config/selectOptions.js
 * but in many cases they need to be fetched from the backend and databases.
*/

import DynamicField from "../../DynamicField.jsx";
import { ROLES, PROFILES, GROUPS } from "../../../config/selectOptions.js";

export const UserAccessPermissions = ({ formData, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
        Access & Permissions
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Configure user roles, profiles, and group memberships for access control.
      </p>
    </div>
    <div className="card-body">
      <div className="row g-4">
        <DynamicField
          type="select"
          id="role"
          name="role"
          label="Role Assignment"
          value={formData.role || ''}  // FIXED: lowercase f
          error={errors.role}
          options={ROLES}
          placeholder="Select Role"
          colWidth={12}
        />
        <DynamicField
          type="select"
          id="profile_id"
          name="profile_id"
          label="Profile Selection"
          value={formData.profile_id || ''}
          error={errors.profile_id}
          options={ PROFILES }
          placeholder="Select Profile"
          colWidth={12}
        />

        <DynamicField
          type="select"
          id="group_id"
          name="group_id"
          label="Group Membership"
          value={formData.group_id || ''}
          error={errors.group_id}
          options={ GROUPS }
          multiple={true}
          placeholder="Select Group"
          colWidth={12}
        />

        <DynamicField
          type="select"
          id="dbsauth_id"
          name="dbsauth_id"
          label="Database Authorization IDs"
          value={formData.dbsauth_id || ''}
          error={errors.dbsauth_id}
          multiple={true}
          colWidth={5}
          placeholder="Select Databases Authorized"
        />

        <DynamicField
          type="select"
          id="company_id"
          name="company_id"
          label="Company ID"
          value={formData.company_id || ''}
          error={errors.company_id}
          multiple={true}
          placeholder="Enter Company"
          colWidth={12}
        />
      </div>
    </div>
  </section>
);