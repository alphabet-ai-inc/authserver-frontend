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
            name="integrationCapabilities"
            multiple
            value={formData.integrationCapabilities}
            onChange={handleChange}
            error={errors.integrationCapabilities}
            options={{
              integrationCapabilities: ['Webhook', 'REST API', 'GraphQL'],
              // add other option arrays here
            }}
          />

          <DynamicField
            name="developmentStack"
            type="tags"
            value={formData.developmentStack}
            onChange={handleChange}
            error={errors.developmentStack}
            suggestions={['React', 'Node.js', 'GO', 'Python', 'Java']}
          />

          <DynamicField
            name="apiDocumentation"
            value={formData.apiDocumentation}
            onChange={handleChange}
            error={errors.apiDocumentation}
          />

          <DynamicField
            name="securityFeatures"
            type="tags"
            value={formData.securityFeatures}
            onChange={handleChange}
            error={errors.securityFeatures}
          />

        <DynamicField
            name="regulatoryCompliance"
            type="tags"
            value={formData.regulatoryCompliance}
            onChange={handleChange}
            error={errors.regulatoryCompliance}
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
