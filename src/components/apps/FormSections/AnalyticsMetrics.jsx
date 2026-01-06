import DynamicField from "../../DynamicField.jsx";

export const AnalyticsMetrics = ({ formData, handleChange, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-bar-chart text-primary me-2"></i>
        Analytics & Metrics
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Track performance indicators, user engagement, and business growth metrics
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* User Engagement Metrics */}
        <div className="col-12">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-people me-2"></i>
            User Engagement
          </h6>
        </div>

        <DynamicField
          type="number"
          name="active_users"
          label="Active Users"
          // onChange={handleChange}
          value={formData.active_users}
          error={errors.active_users}
          placeholder="Enter total number of active users"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="user_retention_rate"
          label="User Retention Rate (%)"
          // onChange={handleChange}
          value={formData.user_retention_rate}
          error={errors.user_retention_rate}
          placeholder="0-100"
          min="0"
          max="100"
          step="0.1"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="churn_rate"
          label="Churn Rate (%)"
          // onChange={handleChange}
          value={formData.churn_rate}
          error={errors.churn_rate}
          placeholder="0-100"
          min="0"
          max="100"
          step="0.1"
          colWidth={6}
        />

        <DynamicField
          type="array"
          name="user_feedback"
          label="User Feedback"
          // onChange={handleChange}
          value={formData.user_feedback}
          error={errors.user_feedback}
          placeholder="Positive reviews, Common complaints, Feature requests..."
          colWidth={6}
        />

        {/* Financial Metrics */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-currency-dollar me-2"></i>
            Financial Metrics
          </h6>
        </div>

        <DynamicField
          type="number"
          name="user_acquisition_cost"
          label="User Acquisition Cost ($)"
          // onChange={handleChange}
          value={formData.user_acquisition_cost}
          error={errors.user_acquisition_cost}
          placeholder="Average cost per user"
          min="0"
          step="0.01"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="monthly_recurring_revenue"
          label="Monthly Recurring Revenue ($)"
          // onChange={handleChange}
          value={formData.monthly_recurring_revenue}
          error={errors.monthly_recurring_revenue}
          placeholder="Total MRR"
          min="0"
          step="0.01"
          colWidth={6}
        />

        {/* Additional Metrics */}
        <div className="col-12 mt-4">
          <h6 className="border-bottom pb-2 mb-3 text-muted">
            <i className="bi bi-graph-up-arrow me-2"></i>
            Key Performance Indicators
          </h6>
        </div>

        <DynamicField
          type="array"
          name="key_metrics"
          label="Key Metrics Tracked"
          // onChange={handleChange}
          value={formData.key_metrics}
          error={errors.key_metrics}
          placeholder="Daily active users, Conversion rate, Customer lifetime value..."
          colWidth={12}
        />

        {/* Optional: Additional Analytics Fields */}
        <DynamicField
          type="number"
          name="conversion_rate"
          label="Conversion Rate (%)"
          // onChange={handleChange}
          value={formData.conversion_rate}
          error={errors.conversion_rate}
          placeholder="0-100"
          min="0"
          max="100"
          step="0.1"
          colWidth={6}
        />

        <DynamicField
          type="number"
          name="avg_session_duration"
          label="Average Session Duration (minutes)"
          // onChange={handleChange}
          value={formData.avg_session_duration}
          error={errors.avg_session_duration}
          placeholder="Average time per session"
          min="0"
          step="0.1"
          colWidth={6}
        />

        <DynamicField
          type="textarea"
          name="performance_insights"
          label="Performance Insights"
          // onChange={handleChange}
          value={formData.performance_insights}
          error={errors.performance_insights}
          placeholder="Key observations and trends from your analytics data..."
          rows={3}
          colWidth={12}
        />
      </div>
    </div>
  </section>
);
export default AnalyticsMetrics;