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
export const UserAccessPermissions = ({ formData, errors }) => {
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
          value={FormData.role || ''}
          error={errors.role}
          options={ ROLES }
          placeholder="Select Role"
          colWidth={12}
        />

        <DynamicField
          type="select"
          id="profile_id"
          name="profile_id"
          label="Profile Selection"
          value={FormData.profile_id || ''}
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
          value={FormData.group_id || ''}
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
          value={formData.permissions}
          error={errors.permissions}
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
};

// export const UserAccessPermissions = ({
//   formData,
//   errors,
//   handleChange,
//   roleOptions = [],
//   profileOptions = [],
//   groupOptions = [],
//   disabled = false
// }) => {
//   // Default options if none provided
//   const defaultRoles = [
//     { id: 'admin', name: 'Administrator', description: 'Full system access' },
//     { id: 'manager', name: 'Manager', description: 'Department management access' },
//     { id: 'user', name: 'Standard User', description: 'Regular user access' },
//     { id: 'viewer', name: 'Viewer', description: 'Read-only access' },
//     { id: 'guest', name: 'Guest', description: 'Limited temporary access' },
//   ];

//   const defaultProfiles = [
//     { id: 1, name: 'System Admin', permissions: 255 },
//     { id: 2, name: 'Content Manager', permissions: 127 },
//     { id: 3, name: 'Data Analyst', permissions: 63 },
//     { id: 4, name: 'Support Agent', permissions: 31 },
//     { id: 5, name: 'Regular User', permissions: 15 },
//   ];

//   const defaultGroups = [
//     { id: 1, name: 'Administrators', type: 'System' },
//     { id: 2, name: 'Managers', type: 'Management' },
//     { id: 3, name: 'Developers', type: 'Technical' },
//     { id: 4, name: 'Support', type: 'Customer Service' },
//     { id: 5, name: 'Guests', type: 'Temporary' },
//   ];

//   const roles = roleOptions.length > 0 ? roleOptions : defaultRoles;
//   const profiles = profileOptions.length > 0 ? profileOptions : defaultProfiles;
//   const groups = groupOptions.length > 0 ? groupOptions : defaultGroups;
//   return (
//     <div className="card-body">
//       <div className="row g-4"></div>


//     <div>
//       <h5 className="card-title mb-4">
//         <i className="bi bi-shield-check me-2 text-primary"></i>
//         Access & Permissions
//       </h5>

//       <p className="text-muted mb-4">
//         Configure user roles, profiles, and group memberships for access control.
//       </p>

//       {/* Role Assignment */}
//       <div className="card mb-4 border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-person-badge me-2"></i>
//             Role Assignment
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="role" className="form-label">
//                 Primary Role *
//               </label>
//               <select
//                 className={`form-select ${errors.role ? 'is-invalid' : ''}`}
//                 id="role"
//                 name="role"
//                 value={formData.role || ''}
//                 onChange={handleChange}
//                 disabled={disabled}
//                 data-testid="primary-role-select"
//               >
//                 <option value="">Select Role</option>
//                 {roles.map((role) => (
//                   <option key={role.id} value={role.id}>
//                     {role.name}
//                     {role.description && ` - ${role.description}`}
//                   </option>
//                 ))}
//               </select>
//               {errors.role && (
//                 <div className="invalid-feedback">{errors.role}</div>
//               )}
//               <small className="text-muted">
//                 Primary role determines base permissions
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label className="form-label">
//                 Secondary Roles
//               </label>
//               <select
//                 className="form-select"
//                 multiple
//                 disabled={disabled}
//                 style={{ height: '100px' }}
//                 data-testid="secondary-roles-select"
//               >
//                 {roles.map((role) => (
//                   <option key={`secondary-${role.id}`} value={role.id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//               <small className="text-muted">
//                 Hold Ctrl/Cmd to select multiple roles
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Profile & Group Settings */}
//       <div className="card mb-4 border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-people me-2"></i>
//             Profile & Group Settings
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="profile_id" className="form-label">
//                 Profile
//               </label>
//               <select
//                 className={`form-select ${errors.profile_id ? 'is-invalid' : ''}`}
//                 id="profile_id"
//                 name="profile_id"
//                 value={formData.profile_id || ''}
//                 onChange={handleChange}
//                 disabled={disabled}
//                 data-testid="profile-select"
//               >
//                 <option value="">Select Profile</option>
//                 {profiles.map((profile) => (
//                   <option key={profile.id} value={profile.id}>
//                     {profile.name}
//                   </option>
//                 ))}
//               </select>
//               {errors.profile_id && (
//                 <div className="invalid-feedback">{errors.profile_id}</div>
//               )}
//               <small className="text-muted">
//                 User profile with predefined permission sets
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label htmlFor="group_id" className="form-label">
//                 Primary Group
//               </label>
//               <select
//                 className={`form-select ${errors.group_id ? 'is-invalid' : ''}`}
//                 id="group_id"
//                 name="group_id"
//                 value={formData.group_id || ''}
//                 onChange={handleChange}
//                 disabled={disabled}
//                 data-testid="group-select"
//               >
//                 <option value="">Select Group</option>
//                 {groups.map((group) => (
//                   <option key={group.id} value={group.id}>
//                     {group.name} ({group.type})
//                   </option>
//                 ))}
//               </select>
//               {errors.group_id && (
//                 <div className="invalid-feedback">{errors.group_id}</div>
//               )}
//               <small className="text-muted">
//                 Main user group for organization
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Permission Summary */}
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-list-check me-2"></i>
//             Permission Summary
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6">
//               <h6>Current Permissions</h6>
//               <ul className="list-unstyled">
//                 <li className="mb-2">
//                   <i className="bi bi-check-circle-fill text-success me-2"></i>
//                   Read Access
//                 </li>
//                 <li className="mb-2">
//                   <i className="bi bi-check-circle-fill text-success me-2"></i>
//                   Write Access
//                 </li>
//                 <li className="mb-2">
//                   <i className="bi bi-x-circle-fill text-danger me-2"></i>
//                   Delete Access
//                 </li>
//                 <li className="mb-2">
//                   <i className="bi bi-check-circle-fill text-success me-2"></i>
//                   View Reports
//                 </li>
//                 <li className="mb-2">
//                   <i className="bi bi-x-circle-fill text-danger me-2"></i>
//                   Manage Users
//                 </li>
//               </ul>
//             </div>

//             <div className="col-md-6">
//               <h6>Access Areas</h6>
//               <div className="form-check mb-2">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="access_dashboard"
//                   defaultChecked={true}
//                   disabled={disabled}
//                   data-testid="dashboard-checkbox"
//                 />
//                 <label className="form-check-label" htmlFor="access_dashboard">
//                   Dashboard
//                 </label>
//               </div>
//               <div className="form-check mb-2">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="access_reports"
//                   defaultChecked={true}
//                   disabled={disabled}
//                   data-testid="reports-checkbox"
//                 />
//                 <label className="form-check-label" htmlFor="access_reports">
//                   Reports
//                 </label>
//               </div>
//               <div className="form-check mb-2">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="access_settings"
//                   defaultChecked={false}
//                   disabled={disabled}
//                   data-testid="settings-checkbox"
//                 />
//                 <label className="form-check-label" htmlFor="access_settings">
//                   System Settings
//                 </label>
//               </div>
//               <div className="form-check mb-2">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   id="access_admin"
//                   defaultChecked={false}
//                   disabled={disabled}
//                   data-testid="admin-checkbox"
//                 />
//                 <label className="form-check-label" htmlFor="access_admin">
//                   Administration
//                 </label>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserAccessPermissions;