import DynamicField from "./DynamicField.jsx";

export const TechnicalSpecifications = ({
  formData,
  handleChange,
  errors,
  options
}) => {
    <section className="form-section card mb-4">
      <div className="card-body">
        <h4 className="card-title mb-4">
          <i className="bi bi-cpu me-2"></i>
          Technical Specifications
        </h4>

        <div className="row g-3">
          <DynamicField
            name="compatibility"
            value={formData.compatibility}
            onChange={handleChange}
            error={errors.compatibility}
          />

          <DynamicField
            name="integration_capabilities"
            multiple
            value={formData.integration_capabilities}
            onChange={handleChange}
            error={errors.integration_capabilities}
            options={{
              integrationCapabilities: ['Webhook', 'REST API', 'GraphQL'],
              // add other option arrays here
            }}
          />

          <DynamicField
            name="development_stack"
            type="tags"
            value={formData.development_stack}
            onChange={handleChange}
            error={errors.development_stack}
            suggestions={['React', 'Node.js', 'GO', 'Python', 'Java']}
          />

          <DynamicField
            name="api_documentation"
            value={formData.api_documentation}
            onChange={handleChange}
            error={errors.api_documentation}
          />

          <DynamicField
            name="security_features"
            type="tags"
            value={formData.security_features}
            onChange={handleChange}
            error={errors.security_features}
          />

        <DynamicField
            name="regulatory_compliance"
            type="tags"
            value={formData.regulatory_compliance}
            onChange={handleChange}
            error={errors.regulatory_compliance}
          />

        <DynamicField
          name="path"
          label="Installation Path"
          value={formData.path}
          onChange={handleChange}
          error={errors.path}
          required
            colWidth={3}
        />

        <DynamicField
          name="init"
          label="Initialization Command"
          value={formData.init}
          onChange={handleChange}
          error={errors.init}
          colWidth={3}
        />
        </div>
      </div>
    </section>
};
