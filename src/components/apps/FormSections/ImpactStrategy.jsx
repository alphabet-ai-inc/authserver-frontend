import DynamicField from "../../DynamicField.jsx";

export const ImpactStrategy = ({ formData, handleChange, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-rocket text-primary me-2"></i>
        Impact & Strategy
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Social responsibility, environmental impact, and long-term strategic planning
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Social & Environmental Impact */}
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-globe2 me-2"></i>
            Social & Environmental Impact
          </h6>
        </div>

        <DynamicField
          type="textarea"
          name="social_impact"
          label="Social Impact & Responsibility"
          value={formData.social_impact}
          // onChange={handleChange}
          error={errors.social_impact}
          placeholder="Describe how your application benefits society, communities, or specific groups..."
          rows={4}
          colWidth={12}
        />

        <DynamicField
          type="textarea"
          name="environmental_impact"
          label="Environmental Impact & Sustainability"
          value={formData.environmental_impact}
          // onChange={handleChange}
          error={errors.environmental_impact}
          placeholder="Describe your environmental initiatives, carbon footprint reduction, or sustainability practices..."
          rows={4}
          colWidth={12}
        />

        {/* Business Strategy */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Business Strategy
          </h6>
        </div>

        <DynamicField
          type="number"
          name="funding_investment"
          label="Funding & Investment ($)"
          value={formData.funding_investment}
          // onChange={handleChange}
          error={errors.funding_investment}
          placeholder="Total funding received to date"
          min="0"
          step="0.01"
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="exit_strategy"
          label="Exit Strategy & Long-term Vision"
          value={formData.exit_strategy}
          // onChange={handleChange}
          error={errors.exit_strategy}
          placeholder="Describe your long-term business goals, acquisition strategy, or IPO plans..."
          rows={3}
          colWidth={6}
        />

        {/* Intellectual Property */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-shield me-2"></i>
            Intellectual Property
          </h6>
        </div>

        <DynamicField
          type="textarea"
          name="intellectual_property"
          label="Intellectual Property Strategy"
          value={formData.intellectual_property}
          // onChange={handleChange}
          error={errors.intellectual_property}
          placeholder="Describe your patents, trademarks, copyrights, or IP protection strategy..."
          rows={3}
          colWidth={12}
        />

        {/* Analytics & Measurement */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-bar-chart me-2"></i>
            Analytics & Measurement
          </h6>
        </div>

        <DynamicField
          type="array"
          name="analytics_tools"
          label="Analytics & Monitoring Tools"
          value={formData.analytics_tools}
          // onChange={handleChange}
          error={errors.analytics_tools}
          placeholder="Google Analytics, Mixpanel, Amplitude, Hotjar, Custom dashboards..."
          colWidth={12}
        />

        {/* Additional Strategic Fields */}
        <DynamicField
          type="array"
          name="key_partnerships"
          label="Strategic Partnerships"
          value={formData.key_partnerships}
          // onChange={handleChange}
          error={errors.key_partnerships}
          placeholder="Industry partners, technology providers, distribution partners..."
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="competitive_advantage"
          label="Competitive Advantage"
          value={formData.competitive_advantage}
          // onChange={handleChange}
          error={errors.competitive_advantage}
          placeholder="What makes your strategy unique and difficult to replicate?"
          rows={3}
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="risk_assessment"
          label="Risk Assessment & Mitigation"
          value={formData.risk_assessment}
          // onChange={handleChange}
          error={errors.risk_assessment}
          placeholder="Identify potential risks and your strategies to mitigate them..."
          rows={3}
          colWidth={12}
        />
      </div>
    </div>
  </section>
);