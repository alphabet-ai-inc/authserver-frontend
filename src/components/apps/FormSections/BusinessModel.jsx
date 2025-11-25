import DynamicField from "./DynamicField.jsx";
import { CUSTOMER_SEGMENTS } from "../../../config/selectOptions.js";

export const BusinessModel = ({ formData, handleChange, errors }) => (
  <section className="form-section card mb-4 border-0 shadow-sm">
    <div className="card-header bg-light border-0">
      <h4 className="card-title mb-0">
        <i className="bi bi-graph-up text-primary me-2"></i>
        Business Model
      </h4>
      <p className="text-muted mb-0 mt-1 small">
        Define your business strategy, revenue streams, and customer approach
      </p>
    </div>

    <div className="card-body">
      <div className="row g-4">
        {/* Revenue Streams - Using the new array type */}
        <DynamicField
          type="array"
          name="revenue_streams"
          label="Revenue Streams"
          value={formData.revenue_streams}
          error={errors.revenue_streams}
          placeholder="Subscription, License, Advertising, Partnerships..."
          colWidth={12}
        />

        {/* Customer Segments - Enhanced checkbox group */}
        <DynamicField
          type="select"
          name="customer_segments"
          label="Customer Segments"
          value={formData.customer_segments}
          error={errors.customer_segments}
          options={ CUSTOMER_SEGMENTS}
          multiple={true}
          required={false}
          colWidth={12}
          placeholder="Select one or more customer segments"
        />

        {/* Channels - Enhanced checkbox group */}
        <DynamicField
          type="checkbox-group"
          name="channels"
          label="Distribution Channels"
          value={formData.channels}
          error={errors.channels}
          options={[
            { value: 'social', label: 'Social Media' },
            { value: 'email', label: 'Email Marketing' },
            { value: 'ads', label: 'Digital Advertising' },
            { value: 'partners', label: 'Partner Networks' },
            { value: 'direct', label: 'Direct Sales' }
          ]}
          colWidth={12}
        />

        {/* Value Propositions */}
        <DynamicField
          type="textarea"
          name="value_propositions"
          label="Value Propositions"
          value={formData.value_propositions}
          error={errors.value_propositions}
          placeholder="Describe the unique value your application provides to customers..."
          colWidth={12}
        />

        {/* Pricing Tiers - Enhanced checkbox group */}
        <DynamicField
          type="checkbox-group"
          name="pricing_tiers"
          label="Pricing Tiers"
          value={formData.pricing_tiers}
          error={errors.pricing_tiers}
          options={[
            { value: 'free', label: 'Free Tier' },
            { value: 'basic', label: 'Basic' },
            { value: 'standard', label: 'Standard' },
            { value: 'pro', label: 'Professional' },
            { value: 'enterprise', label: 'Enterprise' }
          ]}
          colWidth={12}
        />

        {/* Partnerships - Using the new array type */}
        <DynamicField
          type="array"
          name="partnerships"
          label="Strategic Partnerships"
          value={formData.partnerships}
          error={errors.partnerships}
          placeholder="Partner A, Partner B, Partner C..."
          colWidth={12}
        />

        {/* Cost Structure - Using the new array type */}
        <DynamicField
          type="array"
          name="cost_structure"
          label="Cost Structure"
          value={formData.cost_structure}
          error={errors.cost_structure}
          placeholder="Development, Marketing, Infrastructure, Support..."
          colWidth={12}
        />

        {/* Customer Relationships - Using the new array type */}
        <DynamicField
          type="array"
          name="customer_relationships"
          label="Customer Relationships"
          value={formData.customer_relationships}
          error={errors.customer_relationships}
          placeholder="Self-service, Personal assistance, Automated support..."
          colWidth={12}
        />

        {/* Unfair Advantages */}
        <DynamicField
          type="textarea"
          name="unfair_advantages"
          label="Unfair Advantages & Competitive Edge"
          value={formData.unfair_advantages}
          error={errors.unfair_advantages}
          placeholder="Describe what makes your business model difficult to copy or compete with..."
          colWidth={12}
        />
      </div>
    </div>
  </section>
);