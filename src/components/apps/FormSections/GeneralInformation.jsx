import DynamicField from "./DynamicField.jsx";

export const GeneralInformation = ({
  formData,
  handleChange,
  errors,
  releaseOptions
}) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-info-circle text-primary me-2"></i>
        General Information
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Basic application details, identification, and core information
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Application Identification */}
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-tag me-2"></i>
            Application Identification
          </h6>
        </div>

        <DynamicField
          type="number"
          name="id"
          label="Application ID"
          value={formData.id}
          onChange={handleChange}
          error={errors.id}
          colWidth={6}
          disabled
          readOnly
        />

        <DynamicField
          type="text"
          name="name"
          label="Application Name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          placeholder="Enter your application name"
          required
          colWidth={6}
        />

        <DynamicField
          type="select"
          name="release"
          label="Release Version"
          options={releaseOptions}
          value={formData.release}
          onChange={handleChange}
          error={errors.release}
          placeholder="Select release version"
          required
          colWidth={6}
        />

        <DynamicField
          type="text"
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleChange}
          error={errors.category}
          placeholder="e.g., Productivity, Finance, Social Media"
          colWidth={6}
        />

        {/* Application Details */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-card-text me-2"></i>
            Application Details
          </h6>
        </div>

        <DynamicField
          type="text"
          name="title"
          label="Application Title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Official display title"
          colWidth={12}
        />

        <DynamicField
          type="textarea"
          name="description"
          label="Description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          placeholder="Describe your application's purpose and main features..."
          rows={3}
          colWidth={12}
        />

        <DynamicField
          type="textarea"
          name="positioning_stmt"
          label="Positioning Statement"
          value={formData.positioning_stmt}
          onChange={handleChange}
          error={errors.positioning_stmt}
          placeholder="Brief statement that positions your application in the market..."
          rows={2}
          colWidth={12}
        />

        {/* Platform & Technical */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-laptop me-2"></i>
            Platform & Technical
          </h6>
        </div>

        <DynamicField
          type="array"
          name="platform"
          label="Supported Platforms"
          value={formData.platform}
          onChange={handleChange}
          error={errors.platform}
          placeholder="Web, iOS, Android, Windows, macOS, Linux..."
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="size"
          label="Application Size (MB)"
          value={formData.size}
          onChange={handleChange}
          error={errors.size}
          placeholder="File size in megabytes"
          min="0"
          step="0.1"
          colWidth={6}
        />

        <DynamicField
          type="text"
          name="license_type"
          label="License Type"
          value={formData.license_type}
          onChange={handleChange}
          error={errors.license_type}
          placeholder="e.g., MIT, GPL, Commercial, Proprietary"
          colWidth={6}
        />

        <DynamicField
          type="text"
          name="developer"
          label="Developer/Company"
          value={formData.developer}
          onChange={handleChange}
          error={errors.developer}
          placeholder="Developer or company name"
          colWidth={6}
        />

        {/* Web Presence */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-globe me-2"></i>
            Web Presence
          </h6>
        </div>

        <DynamicField
          type="url"
          name="web"
          label="Website"
          value={formData.web}
          onChange={handleChange}
          error={errors.web}
          placeholder="https://yourapp.com"
          colWidth={6}
        />

        <DynamicField
          type="url"
          name="url"
          label="Application URL"
          value={formData.url}
          onChange={handleChange}
          error={errors.url}
          placeholder="https://app.yourapp.com"
          colWidth={6}
        />

        <DynamicField
          type="url"
          name="landing_page"
          label="Landing Page"
          value={formData.landing_page}
          onChange={handleChange}
          error={errors.landing_page}
          placeholder="https://yourapp.com/landing"
          colWidth={12}
        />

        {/* Media & Dates */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-calendar me-2"></i>
            Media & Dates
          </h6>
        </div>

        <DynamicField
          type="file"
          name="logo"
          label="Application Logo"
          accept="image/*"
          value={formData.logo}
          onChange={handleChange}
          error={errors.logo}
          colWidth={6}
        />

        <DynamicField
          type="date"
          name="created"
          label="Creation Date"
          value={formData.created}
          onChange={handleChange}
          error={errors.created}
          readOnly
          colWidth={6}
        />

        <DynamicField
          type="date"
          name="updated"
          label="Last Updated"
          value={formData.updated}
          onChange={handleChange}
          error={errors.updated}
          readOnly
          colWidth={6}
        />
      </div>
    </div>
  </section>
);