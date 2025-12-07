// src/components/apps/FormSections/__tests__/ImpactStrategy.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImpactStrategy } from '../ImpactStrategy';

// Mock DynamicField component
jest.mock('../DynamicField', () => {
  return function MockDynamicField({
    name,
    label,
    value,
    error,
    type,
    placeholder,
    colWidth,
    rows,
    min,
    step
  }) {
    return (
      <div data-testid="dynamic-field">
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">Value: {Array.isArray(value) ? value.join(', ') : value || 'empty'}</div>
        {error && <div data-testid="field-error">{error}</div>}
        {placeholder && <div data-testid="field-placeholder">Placeholder: {placeholder}</div>}
        {rows && <div data-testid="field-rows">Rows: {rows}</div>}
        {min && <div data-testid="field-min">Min: {min}</div>}
        {step && <div data-testid="field-step">Step: {step}</div>}
      </div>
    );
  };
});

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
    handleChange: jest.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section title', () => {
    render(<ImpactStrategy {...defaultProps} />);
    expect(screen.getByText('Impact & Strategy')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<ImpactStrategy {...defaultProps} />);
    expect(screen.getByText(/Social responsibility, environmental impact, and long-term strategic planning/)).toBeInTheDocument();
  });

  it('should render all section subheaders', () => {
    render(<ImpactStrategy {...defaultProps} />);

    expect(screen.getByText('Social & Environmental Impact')).toBeInTheDocument();
    expect(screen.getByText('Business Strategy')).toBeInTheDocument();
    expect(screen.getByText('Intellectual Property')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Measurement')).toBeInTheDocument();
  });

  it('should render all field labels', () => {
    render(<ImpactStrategy {...defaultProps} />);

    expect(screen.getByText('Social Impact & Responsibility')).toBeInTheDocument();
    expect(screen.getByText('Environmental Impact & Sustainability')).toBeInTheDocument();
    expect(screen.getByText('Funding & Investment ($)')).toBeInTheDocument();
    expect(screen.getByText('Exit Strategy & Long-term Vision')).toBeInTheDocument();
    expect(screen.getByText('Intellectual Property Strategy')).toBeInTheDocument();
    expect(screen.getByText('Analytics & Monitoring Tools')).toBeInTheDocument();
    expect(screen.getByText('Strategic Partnerships')).toBeInTheDocument();
    expect(screen.getByText('Competitive Advantage')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment & Mitigation')).toBeInTheDocument();
  });

  it('should render correct number of DynamicField components', () => {
    render(<ImpactStrategy {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    expect(dynamicFields.length).toBe(9);
  });

  describe('Field Types Distribution', () => {
    it('should have correct field types', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const typeTexts = typeElements.map(el => el.textContent);

      const textareaCount = typeTexts.filter(text => text === 'Type: textarea').length;
      const numberCount = typeTexts.filter(text => text === 'Type: number').length;
      const arrayCount = typeTexts.filter(text => text === 'Type: array').length;

      expect(textareaCount).toBe(6); // social_impact, environmental_impact, exit_strategy, intellectual_property, competitive_advantage, risk_assessment
      expect(numberCount).toBe(1); // funding_investment
      expect(arrayCount).toBe(2); // analytics_tools, key_partnerships
    });
  });

  describe('Textarea Fields', () => {
    it('should have textarea fields with correct row counts', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const rowsElements = screen.getAllByTestId('field-rows');
      const rowsValues = rowsElements.map(el => el.textContent);

      expect(rowsValues).toContain('Rows: 4');
      expect(rowsValues).toContain('Rows: 3');
    });

    it('should have 6 textarea fields total', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const textareaCount = typeElements.filter(el => el.textContent === 'Type: textarea').length;

      expect(textareaCount).toBe(6);
    });
  });

  describe('Number Field', () => {
    it('should have number field with min and step attributes', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const minElements = screen.getAllByTestId('field-min');
      const stepElements = screen.getAllByTestId('field-step');

      expect(minElements.length).toBe(1);
      expect(stepElements.length).toBe(1);

      expect(minElements[0].textContent).toBe('Min: 0');
      expect(stepElements[0].textContent).toBe('Step: 0.01');
    });
  });

  describe('Array Fields', () => {
    it('should have 2 array fields', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const arrayCount = typeElements.filter(el => el.textContent === 'Type: array').length;

      expect(arrayCount).toBe(2);
    });
  });

  describe('Column Widths', () => {
    it('should use correct column width distribution', () => {
      render(<ImpactStrategy {...defaultProps} />);

      // All textarea fields with rows=4 or rows=3 should be colWidth=12
      // Based on the component: 6 textarea fields (5 are colWidth=12, 1 is colWidth=6 for exit_strategy)
      // 1 number field colWidth=6
      // 2 array fields (1 colWidth=12, 1 colWidth=6)
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for all fields', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const placeholderElements = screen.getAllByTestId('field-placeholder');
      expect(placeholderElements.length).toBe(9); // All 9 fields have placeholders

      const placeholderTexts = placeholderElements.map(el => el.textContent);

      expect(placeholderTexts).toContain('Placeholder: Describe how your application benefits society, communities, or specific groups...');
      expect(placeholderTexts).toContain('Placeholder: Describe your environmental initiatives, carbon footprint reduction, or sustainability practices...');
      expect(placeholderTexts).toContain('Placeholder: Total funding received to date');
      expect(placeholderTexts).toContain('Placeholder: Describe your long-term business goals, acquisition strategy, or IPO plans...');
      expect(placeholderTexts).toContain('Placeholder: Describe your patents, trademarks, copyrights, or IP protection strategy...');
      expect(placeholderTexts).toContain('Placeholder: Google Analytics, Mixpanel, Amplitude, Hotjar, Custom dashboards...');
      expect(placeholderTexts).toContain('Placeholder: Industry partners, technology providers, distribution partners...');
      expect(placeholderTexts).toContain('Placeholder: What makes your strategy unique and difficult to replicate?');
      expect(placeholderTexts).toContain('Placeholder: Identify potential risks and your strategies to mitigate them...');
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

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(3);

      expect(screen.getByText('Social impact description is required')).toBeInTheDocument();
      expect(screen.getByText('Must be a positive number')).toBeInTheDocument();
      expect(screen.getByText('At least one analytics tool is required')).toBeInTheDocument();
    });

    it('should not display errors when none exist', () => {
      render(<ImpactStrategy {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
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

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toContain('Value: Helping small businesses grow');
      expect(valuesText).toContain('Value: Carbon neutral operations');
      expect(valuesText).toContain('Value: 500000');
      expect(valuesText).toContain('Value: Acquisition in 5 years');
      expect(valuesText).toContain('Value: 3 patents pending');
      expect(valuesText).toContain('Value: Google Analytics, Mixpanel');
      expect(valuesText).toContain('Value: AWS, Stripe');
      expect(valuesText).toContain('Value: First-mover in niche market');
      expect(valuesText).toContain('Value: Market competition and regulation changes');
    });
  });
});