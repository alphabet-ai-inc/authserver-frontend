import DynamicField from "./DynamicField.jsx";
import { stringArrayToTextareaValue, textareaValueToStringArray } from '../../../utils/ArrayHandler.js';

export const TechnicalSpecifications = ({
  formData,
  handleChange,
  errors
  }) => (
    <section className="form-section card mb-4">
      <div className="card-body">
        <h4 className="card-title mb-4">
          <i className="bi bi-cpu me-2"></i>
          Technical Specifications
        </h4>

        <div className="row g-3">
          <DynamicField
            name="compatibility"
            label="Compatibility"
            type="textarea"
            rows={3}
            value={stringArrayToTextareaValue(formData.compatibility)}
            onChange={(event) => {
              try {
                const arrayValue = textareaValueToStringArray(event.target.value);
                handleChange({ target: { name: 'compatibility', value: arrayValue } });
              } catch (err) {
                handleChange({ target: { name: 'compatibility', value: formData.platform } });
                alert(err.message);
              }
              }}
              error={errors.compatibility}
              colswidth={12}
          />

          <DynamicField
            name="integration_capabilities"
            label="Integration Capabilities"
            multiple
            value={stringArrayToTextareaValue(formData.integration_capabilities)}
            onChange={(event) => {
              try {
                const arrayValue = textareaValueToStringArray(event.target.value);
                handleChange({ target: { name: 'integration_capabilities', value: arrayValue } });
              } catch (err) {
                handleChange({ target: { name: 'integration_capabilities', value: formData.integration_capabilities } });
                alert(err.message);
              }
            }}
            error={errors.integration_capabilities}
            options={{
              integrationCapabilities: ["Social Media APIs", "Analytics Tools", "promolibros.com", "tradeplusplus.com", "netaget.com"],
              // add other option arrays here
            }}
            rows={3}
            colswidth={12}
            type="tags"
          />

          <DynamicField
            name="development_stack"
            label="Development Stack"
            type="tags"
            multiple
            value={stringArrayToTextareaValue(formData.development_stack)}
            onChange={(event) => {
              try {
                const arrayValue = textareaValueToStringArray(event.target.value);
                handleChange({ target: { name: 'development_stack', value: arrayValue } });
              } catch (err) {
                handleChange({ target: { name: 'development_stack', value: formData.development_stack } });
              }
            }}
            error={errors.development_stack}
            options={{
              developmentStack: ['React', 'Node.js', 'GO', 'Python', 'Django', 'Rust', 'Kubernetes', 'Docker', 'Postgresql', 'Akai']
            }}
          />

          <DynamicField
            name="api_documentation"
            label="API Documentation"
            type="textarea"
            rows={3}
            colswidth={12}
            value={formData.api_documentation}
            onChange={handleChange}
            error={errors.api_documentation}
          />

          <DynamicField
            name="security_features"
            label="Security Features"
            type="textarea"
            rows={3}
            colswidth={12}
            value={formData.security_features}
            onChange={handleChange}
            error={errors.security_features}
          />

        <DynamicField
            name="regulatory_compliance"
            label="Regulatory Compliance"
            type="textarea"
            rows={3}
            colswidth={12}
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
        />

        <DynamicField
          name="init"
          label="Initialization Command"
          value={formData.init}
          onChange={handleChange}
          error={errors.init}
        />
        </div>
      </div>
    </section>
  );
