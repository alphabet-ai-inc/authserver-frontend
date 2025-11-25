import DynamicField from "./DynamicField.jsx";

export const TechnicalSpecifications = ({
  formData,
  handleChange,
  errors
}) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-cpu text-primary me-2"></i>
        Technical Specifications
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Technical infrastructure, integration capabilities, and system requirements
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* System Requirements */}
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-gear me-2"></i>
            System Requirements
          </h6>
        </div>

        <DynamicField
          type="array"
          name="compatibility"
          label="System Compatibility"
          value={formData.compatibility}
          // onChange={handleChange}
          error={errors.compatibility}
          placeholder="Windows 10+, macOS 12+, Linux Ubuntu 20+, Android 10+, iOS 14+..."
          colWidth={12}
        />

        <DynamicField
          type="text"
          name="path"
          label="Installation Path"
          value={formData.path}
          // onChange={handleChange}
          error={errors.path}
          placeholder="e.g., /usr/local/bin/app, C:\Program Files\App"
          colWidth={6}
        />

        <DynamicField
          type="text"
          name="init"
          label="Initialization Command"
          value={formData.init}
          // onChange={handleChange}
          error={errors.init}
          placeholder="e.g., npm start, docker-compose up, ./start.sh"
          colWidth={6}
        />

        {/* Technology Stack */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-stack me-2"></i>
            Technology Stack
          </h6>
        </div>

        <DynamicField
          type="array"
          name="development_stack"
          label="Development Stack"
          value={formData.development_stack}
          // onChange={handleChange}
          error={errors.development_stack}
          placeholder="React, Node.js, Python, Django, PostgreSQL, Docker, Kubernetes..."
          colWidth={12}
        />

        {/* Integration & APIs */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-plug me-2"></i>
            Integration & APIs
          </h6>
        </div>

        <DynamicField
          type="array"
          name="integration_capabilities"
          label="Integration Capabilities"
          value={formData.integration_capabilities}
          // onChange={handleChange}
          error={errors.integration_capabilities}
          placeholder="REST APIs, GraphQL, Webhooks, OAuth, Social Media APIs..."
          colWidth={12}
        />

        <DynamicField
          type="textarea"
          name="api_documentation"
          label="API Documentation"
          value={formData.api_documentation}
          // onChange={handleChange}
          error={errors.api_documentation}
          placeholder="Describe your API endpoints, authentication methods, and usage examples..."
          rows={4}
          colWidth={12}
        />

        {/* Security & Compliance */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-shield-check me-2"></i>
            Security & Compliance
          </h6>
        </div>

        <DynamicField
          type="array"
          name="security_features"
          label="Security Features"
          value={formData.security_features}
          // onChange={handleChange}
          error={errors.security_features}
          placeholder="SSL/TLS, Encryption at rest, 2FA, Role-based access, Audit logging..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="regulatory_compliance"
          label="Regulatory Compliance"
          value={formData.regulatory_compliance}
          // onChange={handleChange}
          error={errors.regulatory_compliance}
          placeholder="GDPR, HIPAA, SOC2, PCI-DSS, ISO 27001..."
          colWidth={6}
        />

        {/* Additional Technical Fields */}
        <DynamicField
          type="array"
          name="supported_browsers"
          label="Supported Browsers"
          value={formData.supported_browsers}
          // onChange={handleChange}
          error={errors.supported_browsers}
          placeholder="Chrome 90+, Firefox 88+, Safari 14+, Edge 90+..."
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="database_systems"
          label="Database Systems"
          value={formData.database_systems}
          // onChange={handleChange}
          error={errors.database_systems}
          placeholder="PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch..."
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="deployment_architecture"
          label="Deployment Architecture"
          value={formData.deployment_architecture}
          // onChange={handleChange}
          error={errors.deployment_architecture}
          placeholder="Describe your deployment setup, cloud providers, and infrastructure..."
          rows={3}
          colWidth={12}
        />
      </div>
    </div>
  </section>
);