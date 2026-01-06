import DynamicField from "../../DynamicField.jsx";

export const DevelopmentStack = ({ formData, handleChange, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-code-slash text-primary me-2"></i>
        Development Stack & Performance
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Technical infrastructure, development tools, and performance metrics
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Development Process */}
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-diagram-3 me-2"></i>
            Development Process
          </h6>
        </div>

        <DynamicField
          type="textarea"
          name="roadmap"
          label="Development Roadmap"
          // onChange={handleChange}
          value={formData.roadmap}
          error={errors.roadmap}
          placeholder="Describe your development timeline, upcoming features, and future plans..."
          rows={4}
          colWidth={12}
        />

        <DynamicField
          type="array"
          name="version_control"
          label="Version Control & Tools"
          // onChange={handleChange}
          value={formData.version_control}
          error={errors.version_control}
          placeholder="Git, GitHub, GitLab, Bitbucket, SVN..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="key_activities"
          label="Key Development Activities"
          // onChange={handleChange}
          value={formData.key_activities}
          error={errors.key_activities}
          placeholder="Code reviews, CI/CD, Testing, Documentation..."
          colWidth={6}
        />

        {/* Performance Metrics */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-speedometer2 me-2"></i>
            Performance Metrics
          </h6>
        </div>

        <DynamicField
          type="number"
          name="average_response_time"
          label="Average Response Time (ms)"
          // onChange={handleChange}
          value={formData.average_response_time}
          error={errors.average_response_time}
          placeholder="Milliseconds"
          min="0"
          step="1"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="uptime_percentage"
          label="Uptime Percentage (%)"
          // onChange={handleChange}
          value={formData.uptime_percentage}
          error={errors.uptime_percentage}
          placeholder="0-100"
          min="0"
          max="100"
          step="0.01"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="error_rate"
          label="Error Rate (%)"
          // onChange={handleChange}
          value={formData.error_rate}
          error={errors.error_rate}
          placeholder="0-100"
          min="0"
          max="100"
          step="0.01"
          colWidth={6}
        />

        {/* Technical Stack */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-stack me-2"></i>
            Technical Stack
          </h6>
        </div>

        <DynamicField
          type="array"
          name="frontend_technologies"
          label="Frontend Technologies"
          // onChange={handleChange}
          value={formData.frontend_technologies}
          error={errors.frontend_technologies}
          placeholder="React, Vue, Angular, HTML5, CSS3..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="backend_technologies"
          label="Backend Technologies"
          // onChange={handleChange}
          value={formData.backend_technologies}
          error={errors.backend_technologies}
          placeholder="Node.js, Python, Java, .NET, PHP..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="database_technologies"
          label="Database Technologies"
          // onChange={handleChange}
          value={formData.database_technologies}
          error={errors.database_technologies}
          placeholder="MySQL, PostgreSQL, MongoDB, Redis..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="infrastructure_tools"
          label="Infrastructure & DevOps"
          // onChange={handleChange}
          value={formData.infrastructure_tools}
          error={errors.infrastructure_tools}
          placeholder="Docker, Kubernetes, AWS, Azure, Jenkins..."
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="deployment_process"
          label="Deployment Process"
          // onChange={handleChange}
          value={formData.deployment_process}
          error={errors.deployment_process}
          placeholder="Describe your deployment strategy, environments, and release process..."
          rows={3}
          colWidth={12}
        />
      </div>
    </div>
  </section>
);
export default DevelopmentStack;