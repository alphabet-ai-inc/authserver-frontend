import DynamicField from "../../DynamicField.jsx";
export const UserGeneralInformation = ({
  formData,
  errors
}) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-info-circle text-primary me-2"></i>
        General Information
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Basic user identification details
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-tag me-2"></i>
            User Identification
          </h6>
        </div>

        <DynamicField
          id="id"
          type="number"
          name="id"
          label="User ID"
          value={formData.id}
          error={errors.id}
          colWidth={12}
          disabled
          readOnly
        />

        <DynamicField
          id="first_name"
          type="text"
          name="first_name"
          label="First Name"
          value={formData.first_name}
          error={errors.first_name}
          placeholder="Enter first name"
          required
          colWidth={6}
        />

        <DynamicField
          id="last_name"
          type="text"
          name="last_name"
          label="Last Name"
          value={formData.last_name}
          error={errors.last_name}
          placeholder="Enter last name"
          required
          colWidth={6}
        />

        <DynamicField
          id="email"
          type="email"
          name="email"
          label="Email Address"
          value={formData.email}
          error={errors.email}
          placeholder="Enter email address"
          required
          colWidth={6}
        />

        <DynamicField
          id="code"
          type="text"
          name="code"
          label="User Code"
          value={formData.code}
          error={errors.code}
          placeholder="Unique identifier"
          colWidth={6}
        />
      </div>

    {/*
    <div className="row">
      </div>
    </div>
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
      </div>*/}
    </div>
  </section>
);