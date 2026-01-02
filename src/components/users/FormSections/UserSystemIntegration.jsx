import DynamicField from "../../DynamicField.jsx";
// import { COMPANY_OPTIONS } from "../../../config/selectOptions.js";
import { DBSAUTH_ID } from "../../../config/selectOptions.js";

export const UserSystemIntegration = ({ formData, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
        Business Model
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Define your business strategy, revenue streams, and customer approach
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Revenue Streams - Using the new array type */}
        <DynamicField
          type="select"
          id="dbsauth_id"
          name="dbsauth_id"
          label="Database Authorizations"
          value={formData.dbsauth_id}
          error={errors.dbsauth_id}
          options={DBSAUTH_ID}
          placeholder="Select the authorized database"
          colWidth={12}
        />

        <DynamicField
          type="select"
          id="company_id"
          name="company_id"
          label="Company"
          value={formData.company_id}
          error={errors.company_id}
          placeholder="Select the company to which the user remains"
          colWidth={3}
        />

      </div>
    </div>
  </section>
);










/**
 * UserSystemIntegration.jsx
 * -------------------------
 * Form section for user system integration settings.
 * Includes company assignment, external system IDs, and integration settings.
 */

// export const UserSystemIntegration = ({
//   formData,
//   errors,
//   handleChange,
//   companyOptions = [],
//   disabled = false
// }) => {
//   // Default company options if none provided
//   const defaultCompanies = [
//     { id: 1, name: 'Main Company', code: 'MAIN' },
//     { id: 2, name: 'Subsidiary A', code: 'SUB-A' },
//     { id: 3, name: 'Subsidiary B', code: 'SUB-B' },
//     { id: 4, name: 'Partner Company', code: 'PARTNER' },
//     { id: 5, name: 'Test Company', code: 'TEST' },
//   ];

//   const companies = companyOptions.length > 0 ? companyOptions : defaultCompanies;

//   return (
//     <div>
//       <h5 className="card-title mb-4">
//         <i className="bi bi-puzzle me-2 text-primary"></i>
//         System Integration
//       </h5>

//       <p className="text-muted mb-4">
//         Configure user integration with external systems and company assignments.
//       </p>

