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
            name="revenueStreams"
            type="checkbox-group"
            value={formData.revenueStreams}
            onChange={handleChange}
            error={errors.revenueStreams}
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
            name="customerSegments"
            type="checkbox-group"
            value={formData.customerSegments}
            onChange={handleChange}
            error={errors.customerSegments}
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
            name="valuePropositions"
            type="textarea"
            rows={5}
            label="Value Propositions"
            colsWidth={12}
            value={formData.valuePropositions}
            onChange={handleChange}
            error={errors.valuePropositions}
          />
        </div>

          <DynamicField
          name="pricingTiers"
          type="checkbox-group"
          label="Pricing Tiers"
          value={formData.pricingTiers}
          onChange={handleChange}
          error={errors.pricingTiers}
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
            name="costStructure"
            type="textarea"
            rows={5}
            label="Cost Structure"
            colsWidth={12}
            value={formData.costStructure}
            onChange={handleChange}
            error={errors.costStructure}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="customerRelationships"
            type="textarea"
            rows={5}
            label="Customer Relationships"
            colsWidth={12}
            value={formData.customerRelationships}
            onChange={handleChange}
            error={errors.customerRelationships}
          />
        </div>

        <div className="row g-3">
          <DynamicField
            name="unfairAdvantages"
            type="textarea"
            rows={5}
            label="Unfair Advantages"
            colsWidth={12}
            value={formData.unfairAdvantages}
            onChange={handleChange}
            error={errors.unfairAdvantages}
          />
        </div>

    </section>
};
