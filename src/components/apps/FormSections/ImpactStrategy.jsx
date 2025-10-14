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
            name="environmentalImpact"
            label="Environmental Impact"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.environmentalImpact}
            onChange={handleChange}
            error={errors.environmentalImpact}
          />

          <DynamicField
            name="socialImpact"
            label="Social Impact"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.socialImpact}
            onChange={handleChange}
            error={errors.socialImpact}
          />

          <DynamicField
            name="intellectualProperty"
            label="Intellectual Property"
            type="textarea"
            value={formData.intellectualProperty}
            onChange={handleChange}
            error={errors.intellectualProperty}
            rows={4}
            placeholder="Describe your intellectual property strategy"
            colWidth={12}
          />

          <DynamicField
            name="fundingInvestment"
            label="Funding Investment"
            type="numeric"
            value={formData.fundingInvestment}
            onChange={handleChange}
            error={errors.fundingInvestment}
            placeholder="Put a number to the present funding investment"
          />
          <DynamicField
            name="exitStrategy"
            label="Exit Strategy"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.exitStrategy}
            onChange={handleChange}
            error={errors.exitStrategy}
            placeholder="Describe your exit strategy"
          />

          <DynamicField
            name="analyticsTools"
            label="Analytics Tools"
            type="textarea"
            rows={4}
            colWidth={12}
            value={formData.analyticsTools}
            onChange={handleChange}
            error={errors.analyticsTools}
            placeholder="List the analytics tools you use"
          />

        </div>
      </div>
    </section>
);
