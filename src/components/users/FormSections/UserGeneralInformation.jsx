export const UserGeneralInformation = ({ formData, errors, handleChange, roleOptions, disabled }) => (
  <div>
    <h5 className="card-title mb-4">
      <i className="bi bi-person-lines-fill me-2 text-primary"></i>
      General Information
    </h5>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="first_name" className="form-label">
          First Name *
        </label>
        <input
          type="text"
          className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
          id="first_name"
          name="first_name"
          value={formData.first_name || ''}
          onChange={handleChange}
          disabled={disabled}
          required
        />
        {errors.first_name && (
          <div className="invalid-feedback">{errors.first_name}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="last_name" className="form-label">
          Last Name *
        </label>
        <input
          type="text"
          className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
          id="last_name"
          name="last_name"
          value={formData.last_name || ''}
          onChange={handleChange}
          disabled={disabled}
          required
        />
        {errors.last_name && (
          <div className="invalid-feedback">{errors.last_name}</div>
        )}
      </div>
    </div>

    <div className="row">
      <div className="col-md-6 mb-3">
        <label htmlFor="email" className="form-label">
          Email Address *
        </label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          id="email"
          name="email"
          value={formData.email || ''}
          onChange={handleChange}
          disabled={disabled}
          required
        />
        {errors.email && (
          <div className="invalid-feedback">{errors.email}</div>
        )}
      </div>

      <div className="col-md-6 mb-3">
        <label htmlFor="code" className="form-label">
          User Code
        </label>
        <input
          type="text"
          className={`form-control ${errors.code ? 'is-invalid' : ''}`}
          id="code"
          name="code"
          value={formData.code || ''}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Unique identifier"
        />
        {errors.code && (
          <div className="invalid-feedback">{errors.code}</div>
        )}
      </div>
    </div>
  </div>
);