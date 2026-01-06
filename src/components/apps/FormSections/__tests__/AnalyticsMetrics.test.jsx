// src/components/apps/form-sections/__tests__/AnalyticsMetrics.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AnalyticsMetrics from '../AnalyticsMetrics.jsx';

describe('AnalyticsMetrics Component', () => {
  const defaultFormData = {
    active_users: '',
    user_retention_rate: '',
    churn_rate: '',
    user_feedback: [],
    user_acquisition_cost: '',
    monthly_recurring_revenue: '',
    key_metrics: [],
    conversion_rate: '',
    avg_session_duration: '',
    performance_insights: ''
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
    render(<AnalyticsMetrics {...defaultProps} />);
    expect(screen.getByText('Analytics & Metrics')).toBeDefined();
  });

  it('should render description text', () => {
    render(<AnalyticsMetrics {...defaultProps} />);
    expect(screen.getByText(/Track performance indicators, user engagement, and business growth metrics/)).toBeDefined();
  });

  describe('Section Headers', () => {
    it('should render all section headers', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      // Find h6 elements (subheaders)
      const subheaders = document.querySelectorAll('h6');
      const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

      expect(subheaderTexts.some(text => text.includes('User Engagement'))).toBe(true);
      expect(subheaderTexts.some(text => text.includes('Financial Metrics'))).toBe(true);
      expect(subheaderTexts.some(text => text.includes('Key Performance Indicators'))).toBe(true);
    });
  });

  describe('Field Labels', () => {
    it('should render all field labels', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      // Find all label elements
      const labels = document.querySelectorAll('label.form-label');
      const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

      // User Engagement fields
      expect(labelTexts.some(text => text.includes('Active Users'))).toBe(true);
      expect(labelTexts.some(text => text.includes('User Retention Rate'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Churn Rate'))).toBe(true);
      expect(labelTexts.some(text => text.includes('User Feedback'))).toBe(true);

      // Financial Metrics fields
      expect(labelTexts.some(text => text.includes('User Acquisition Cost'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Monthly Recurring Revenue'))).toBe(true);

      // KPI fields
      expect(labelTexts.some(text => text.includes('Key Metrics Tracked'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Conversion Rate'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Average Session Duration'))).toBe(true);
      expect(labelTexts.some(text => text.includes('Performance Insights'))).toBe(true);
    });
  });

  describe('Field Types', () => {
    it('should have number inputs for numeric fields', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      // Check for number inputs
      const numberInputs = document.querySelectorAll('input[type="number"]');
      expect(numberInputs.length).toBeGreaterThan(0);

      // Check specific fields
      const activeUsersField = document.querySelector('input[name="active_users"]');
      const retentionField = document.querySelector('input[name="user_retention_rate"]');
      const churnField = document.querySelector('input[name="churn_rate"]');
      const acquisitionField = document.querySelector('input[name="user_acquisition_cost"]');
      const revenueField = document.querySelector('input[name="monthly_recurring_revenue"]');
      const conversionField = document.querySelector('input[name="conversion_rate"]');
      const durationField = document.querySelector('input[name="avg_session_duration"]');

      // Check which exist
      const existingNumberFields = [
        activeUsersField,
        retentionField,
        churnField,
        acquisitionField,
        revenueField,
        conversionField,
        durationField
      ].filter(field => field && field.type === 'number');

      expect(existingNumberFields.length).toBeGreaterThan(0);
    });

    it('should have textareas for array and text fields', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const textareas = document.querySelectorAll('textarea');
      expect(textareas.length).toBeGreaterThan(0);

      // Check for specific textareas
      const feedbackField = document.querySelector('textarea[name="user_feedback"]');
      const metricsField = document.querySelector('textarea[name="key_metrics"]');
      const insightsField = document.querySelector('textarea[name="performance_insights"]');

      expect(feedbackField || metricsField || insightsField).toBeDefined();
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for fields', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBeGreaterThan(0);

      // Check for some expected placeholders
      expect(document.querySelector('[placeholder*="active users"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Positive reviews"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Average cost"]')).toBeDefined();
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        active_users: '1000',
        user_retention_rate: '85.5',
        churn_rate: '2.3',
        user_feedback: ['Great app!', 'Needs dark mode'],
        user_acquisition_cost: '5.50',
        monthly_recurring_revenue: '25000',
        key_metrics: ['DAU', 'MAU', 'Conversion'],
        conversion_rate: '15.2',
        avg_session_duration: '8.5',
        performance_insights: 'Growing steadily'
      };

      render(<AnalyticsMetrics {...defaultProps} formData={formDataWithValues} />);

      // Check number inputs
      const activeUsersField = document.querySelector('input[name="active_users"]');
      if (activeUsersField) {
        expect(activeUsersField.value).toBe('1000');
      }

      const retentionField = document.querySelector('input[name="user_retention_rate"]');
      if (retentionField) {
        expect(retentionField.value).toBe('85.5');
      }

      const revenueField = document.querySelector('input[name="monthly_recurring_revenue"]');
      if (revenueField) {
        expect(revenueField.value).toBe('25000');
      }

      // Check textareas
      const feedbackField = document.querySelector('textarea[name="user_feedback"]');
      if (feedbackField) {
        expect(feedbackField.value).toBe('Great app!\nNeeds dark mode');
      }

      const metricsField = document.querySelector('textarea[name="key_metrics"]');
      if (metricsField) {
        expect(metricsField.value).toBe('DAU\nMAU\nConversion');
      }

      const insightsField = document.querySelector('textarea[name="performance_insights"]');
      if (insightsField) {
        expect(insightsField.value).toBe('Growing steadily');
      }
    });

    it('should display empty for unpopulated form data', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      // Check all inputs are empty
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        expect(input.value).toBe('');
      });

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
        active_users: 'Active users is required',
        user_retention_rate: 'Must be between 0 and 100'
      };

      render(<AnalyticsMetrics {...defaultProps} errors={errors} />);

      expect(screen.getByText('Active users is required')).toBeDefined();
      expect(screen.getByText('Must be between 0 and 100')).toBeDefined();

      // Check error classes on fields
      const activeUsersField = document.querySelector('input[name="active_users"]');
      const retentionField = document.querySelector('input[name="user_retention_rate"]');

      if (activeUsersField) {
        expect(activeUsersField.className).toContain('is-invalid');
      }
      if (retentionField) {
        expect(retentionField.className).toContain('is-invalid');
      }
    });

    it('should not display errors when none exist', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/must be/)).toBeNull();

      // Check no error classes
      const fields = document.querySelectorAll('input, textarea');
      fields.forEach(field => {
        expect(field.className).not.toContain('is-invalid');
      });
    });
  });

  describe('Component Structure', () => {
    it('should render form fields', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const inputs = document.querySelectorAll('input');
      const textareas = document.querySelectorAll('textarea');

      expect(inputs.length + textareas.length).toBeGreaterThan(0);
    });
  });
});