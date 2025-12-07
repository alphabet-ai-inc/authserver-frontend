// src/components/apps/form-sections/__tests__/AnalyticsMetrics.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { AnalyticsMetrics } from '../AnalyticsMetrics';

// Mock DynamicField component
jest.mock('../DynamicField', () => {
  return function MockDynamicField({ name, label, value, error, type, placeholder, colWidth }) {
    return (
      <div data-testid="dynamic-field" data-fieldname={name} data-colwidth={colWidth}>
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">Value: {Array.isArray(value) ? value.join(', ') : value || 'empty'}</div>
        {error && <div data-testid="field-error" className="error">{error}</div>}
        <div data-testid="field-placeholder">Placeholder: {placeholder}</div>
      </div>
    );
  };
});

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
    handleChange: jest.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<AnalyticsMetrics {...defaultProps} />);
    expect(screen.getByText('Analytics & Metrics')).toBeInTheDocument();
  });

  it('should render all section headers', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText('Analytics & Metrics')).toBeInTheDocument();
    expect(screen.getByText('User Engagement')).toBeInTheDocument();
    expect(screen.getByText('Financial Metrics')).toBeInTheDocument();
    expect(screen.getByText('Key Performance Indicators')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<AnalyticsMetrics {...defaultProps} />);

    expect(screen.getByText(/Track performance indicators, user engagement, and business growth metrics/)).toBeInTheDocument();
  });

  describe('User Engagement Fields', () => {
    it('should render active users field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('Active Users')).toBeInTheDocument();
    });

    it('should render user retention rate field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('User Retention Rate (%)')).toBeInTheDocument();
    });

    it('should render churn rate field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('Churn Rate (%)')).toBeInTheDocument();
    });

    it('should render user feedback field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('User Feedback')).toBeInTheDocument();
    });
  });

  describe('Financial Metrics Fields', () => {
    it('should render user acquisition cost field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('User Acquisition Cost ($)')).toBeInTheDocument();
    });

    it('should render monthly recurring revenue field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('Monthly Recurring Revenue ($)')).toBeInTheDocument();
    });
  });

  describe('Key Performance Indicators Fields', () => {
    it('should render key metrics field', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('Key Metrics Tracked')).toBeInTheDocument();
    });

    it('should render optional fields', () => {
      render(<AnalyticsMetrics {...defaultProps} />);
      expect(screen.getByText('Conversion Rate (%)')).toBeInTheDocument();
      expect(screen.getByText('Average Session Duration (minutes)')).toBeInTheDocument();
      expect(screen.getByText('Performance Insights')).toBeInTheDocument();
    });
  });

  describe('Data Display', () => {
    it('should display form data values', () => {
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

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toEqual(
        expect.arrayContaining([
          expect.stringContaining('1000'),
          expect.stringContaining('85.5'),
          expect.stringContaining('2.3'),
          expect.stringContaining('Great app!, Needs dark mode'),
          expect.stringContaining('5.50'),
          expect.stringContaining('25000'),
          expect.stringContaining('DAU, MAU, Conversion'),
          expect.stringContaining('15.2'),
          expect.stringContaining('8.5'),
          expect.stringContaining('Growing steadily')
        ])
      );
    });
  });

  describe('Error Display', () => {
    it('should display error messages when errors exist', () => {
      const errors = {
        active_users: 'Active users is required',
        user_retention_rate: 'Must be between 0 and 100'
      };

      render(<AnalyticsMetrics {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(2);

      const errorTexts = errorElements.map(el => el.textContent);
      expect(errorTexts).toContain('Active users is required');
      expect(errorTexts).toContain('Must be between 0 and 100');
    });

    it('should not display errors when none exist', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
    });
  });

  describe('Component Structure', () => {
    it('should render correct number of DynamicField components', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const dynamicFields = screen.getAllByTestId('dynamic-field');
      // Count all fields from the component: 10 fields total
      expect(dynamicFields.length).toBe(10);
    });

    it('should pass correct field types to DynamicField', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const typeTexts = typeElements.map(el => el.textContent);

      // Check for expected types
      expect(typeTexts.filter(text => text === 'Type: number').length).toBeGreaterThan(0);
      expect(typeTexts.filter(text => text === 'Type: array').length).toBeGreaterThan(0);
      expect(typeTexts.filter(text => text === 'Type: textarea').length).toBe(1);
    });
  });

  describe('Placeholder Text', () => {
    it('should have correct placeholder texts', () => {
      render(<AnalyticsMetrics {...defaultProps} />);

      const placeholderElements = screen.getAllByTestId('field-placeholder');
      const placeholderTexts = placeholderElements.map(el => el.textContent);

      expect(placeholderTexts).toEqual(
        expect.arrayContaining([
          'Placeholder: Enter total number of active users',
          'Placeholder: 0-100',
          'Placeholder: Positive reviews, Common complaints, Feature requests...',
          'Placeholder: Average cost per user',
          'Placeholder: Total MRR',
          'Placeholder: Daily active users, Conversion rate, Customer lifetime value...',
          'Placeholder: Key observations and trends from your analytics data...'
        ])
      );
    });
  });
});