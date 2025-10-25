import DynamicField from "./DynamicField.jsx";

export const BusinessModel = ({ formData, handleChange, errors }) => {
    <section className="form-section card mb-4">
      <div className="card-body">
        <h4 className="card-title mb-4">
          <i className="bi bi-graph-up me-2"></i>
          Business Model
        </h4>

        <div className="row g-3">
          <DynamicField
            type="checkbox-group"
            name="revenue_streams"
            value={formData.revenue_streams}
            onChange={handleChange}
            error={errors.revenue_streams}
            options={[
              { value: 'subscription', label: 'Subscription' },
              { value: 'license', label: 'License' },
              { value: 'ads', label: 'Advertising' },
              { value: 'partnerships', label: 'Partnerships' },
              { value: 'events', label: 'Events' },
              { value: 'donations', label: 'Donations' },
              { value: 'other', label: 'Other' }
            ]}
          />
        </div>
        <div className="row g-3">
          <DynamicField
            name="customer_segments"
            type="checkbox-group"
            value={formData.customer_segments}
            onChange={handleChange}
            error={errors.customer_segments}
            options={[
              { value: 'high', label: 'High Value Customers' },
              { value: 'medium', label: 'Medium Value Customers' },
              { value: 'low', label: 'Low Value Customers' }
            ]}
            />
        </div>
        <div className="row g-3">
          <DynamicField
            name="channels"
            type="checkbox-group"
            value={formData.channels}
            onChange={handleChange}
            error={errors.channels}
            options={[
              { value: 'social', label: 'Social Media' },
              { value: 'email', label: 'Email Marketing' },
              { value: 'ads', label: 'Advertising' }
            ]}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="value_propositions"
            type="textarea"
            rows={5}
            label="Value Propositions"
            colsWidth={12}
            value={formData.value_propositions}
            onChange={handleChange}
            error={errors.value_propositions}
          />
        </div>

          <DynamicField
          name="pricing_tiers"
          type="checkbox-group"
          label="Pricing Tiers"
          value={formData.pricing_tiers}
          onChange={handleChange}
          error={errors.pricing_tiers}
          options={[
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' },
            { value: 'pro', label: 'Pro' },
            { value: 'enterprise', label: 'Enterprise' }]}
          />
        </div>
        <div className="row g-3">
          <DynamicField
            name="partnerships"
            type="textarea"
            rows={5}
            label="Partnerships"
            colsWidth={12}
            value={formData.partnerships}
            onChange={handleChange}
            error={errors.partnerships}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="cost_structure"
            type="textarea"
            rows={5}
            label="Cost Structure"
            colsWidth={12}
            value={formData.cost_structure}
            onChange={handleChange}
            error={errors.cost_structure}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="customer_relationships"
            type="textarea"
            rows={5}
            label="Customer Relationships"
            colsWidth={12}
            value={formData.customer_relationships}
            onChange={handleChange}
            error={errors.customer_relationships}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="unfair_advantages"
            type="textarea"
            rows={5}
            label="Unfair Advantages"
            colsWidth={12}
            value={formData.unfair_advantages}
            onChange={handleChange}
            error={errors.unfair_advantages}
          />
        </div>

    </section>
};
