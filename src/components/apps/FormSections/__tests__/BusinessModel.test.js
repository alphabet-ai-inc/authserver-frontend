// src/components/apps/FormSections/__tests__/BusinessModel.test.js
import { render, screen } from '@testing-library/react';
import { BusinessModel } from '../BusinessModel';

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
    options,
    multiple,
    required
  }) {
    return (

      <div data-testid="dynamic-field" data-fieldname={name} data-colwidth={colWidth}>
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">
          Value: {
            (() => {
              if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : 'empty';
              }
              return value || 'empty';
            })()
          }
        </div>
        {error && <div data-testid="field-error" className="error">{error}</div>}
        {placeholder && <div data-testid="field-placeholder">Placeholder: {placeholder}</div>}
        {options && <div data-testid="field-options">Options: {JSON.stringify(options)}</div>}
        {multiple && <div data-testid="field-multiple">Multiple: true</div>}
        {required && <div data-testid="field-required">Required: true</div>}
      </div>
    );
  };
});

// Mock CUSTOMER_SEGMENTS config
jest.mock('../../../../config/selectOptions.js', () => ({
  CUSTOMER_SEGMENTS: [
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'smb', label: 'Small & Medium Business' },
    { value: 'consumer', label: 'Consumer' },
    { value: 'education', label: 'Education' },
    { value: 'government', label: 'Government' }
  ]
}));

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
    handleChange: jest.fn(),
    errors: defaultErrors
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section title', () => {
    render(<BusinessModel {...defaultProps} />);
    expect(screen.getByText('Business Model')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<BusinessModel {...defaultProps} />);
    expect(screen.getByText(/Define your business strategy, revenue streams, and customer approach/)).toBeInTheDocument();
  });

  it('should render all field labels', () => {
    render(<BusinessModel {...defaultProps} />);

    expect(screen.getByText('Revenue Streams')).toBeInTheDocument();
    expect(screen.getByText('Customer Segments')).toBeInTheDocument();
    expect(screen.getByText('Distribution Channels')).toBeInTheDocument();
    expect(screen.getByText('Value Propositions')).toBeInTheDocument();
    expect(screen.getByText('Pricing Tiers')).toBeInTheDocument();
    expect(screen.getByText('Strategic Partnerships')).toBeInTheDocument();
    expect(screen.getByText('Cost Structure')).toBeInTheDocument();
    expect(screen.getByText('Customer Relationships')).toBeInTheDocument();
    expect(screen.getByText('Unfair Advantages & Competitive Edge')).toBeInTheDocument();
  });

  it('should render correct number of DynamicField components', () => {
    render(<BusinessModel {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    expect(dynamicFields).toHaveLength(9);
  });

  it('should have 4 array type fields', () => {
    render(<BusinessModel {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const arrayFields = typeElements.filter(el => el.textContent === 'Type: array');
    expect(arrayFields).toHaveLength(4);
  });

  it('should have 1 select type field', () => {
    render(<BusinessModel {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const selectFields = typeElements.filter(el => el.textContent === 'Type: select');
    expect(selectFields).toHaveLength(1);
  });

  it('should have 2 checkbox-group type fields', () => {
    render(<BusinessModel {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const checkboxFields = typeElements.filter(el => el.textContent === 'Type: checkbox-group');
    expect(checkboxFields).toHaveLength(2);
  });

  it('should have 2 textarea type fields', () => {
    render(<BusinessModel {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const textareaFields = typeElements.filter(el => el.textContent === 'Type: textarea');
    expect(textareaFields).toHaveLength(2);
  });

  it('should pass CUSTOMER_SEGMENTS to customer segments field', () => {
    render(<BusinessModel {...defaultProps} />);

    const optionsElements = screen.getAllByTestId('field-options');

    const customerSegmentsOptions = optionsElements.find(el =>
      el.textContent.includes('Enterprise') &&
      el.textContent.includes('Small & Medium Business')
    );

    expect(customerSegmentsOptions).toBeInTheDocument();
  });

  it('should have options for channels field', () => {
    render(<BusinessModel {...defaultProps} />);

    const optionsElements = screen.getAllByTestId('field-options');

    const channelsOptions = optionsElements.find(el =>
      el.textContent.includes('Social Media') &&
      el.textContent.includes('Email Marketing')
    );

    expect(channelsOptions).toBeInTheDocument();
  });

  it('should have options for pricing tiers field', () => {
    render(<BusinessModel {...defaultProps} />);

    const optionsElements = screen.getAllByTestId('field-options');

    const pricingOptions = optionsElements.find(el =>
      el.textContent.includes('Free Tier') &&
      el.textContent.includes('Enterprise')
    );

    expect(pricingOptions).toBeInTheDocument();
  });

  it('should have multiple=true for customer segments select', () => {
    render(<BusinessModel {...defaultProps} />);

    const multipleElements = screen.getAllByTestId('field-multiple');
    expect(multipleElements).toHaveLength(1);
  });

  it('should have placeholder texts', () => {
    render(<BusinessModel {...defaultProps} />);

    const placeholderElements = screen.getAllByTestId('field-placeholder');
    expect(placeholderElements.length).toBeGreaterThan(0);

    const placeholderTexts = placeholderElements.map(el => el.textContent);

    expect(placeholderTexts).toContain('Placeholder: Subscription, License, Advertising, Partnerships...');
    expect(placeholderTexts).toContain('Placeholder: Partner A, Partner B, Partner C...');
  });

  it('should use colWidth=12 for all fields', () => {
    render(<BusinessModel {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    dynamicFields.forEach(field => {
      expect(field.getAttribute('data-colwidth')).toBe('12');
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

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toContain('Value: Subscription, Advertising');
      expect(valuesText).toContain('Value: enterprise, smb');
      expect(valuesText).toContain('Value: social, email');
      expect(valuesText).toContain('Value: Our platform increases productivity by 50%');
      expect(valuesText).toContain('Value: free, pro');
      expect(valuesText).toContain('Value: Partner A, Partner B');
      expect(valuesText).toContain('Value: Development, Marketing');
      expect(valuesText).toContain('Value: Self-service, Email support');
      expect(valuesText).toContain('Value: Patented technology');
    });

    it('should display empty for unpopulated form data', () => {
      render(<BusinessModel {...defaultProps} />);

      const valueElements = screen.getAllByTestId('field-value');
      valueElements.forEach(element => {
        expect(element.textContent).toBe('Value: empty');
      });
    });
  });

  describe('Error Handling', () => {
    it('should display errors', () => {
      const errors = {
        revenue_streams: 'Revenue streams required',
        value_propositions: 'Value proposition required'
      };

      render(<BusinessModel {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(2);

      expect(screen.getByText('Revenue streams required')).toBeInTheDocument();
      expect(screen.getByText('Value proposition required')).toBeInTheDocument();
    });

    it('should not display errors when none', () => {
      render(<BusinessModel {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
    });
  });
});