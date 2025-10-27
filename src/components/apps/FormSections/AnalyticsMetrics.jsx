import DynamicField from "./DynamicField.jsx";

export const AnalyticsMetrics = ({ formData, handleChange, errors }) => (
    <section className="form-section card mb-4">
        <div className="card-body">
            <h4 className="card-title mb-4">
                <i className="bi bi-bar-chart me-2"></i>
                Analytics & Metrics
            </h4>
            <div className="row g-3">
                <DynamicField
                    name="active_users"
                    label="Active Users"
                    onChange={handleChange}
                    value={formData.active_users}
                    error={errors.active_users}
                    type="numeric"
                />
                <DynamicField
                    name="user_retention_rate"
                    label="User Retention Rate"
                    onChange={handleChange}
                    value={formData.user_retention_rate}
                    error={errors.user_retention_rate}
                    type="numeric"
                />
                <DynamicField
                    name="user_acquisition_cost"
                    label="User Acquisition Cost"
                    onChange={handleChange}
                    value={formData.user_acquisition_cost}
                    error={errors.user_acquisition_cost}
                    type="numeric"
                />
                <DynamicField
                    name="churn_rate"
                    label="Churn Rate"
                    onChange={handleChange}
                    value={formData.churn_rate}
                    error={errors.churn_rate}
                    type="numeric"
                />
                <DynamicField
                    name="monthly_recurring_revenue"
                    label="Monthly Recurring Revenue"
                    onChange={handleChange}
                    value={formData.monthly_recurring_revenue}
                    error={errors.monthly_recurring_revenue}
                    type="numeric"
                />

                <DynamicField
                    name="user_feedback"
                    label="User Feedback Score"
                    onChange={handleChange}
                    value={formData.user_feedback}
                    error={errors.user_feedback}
                    type="numeric"
                />
                <DynamicField
                    name="key_metrics"
                    label="Key Metrics"
                    onChange={handleChange}
                    value={formData.key_metrics}
                    error={errors.key_metrics}
                    type="numeric"
                />
            </div>
        </div>
    </section>
);
