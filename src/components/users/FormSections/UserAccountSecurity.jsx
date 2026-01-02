import DynamicField from "../../DynamicField.jsx";

export const UserAccountSecurity = ({ formData, errors, handlePasswordChange, isNewUser, disabled }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
          Account & Security
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Manage user account status and security settings
      </p>
    </div>
    <div className="card-body">
      <div className="row g-4">
        <DynamicField
          type="password"
          id="password"
          name="password"
          label="Password"
          value={formData.password || ''}
          error={errors.password}
          // required={isNewUser}
          placeholder={isNewUser ? 'Enter password for new user' : 'Leave blank to keep current password'}
          onChange={(e) => handlePasswordChange('password', e.target.value)}
          disabled={disabled}
          colWidth={6}
        />
        {/* <DynamicField
          type="password"
          id="password_confirm"
          name="password_confirm"
          label="Password Confirm"
          value={formData.password_confirm || ''}
          error={errors.password_confirm}
          required={isNewUser}
          placeholder={isNewUser ? 'Enter password for new user' : 'Leave blank to keep current password'}
          onChange={(e) => handlePasswordChange('password', e.target.value)}
          disabled={disabled}
          colWidth={6}
        /> */}
        <DynamicField
          type="checkbox"
          id="active"
          name="active"
          label="Active Account"
          checked={formData.active || false}
          disabled={disabled}
          placeholder="User can log in if active"
          colWidth={6}
        />

        <DynamicField
          type="checkbox"
          id="blocked"
          name="blocked"
          label="Blocked Account"
          checked={formData.blocked || false}
          disabled={disabled}
          placeholder="Prevent user from logging in"
          colWidth={6}
        />
      </div>
    </div>
  </section>
);

// export const UserAccountSecurity = ({ formData, errors, handleChange, handlePasswordChange, isNewUser, disabled }) => (
//   <div>
//     <h5 className="card-title mb-4">
//       <i className="bi bi-shield-lock me-2 text-primary"></i>
//       Account & Security
//     </h5>

//     {isNewUser && (
//       <div className="row mb-4">
//         <div className="col-md-6 mb-3">
//           <label htmlFor="password" className="form-label">
//             Password *
//           </label>
//           <input
//             type="password"
//             className={`form-control ${errors.password ? 'is-invalid' : ''}`}
//             id="password"
//             name="password"
//             value={formData.password || ''}
//             onChange={(e) => handlePasswordChange('password', e.target.value)}
//             disabled={disabled}
//             required={isNewUser}
//           />
//           {errors.password && (
//             <div className="invalid-feedback">{errors.password}</div>
//           )}
//           <small className="text-muted">
//             {isNewUser ? 'Required for new users' : 'Leave blank to keep current password'}
//           </small>
//         </div>

//         <div className="col-md-6 mb-3">
//           <label htmlFor="password_confirm" className="form-label">
//             Confirm Password {isNewUser && '*'}
//           </label>
//           <input
//             type="password"
//             className={`form-control ${errors.password_confirm ? 'is-invalid' : ''}`}
//             id="password_confirm"
//             name="password_confirm"
//             value={formData.password_confirm || ''}
//             onChange={(e) => handlePasswordChange('password_confirm', e.target.value)}
//             disabled={disabled}
//             required={isNewUser}
//           />
//           {errors.password_confirm && (
//             <div className="invalid-feedback">{errors.password_confirm}</div>
//           )}
//         </div>
//       </div>
//     )}

//     <div className="row">
//       <div className="col-md-6 mb-3">
//         <div className="form-check form-switch">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             role="switch"
//             id="active"
//             name="active"
//             checked={formData.active || false}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//           <label className="form-check-label" htmlFor="active">
//             Active Account
//           </label>
//         </div>
//         <small className="text-muted">User can log in if active</small>
//       </div>

//       <div className="col-md-6 mb-3">
//         <div className="form-check form-switch">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             role="switch"
//             id="blocked"
//             name="blocked"
//             checked={formData.blocked || false}
//             onChange={handleChange}
//             disabled={disabled}
//           />
//           <label className="form-check-label" htmlFor="blocked">
//             Blocked Account
//           </label>
//         </div>
//         <small className="text-muted">Prevent user from logging in</small>
//       </div>
//     </div>
//   </div>
// );