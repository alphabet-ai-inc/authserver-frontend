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
                    name="activeUsers"
                    label="Active Users"
                    onChange={handleChange}
                    value={formData.activeUsers}
                    error={errors.activeUsers}
                    type="numeric"
                />
                <DynamicField
                    name="userRetentionRate"
                    label="User Retention Rate"
                    onChange={handleChange}
                    value={formData.userRetentionRate}
                    error={errors.userRetentionRate}
                    type="numeric"
                />
                <DynamicField
                    name="userAcquisitionCost"
                    label="User Acquisition Cost"
                    onChange={handleChange}
                    value={formData.userAcquisitionCost}
                    error={errors.userAcquisitionCost}
                    type="numeric"
                />
                <DynamicField
                    name="churnRate"
                    label="Churn Rate"
                    onChange={handleChange}
                    value={formData.churnRate}
                    error={errors.churnRate}
                    type="numeric"
                />
                <DynamicField
                    name="monthlyRecurringRevenue"
                    label="Monthly Recurring Revenue"
                    onChange={handleChange}
                    value={formData.monthlyRecurringRevenue}
                    error={errors.monthlyRecurringRevenue}
                    type="numeric"
                />
                <DynamicField
                    name="pageviews"
                    label="Page Views"
                    onChange={handleChange}
                    value={formData.pageviews}
                    error={errors.pageviews}
                    type="numeric"
                />
                <DynamicField
                    name="userFeedback"
                    label="User Feedback Score"
                    onChange={handleChange}
                    value={formData.userFeedback}
                    error={errors.userFeedback}
                    type="numeric"
                />
                <DynamicField
                    name="keyMetrics"
                    label="Key Metrics"
                    onChange={handleChange}
                    value={formData.keyMetrics}
                    error={errors.keyMetrics}
                    type="numeric"
                />
            </div>
        </div>
    </section>
);