//       {/* Company Assignment */}
//       <div className="card mb-4 border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-building me-2"></i>
//             Company Assignment
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="company_id" className="form-label">
//                 Primary Company *
//               </label>
//               <select
//                 className={`form-select ${errors.company_id ? 'is-invalid' : ''}`}
//                 id="company_id"
//                 name="company_id"
//                 value={formData.company_id || ''}
//                 onChange={handleChange}
//                 disabled={disabled}
//                 required
//               >
//                 <option value="">Select Company</option>
//                 {companies.map((company) => (
//                   <option key={company.id} value={company.id}>
//                     {company.name} ({company.code})
//                   </option>
//                 ))}
//               </select>
//               {errors.company_id && (
//                 <div className="invalid-feedback">{errors.company_id}</div>
//               )}
//               <small className="text-muted">
//                 Main company/organization for this user
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label htmlFor="secondary_companies" className="form-label">
//                 Secondary Companies
//               </label>
//               <select
//                 id="secondary_companies"
//                 className="form-select"
//                 multiple
//                 disabled={disabled}
//                 style={{ height: '100px' }}
//               >
//                 {companies.map((company) => (
//                   <option key={`secondary-${company.id}`} value={company.id}>
//                     {company.name}
//                   </option>
//                 ))}
//               </select>
//               <small className="text-muted">
//                 Additional company affiliations (hold Ctrl/Cmd to select multiple)
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* External System Integration */}
//       <div className="card mb-4 border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-plug me-2"></i>
//             External System Integration
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="dbsauth_id" className="form-label">
//                 Database Auth ID
//               </label>
//               <input
//                 type="text"
//                 className={`form-control ${errors.dbsauth_id ? 'is-invalid' : ''}`}
//                 id="dbsauth_id"
//                 name="dbsauth_id"
//                 value={formData.dbsauth_id || ''}
//                 onChange={handleChange}
//                 disabled={disabled}
//                 placeholder="e.g., DB-12345"
//               />
//               {errors.dbsauth_id && (
//                 <div className="invalid-feedback">{errors.dbsauth_id}</div>
//               )}
//               <small className="text-muted">
//                 External database authentication identifier
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label htmlFor="ldap_username" className="form-label">
//                 LDAP/AD Integration
//               </label>
//               <div className="input-group">
//                 <span className="input-group-text">
//                   <i className="bi bi-person-badge"></i>
//                 </span>
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="ldap_username"
//                   placeholder="LDAP/Active Directory username"
//                   disabled={disabled}
//                 />
//               </div>
//               <small className="text-muted">
//                 For Active Directory/LDAP integration
//               </small>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label className="form-label">
//                 SSO Integration
//               </label>
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   role="switch"
//                   id="sso_enabled"
//                   name="sso_enabled"
//                   disabled={disabled}
//                 />
//                 <label className="form-check-label" htmlFor="sso_enabled">
//                   Enable Single Sign-On
//                 </label>
//               </div>
//               <small className="text-muted">
//                 Allow login via external identity provider
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label htmlFor="api_access_key" className="form-label">
//                 API Access Key
//               </label>
//               <div className="input-group">
//                 <input
//                   type="text"
//                   className="form-control"
//                   id="api_access_key"
//                   placeholder="API key"
//                   disabled={disabled}
//                   readOnly
//                   value="••••••••••••••••"
//                 />
//                 <button
//                   className="btn btn-outline-secondary"
//                   type="button"
//                   id="refresh_api_key"
//                   disabled={disabled}
//                 >
//                   <i className="bi bi-arrow-clockwise"></i>
//                 </button>
//               </div>
//               <small className="text-muted">
//                 For API access and integrations
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Integration Settings */}
//       <div className="card border-0 shadow-sm">
//         <div className="card-header bg-light">
//           <h6 className="mb-0">
//             <i className="bi bi-gear me-2"></i>
//             Integration Settings
//           </h6>
//         </div>
//         <div className="card-body">
//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <label htmlFor="login_method" className="form-label">
//                 <i className="bi bi-box-arrow-in-right me-1"></i>
//                 Login Method
//               </label>
//               <select
//                 className="form-select"
//                 id="login_method"
//                 name="login_method"
//                 disabled={disabled}
//                 defaultValue="both"
//               >
//                 <option value="local">Local Authentication Only</option>
//                 <option value="sso">SSO Only</option>
//                 <option value="both">Both Local and SSO</option>
//               </select>
//               <small className="text-muted">
//                 Preferred authentication method
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <label htmlFor="sync_frequency" className="form-label">
//                 <i className="bi bi-broadcast me-1"></i>
//                 Sync Frequency
//               </label>
//               <select
//                 className="form-select"
//                 id="sync_frequency"
//                 name="sync_frequency"
//                 disabled={disabled}
//                 defaultValue="realtime"
//               >
//                 <option value="realtime">Real-time Sync</option>
//                 <option value="hourly">Hourly Sync</option>
//                 <option value="daily">Daily Sync</option>
//                 <option value="manual">Manual Sync Only</option>
//               </select>
//               <small className="text-muted">
//                 How often to sync with external systems
//               </small>
//             </div>
//           </div>

//           <div className="row">
//             <div className="col-md-6 mb-3">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   role="switch"
//                   id="audit_logging"
//                   name="audit_logging"
//                   defaultChecked={true}
//                   disabled={disabled}
//                 />
//                 <label className="form-check-label" htmlFor="audit_logging">
//                   Audit Logging
//                 </label>
//               </div>
//               <small className="text-muted">
//                 Log all integration activities
//               </small>
//             </div>

//             <div className="col-md-6 mb-3">
//               <div className="form-check form-switch">
//                 <input
//                   className="form-check-input"
//                   type="checkbox"
//                   role="switch"
//                   id="auto_provision"
//                   name="auto_provision"
//                   defaultChecked={true}
//                   disabled={disabled}
//                 />
//                 <label className="form-check-label" htmlFor="auto_provision">
//                   Auto-provision Resources
//                 </label>
//               </div>
//               <small className="text-muted">
//                 Automatically create resources in integrated systems
//               </small>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Integration Status */}
//       <div className="mt-4 p-3 bg-light rounded">
//         <h6 className="mb-2">
//           <i className="bi bi-info-circle me-2"></i>
//           Integration Status
//         </h6>
//         <div className="row">
//           <div className="col-md-4">
//             <small className="text-muted d-block">Company:</small>
//             <strong>
//               {companies.find(c => c.id === formData.company_id)?.name || 'Not assigned'}
//             </strong>
//           </div>
//           <div className="col-md-4">
//             <small className="text-muted d-block">DB Auth ID:</small>
//             <strong>
//               {formData.dbsauth_id || 'Not configured'}
//             </strong>
//           </div>
//           <div className="col-md-4">
//             <small className="text-muted d-block">Integration:</small>
//             <strong className="text-success">
//               Active
//             </strong>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserSystemIntegration;