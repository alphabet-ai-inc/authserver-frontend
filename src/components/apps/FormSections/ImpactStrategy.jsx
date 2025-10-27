import DynamicField from "./DynamicField.jsx";

export const ImpactStrategy = ({ formData, handleChange, errors }) => (
    <section className="form-section card mb-4">
      <div className="card-body">
        <h4 className="card-title mb-4">
          <i className="bi bi-people me-2"></i>
          Impact & Strategy
        </h4>

        <div className="row g-3">
          <DynamicField
            name="environmental_impact"
            label="Environmental Impact"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.environmental_impact}
            onChange={handleChange}
            error={errors.environmental_impact}
          />

          <DynamicField
            name="social_impact"
            label="Social Impact"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.social_impact}
            onChange={handleChange}
            error={errors.social_impact}
          />

          <DynamicField
            name="intellectual_property"
            label="Intellectual Property"
            type="textarea"
            value={formData.intellectual_property}
            onChange={handleChange}
            error={errors.intellectual_property}
            rows={4}
            placeholder="Describe your intellectual property strategy"
            colWidth={12}
          />

          <DynamicField
            name="funding_investment"
            label="Funding Investment"
            type="numeric"
            value={formData.funding_investment}
            onChange={handleChange}
            error={errors.funding_investment}
            placeholder="Put a number to the present funding investment"
          />
          <DynamicField
            name="exit_strategy"
            label="Exit Strategy"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.exit_strategy}
            onChange={handleChange}
            error={errors.exit_strategy}
            placeholder="Describe your exit strategy"
          />

          <DynamicField
            name="analytics_tools"
            label="Analytics Tools"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.analytics_tools}
            onChange={handleChange}
            error={errors.analytics_tools}
            placeholder="List the analytics tools you use"
          />

        </div>
      </div>
    </section>
);
