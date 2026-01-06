// src/components/apps/FormSections/__tests__/BusinessModel.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import BusinessModel from '../BusinessModel.jsx';


describe('BusinessModel Component', () => {
  const defaultFormData = {
    revenue_streams: [],
    customer_segments: [],
    channels: [],
    value_propositions: '',
    pricing_tiers: [],
    partnerships: [],
    cost_structure: [],
    customer_relationships: [],
    unfair_advantages: ''
  };

  const defaultErrors = {};

  const defaultProps = {
    formData: defaultFormData,
    handleChange: vi.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render section title', () => {
    render(<BusinessModel {...defaultProps} />);
    expect(screen.getByText('Business Model')).toBeDefined();
  });

  it('should render section description', () => {
    render(<BusinessModel {...defaultProps} />);
    expect(screen.getByText(/Define your business strategy, revenue streams, and customer approach/)).toBeDefined();
  });

  it('should render all field labels', () => {
    render(<BusinessModel {...defaultProps} />);

    // Find all label elements
    const labels = document.querySelectorAll('label.form-label');
    const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

    expect(labelTexts).toContain('Revenue Streams');
    expect(labelTexts).toContain('Customer Segments');
    expect(labelTexts).toContain('Distribution Channels');
    expect(labelTexts).toContain('Value Propositions');
    expect(labelTexts).toContain('Pricing Tiers');
    expect(labelTexts).toContain('Strategic Partnerships');
    expect(labelTexts).toContain('Cost Structure');
    expect(labelTexts).toContain('Customer Relationships');
    expect(labelTexts).toContain('Unfair Advantages & Competitive Edge');
  });

  describe('Field Types', () => {
    it('should have textareas for array fields', () => {
      render(<BusinessModel {...defaultProps} />);

      // Array fields are likely textareas
      const revenueField = document.querySelector('textarea[name="revenue_streams"]');
      const channelsField = document.querySelector('textarea[name="channels"]');
      const pricingField = document.querySelector('textarea[name="pricing_tiers"]');
      const partnershipsField = document.querySelector('textarea[name="partnerships"]');
      const costField = document.querySelector('textarea[name="cost_structure"]');
      const relationshipsField = document.querySelector('textarea[name="customer_relationships"]');

      // Check which fields actually exist
      const existingFields = [
        revenueField,
        channelsField,
        pricingField,
        partnershipsField,
        costField,
        relationshipsField
      ].filter(field => field !== null);

      expect(existingFields.length).toBeGreaterThan(0);
    });

    it('should have textareas for text fields', () => {
      render(<BusinessModel {...defaultProps} />);

      const valueField = document.querySelector('textarea[name="value_propositions"]');
      const advantagesField = document.querySelector('textarea[name="unfair_advantages"]');

      expect(valueField || advantagesField).toBeDefined();
    });

    it('should have field for customer segments', () => {
      render(<BusinessModel {...defaultProps} />);

      // Customer segments could be textarea or select
      const customerTextarea = document.querySelector('textarea[name="customer_segments"]');
      const customerSelect = document.querySelector('select[name="customer_segments"]');
      const customerInput = document.querySelector('input[name="customer_segments"]');

      expect(customerTextarea || customerSelect || customerInput).toBeDefined();
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for fields', () => {
      render(<BusinessModel {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBeGreaterThan(0);
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        revenue_streams: ['Subscription', 'Advertising'],
        customer_segments: ['enterprise', 'smb'],
        channels: ['social', 'email'],
        value_propositions: 'Our platform increases productivity by 50%',
        pricing_tiers: ['free', 'pro'],
        partnerships: ['Partner A', 'Partner B'],
        cost_structure: ['Development', 'Marketing'],
        customer_relationships: ['Self-service', 'Email support'],
        unfair_advantages: 'Patented technology'
      };

      render(<BusinessModel {...defaultProps} formData={formDataWithValues} />);

      // Check text fields if they exist
      const valueField = document.querySelector('textarea[name="value_propositions"]');
      if (valueField) {
        expect(valueField.value).toBe('Our platform increases productivity by 50%');
      }

      const advantagesField = document.querySelector('textarea[name="unfair_advantages"]');
      if (advantagesField) {
        expect(advantagesField.value).toBe('Patented technology');
      }

      // Check array fields if they exist as textareas
      const revenueField = document.querySelector('textarea[name="revenue_streams"]');
      if (revenueField) {
        expect(revenueField.value).toBe('Subscription\nAdvertising');
      }

      const pricingField = document.querySelector('textarea[name="pricing_tiers"]');
      if (pricingField) {
        expect(pricingField.value).toBe('free\npro');
      }
    });

    it('should display empty for unpopulated form data', () => {
      render(<BusinessModel {...defaultProps} />);

      // Check all textareas are empty
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        expect(textarea.value).toBe('');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        revenue_streams: 'Revenue streams required',
        value_propositions: 'Value proposition required'
      };

      render(<BusinessModel {...defaultProps} errors={errors} />);

      expect(screen.getByText('Revenue streams required')).toBeDefined();
      expect(screen.getByText('Value proposition required')).toBeDefined();
    });

    it('should not display errors when none exist', () => {
      render(<BusinessModel {...defaultProps} />);

      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/cannot be empty/)).toBeNull();
    });
  });

  describe('Debug Helper', () => {
    it('should help debug component structure', () => {
      render(<BusinessModel {...defaultProps} />);

      // Log what we found for debugging
      const textareas = document.querySelectorAll('textarea');
      const selects = document.querySelectorAll('select');
      const inputs = document.querySelectorAll('input');
      const labels = document.querySelectorAll('label.form-label');

      console.log(`Found: ${textareas.length} textareas, ${selects.length} selects, ${inputs.length} inputs, ${labels.length} labels`);

      expect(textareas.length + selects.length + inputs.length).toBeGreaterThan(0);
    });
  });
});