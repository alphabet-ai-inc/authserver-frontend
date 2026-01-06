// src/components/apps/FormSections/__tests__/ImpactStrategy.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ImpactStrategy from '../ImpactStrategy.jsx'; // Make sure to import the actual component

describe('ImpactStrategy Component', () => {
  const defaultFormData = {
    social_impact: '',
    environmental_impact: '',
    funding_investment: '',
    exit_strategy: '',
    intellectual_property: '',
    analytics_tools: [],
    key_partnerships: [],
    competitive_advantage: '',
    risk_assessment: ''
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
    render(<ImpactStrategy {...defaultProps} />);
    expect(screen.getByText('Impact & Strategy')).toBeDefined();
  });

  it('should render section description', () => {
    render(<ImpactStrategy {...defaultProps} />);
    expect(screen.getByText(/Social responsibility, environmental impact, and long-term strategic planning/)).toBeDefined();
  });

  it('should render all section subheaders', () => {
    render(<ImpactStrategy {...defaultProps} />);

    // Find h6 elements which are the subheaders
    const subheaders = document.querySelectorAll('h6');
    const subheaderTexts = Array.from(subheaders).map(h => h.textContent);

    expect(subheaderTexts).toContain('Social & Environmental Impact');
    expect(subheaderTexts).toContain('Business Strategy');
    expect(subheaderTexts).toContain('Intellectual Property');
    expect(subheaderTexts).toContain('Analytics & Measurement');
  });

  it('should render all field labels', () => {
    render(<ImpactStrategy {...defaultProps} />);

    // Find all label elements
    const labels = document.querySelectorAll('label.form-label');
    const labelTexts = Array.from(labels).map(label => label.textContent?.trim());

    expect(labelTexts).toContain('Social Impact & Responsibility');
    expect(labelTexts).toContain('Environmental Impact & Sustainability');
    expect(labelTexts).toContain('Funding & Investment ($)');
    expect(labelTexts).toContain('Exit Strategy & Long-term Vision');
    expect(labelTexts).toContain('Intellectual Property Strategy');
    expect(labelTexts).toContain('Analytics & Monitoring Tools');
    expect(labelTexts).toContain('Strategic Partnerships');
    expect(labelTexts).toContain('Competitive Advantage');
    expect(labelTexts).toContain('Risk Assessment & Mitigation');
  });

  it('should render correct number of form fields', () => {
    render(<ImpactStrategy {...defaultProps} />);

    // Count all textareas and inputs
    const textareas = document.querySelectorAll('textarea');
    const numberInput = document.querySelectorAll('input[type="number"]');

    expect(textareas.length + numberInput.length).toBe(9); // 8 textareas + 1 number input
  });

  describe('Field Types', () => {
    it('should have textareas for text fields', () => {
      render(<ImpactStrategy {...defaultProps} />);

      // Check that these fields are textareas
      expect(document.querySelector('textarea[name="social_impact"]')).toBeDefined();
      expect(document.querySelector('textarea[name="environmental_impact"]')).toBeDefined();
      expect(document.querySelector('textarea[name="exit_strategy"]')).toBeDefined();
      expect(document.querySelector('textarea[name="intellectual_property"]')).toBeDefined();
      expect(document.querySelector('textarea[name="competitive_advantage"]')).toBeDefined();
      expect(document.querySelector('textarea[name="risk_assessment"]')).toBeDefined();
      expect(document.querySelector('textarea[name="analytics_tools"]')).toBeDefined();
      expect(document.querySelector('textarea[name="key_partnerships"]')).toBeDefined();
    });

    it('should have number input for funding field', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const fundingField = document.querySelector('input[name="funding_investment"]');
      expect(fundingField).toBeDefined();
      expect(fundingField.type).toBe('number');
      expect(fundingField.getAttribute('min')).toBe('0');
      expect(fundingField.getAttribute('step')).toBe('any');
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for all fields', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const fieldsWithPlaceholders = document.querySelectorAll('[placeholder]');
      expect(fieldsWithPlaceholders.length).toBe(9);
    });

    it('should have appropriate placeholder content', () => {
      render(<ImpactStrategy {...defaultProps} />);

      // Check placeholders using query selectors
      expect(document.querySelector('[placeholder*="Describe how your application benefits society"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your environmental initiatives"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Total funding received to date"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your long-term business goals"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Describe your patents, trademarks"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Google Analytics, Mixpanel"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Industry partners, technology providers"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="What makes your strategy unique"]')).toBeDefined();
      expect(document.querySelector('[placeholder*="Identify potential risks"]')).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        social_impact: 'Social impact description is required',
        funding_investment: 'Must be a positive number',
        analytics_tools: 'At least one analytics tool is required'
      };

      render(<ImpactStrategy {...defaultProps} errors={errors} />);

      // Check that error messages are displayed
      expect(screen.getByText('Social impact description is required')).toBeDefined();
      expect(screen.getByText('Must be a positive number')).toBeDefined();
      expect(screen.getByText('At least one analytics tool is required')).toBeDefined();

      // Check that fields have error classes
      const socialImpactField = document.querySelector('textarea[name="social_impact"]');
      expect(socialImpactField.className).toContain('is-invalid');

      const fundingField = document.querySelector('input[name="funding_investment"]');
      expect(fundingField.className).toContain('is-invalid');

      const analyticsField = document.querySelector('textarea[name="analytics_tools"]');
      expect(analyticsField.className).toContain('is-invalid');
    });

    it('should not display errors when none exist', () => {
      render(<ImpactStrategy {...defaultProps} />);

      // Should not have error messages
      expect(screen.queryByText(/is required/)).toBeNull();
      expect(screen.queryByText(/cannot be empty/)).toBeNull();

      // Should not have error classes
      const fields = document.querySelectorAll('textarea, input');
      fields.forEach(field => {
        expect(field.className).not.toContain('is-invalid');
      });
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        social_impact: 'Helping small businesses grow',
        environmental_impact: 'Carbon neutral operations',
        funding_investment: '500000',
        exit_strategy: 'Acquisition in 5 years',
        intellectual_property: '3 patents pending',
        analytics_tools: ['Google Analytics', 'Mixpanel'],
        key_partnerships: ['AWS', 'Stripe'],
        competitive_advantage: 'First-mover in niche market',
        risk_assessment: 'Market competition and regulation changes'
      };

      render(<ImpactStrategy {...defaultProps} formData={formDataWithValues} />);

      // Check that values are displayed
      const socialImpactField = document.querySelector('textarea[name="social_impact"]');
      expect(socialImpactField.value).toBe('Helping small businesses grow');

      const environmentalField = document.querySelector('textarea[name="environmental_impact"]');
      expect(environmentalField.value).toBe('Carbon neutral operations');

      const fundingField = document.querySelector('input[name="funding_investment"]');
      expect(fundingField.value).toBe('500000');

      const exitStrategyField = document.querySelector('textarea[name="exit_strategy"]');
      expect(exitStrategyField.value).toBe('Acquisition in 5 years');

      const ipField = document.querySelector('textarea[name="intellectual_property"]');
      expect(ipField.value).toBe('3 patents pending');

      const analyticsField = document.querySelector('textarea[name="analytics_tools"]');
      expect(analyticsField.value).toBe('Google Analytics\nMixpanel');

      const partnershipsField = document.querySelector('textarea[name="key_partnerships"]');
      expect(partnershipsField.value).toBe('AWS\nStripe');

      const advantageField = document.querySelector('textarea[name="competitive_advantage"]');
      expect(advantageField.value).toBe('First-mover in niche market');

      const riskField = document.querySelector('textarea[name="risk_assessment"]');
      expect(riskField.value).toBe('Market competition and regulation changes');
    });
  });
});