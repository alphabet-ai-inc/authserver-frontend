// src/components/apps/FormSections/__tests__/TechnicalSpecifications.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { TechnicalSpecifications } from '../TechnicalSpecifications';

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
    rows
  }) {
    return (
      <div data-testid="dynamic-field">
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">Value: {Array.isArray(value) ? value.join(', ') : value || 'empty'}</div>
        {error && <div data-testid="field-error">{error}</div>}
        {placeholder && <div data-testid="field-placeholder">Placeholder: {placeholder}</div>}
        {rows && <div data-testid="field-rows">Rows: {rows}</div>}
      </div>
    );
  };
});

describe('TechnicalSpecifications Component', () => {
  const defaultFormData = {
    compatibility: [],
    path: '',
    init: '',
    development_stack: [],
    integration_capabilities: [],
    api_documentation: '',
    security_features: [],
    regulatory_compliance: [],
    supported_browsers: [],
    database_systems: [],
    deployment_architecture: ''
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
    render(<TechnicalSpecifications {...defaultProps} />);
    expect(screen.getByText('Technical Specifications')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<TechnicalSpecifications {...defaultProps} />);
    expect(screen.getByText(/Technical infrastructure, integration capabilities, and system requirements/)).toBeInTheDocument();
  });

  it('should render all section subheaders', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    expect(screen.getByText('System Requirements')).toBeInTheDocument();
    expect(screen.getByText('Technology Stack')).toBeInTheDocument();
    expect(screen.getByText('Integration & APIs')).toBeInTheDocument();
    expect(screen.getByText('Security & Compliance')).toBeInTheDocument();
  });

  it('should render all field labels', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    expect(screen.getByText('System Compatibility')).toBeInTheDocument();
    expect(screen.getByText('Installation Path')).toBeInTheDocument();
    expect(screen.getByText('Initialization Command')).toBeInTheDocument();
    expect(screen.getByText('Development Stack')).toBeInTheDocument();
    expect(screen.getByText('Integration Capabilities')).toBeInTheDocument();
    expect(screen.getByText('API Documentation')).toBeInTheDocument();
    expect(screen.getByText('Security Features')).toBeInTheDocument();
    expect(screen.getByText('Regulatory Compliance')).toBeInTheDocument();
    expect(screen.getByText('Supported Browsers')).toBeInTheDocument();
    expect(screen.getByText('Database Systems')).toBeInTheDocument();
    expect(screen.getByText('Deployment Architecture')).toBeInTheDocument();
  });

  it('should render correct number of DynamicField components', () => {
    render(<TechnicalSpecifications {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    expect(dynamicFields.length).toBe(11);
  });

  describe('Field Types Distribution', () => {
    it('should have correct field types', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const typeTexts = typeElements.map(el => el.textContent);

      const arrayCount = typeTexts.filter(text => text === 'Type: array').length;
      const textCount = typeTexts.filter(text => text === 'Type: text').length;
      const textareaCount = typeTexts.filter(text => text === 'Type: textarea').length;

      expect(arrayCount).toBe(7);
      expect(textCount).toBe(2);
      expect(textareaCount).toBe(2);
    });
  });

  describe('Array Fields', () => {
    it('should have 7 array fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const arrayCount = typeElements.filter(el => el.textContent === 'Type: array').length;

      expect(arrayCount).toBe(7);
    });

    it('should have array fields for technical lists', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const fieldLabels = screen.getAllByTestId('field-label');
      const labelTexts = fieldLabels.map(el => el.textContent);

      expect(labelTexts).toContain('System Compatibility');
      expect(labelTexts).toContain('Development Stack');
      expect(labelTexts).toContain('Integration Capabilities');
      expect(labelTexts).toContain('Security Features');
      expect(labelTexts).toContain('Regulatory Compliance');
      expect(labelTexts).toContain('Supported Browsers');
      expect(labelTexts).toContain('Database Systems');
    });
  });

  describe('Text Fields', () => {
    it('should have 2 text fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const textCount = typeElements.filter(el => el.textContent === 'Type: text').length;

      expect(textCount).toBe(2);
    });

    it('should have text fields for path and init', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const fieldLabels = screen.getAllByTestId('field-label');
      const labelTexts = fieldLabels.map(el => el.textContent);

      expect(labelTexts).toContain('Installation Path');
      expect(labelTexts).toContain('Initialization Command');
    });
  });

  describe('Textarea Fields', () => {
    it('should have 2 textarea fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const textareaCount = typeElements.filter(el => el.textContent === 'Type: textarea').length;

      expect(textareaCount).toBe(2);
    });

    it('should have textarea fields with correct row counts', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const rowsElements = screen.getAllByTestId('field-rows');
      const rowsValues = rowsElements.map(el => el.textContent);

      expect(rowsValues).toContain('Rows: 4');
      expect(rowsValues).toContain('Rows: 3');
    });

    it('should have textarea for API Documentation and Deployment Architecture', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const fieldLabels = screen.getAllByTestId('field-label');
      const labelTexts = fieldLabels.map(el => el.textContent);

      expect(labelTexts).toContain('API Documentation');
      expect(labelTexts).toContain('Deployment Architecture');
    });
  });

  describe('Placeholder Texts', () => {
    it('should have placeholder texts for all fields', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const placeholderElements = screen.getAllByTestId('field-placeholder');
      expect(placeholderElements.length).toBe(11);
    });

    it('should have appropriate placeholder content', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const placeholderElements = screen.getAllByTestId('field-placeholder');
      const placeholderTexts = placeholderElements.map(el => el.textContent);

      expect(placeholderTexts).toContain('Placeholder: Windows 10+, macOS 12+, Linux Ubuntu 20+, Android 10+, iOS 14+...');
      expect(placeholderTexts).toContain('Placeholder: e.g., /usr/local/bin/app, C:\\Program Files\\App');
      expect(placeholderTexts).toContain('Placeholder: e.g., npm start, docker-compose up, ./start.sh');
      expect(placeholderTexts).toContain('Placeholder: React, Node.js, Python, Django, PostgreSQL, Docker, Kubernetes...');
      expect(placeholderTexts).toContain('Placeholder: REST APIs, GraphQL, Webhooks, OAuth, Social Media APIs...');
      expect(placeholderTexts).toContain('Placeholder: Describe your API endpoints, authentication methods, and usage examples...');
      expect(placeholderTexts).toContain('Placeholder: SSL/TLS, Encryption at rest, 2FA, Role-based access, Audit logging...');
      expect(placeholderTexts).toContain('Placeholder: GDPR, HIPAA, SOC2, PCI-DSS, ISO 27001...');
      expect(placeholderTexts).toContain('Placeholder: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+...');
      expect(placeholderTexts).toContain('Placeholder: PostgreSQL, MySQL, MongoDB, Redis, Elasticsearch...');
      expect(placeholderTexts).toContain('Placeholder: Describe your deployment setup, cloud providers, and infrastructure...');
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        compatibility: 'System compatibility is required',
        development_stack: 'At least one technology is required',
        api_documentation: 'API documentation cannot be empty'
      };

      render(<TechnicalSpecifications {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(3);

      expect(screen.getByText('System compatibility is required')).toBeInTheDocument();
      expect(screen.getByText('At least one technology is required')).toBeInTheDocument();
      expect(screen.getByText('API documentation cannot be empty')).toBeInTheDocument();
    });

    it('should not display errors when none exist', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
    });
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        compatibility: ['Windows 10', 'macOS 12'],
        path: '/usr/local/bin/myapp',
        init: 'npm start',
        development_stack: ['React', 'Node.js', 'PostgreSQL'],
        integration_capabilities: ['REST API', 'Webhooks'],
        api_documentation: 'Swagger documentation available',
        security_features: ['SSL', '2FA'],
        regulatory_compliance: ['GDPR', 'HIPAA'],
        supported_browsers: ['Chrome', 'Firefox'],
        database_systems: ['PostgreSQL', 'Redis'],
        deployment_architecture: 'Docker containers on AWS'
      };

      render(<TechnicalSpecifications {...defaultProps} formData={formDataWithValues} />);

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toContain('Value: Windows 10, macOS 12');
      expect(valuesText).toContain('Value: /usr/local/bin/myapp');
      expect(valuesText).toContain('Value: npm start');
      expect(valuesText).toContain('Value: React, Node.js, PostgreSQL');
      expect(valuesText).toContain('Value: REST API, Webhooks');
      expect(valuesText).toContain('Value: Swagger documentation available');
      expect(valuesText).toContain('Value: SSL, 2FA');
      expect(valuesText).toContain('Value: GDPR, HIPAA');
      expect(valuesText).toContain('Value: Chrome, Firefox');
      expect(valuesText).toContain('Value: PostgreSQL, Redis');
      expect(valuesText).toContain('Value: Docker containers on AWS');
    });
  });

  describe('Field Grouping', () => {
    it('should group fields under correct subheaders', () => {
      render(<TechnicalSpecifications {...defaultProps} />);

      // Check that fields from each section exist
      // System Requirements section
      expect(screen.getByText('System Compatibility')).toBeInTheDocument();
      expect(screen.getByText('Installation Path')).toBeInTheDocument();
      expect(screen.getByText('Initialization Command')).toBeInTheDocument();

      // Technology Stack section
      expect(screen.getByText('Development Stack')).toBeInTheDocument();

      // Integration & APIs section
      expect(screen.getByText('Integration Capabilities')).toBeInTheDocument();
      expect(screen.getByText('API Documentation')).toBeInTheDocument();

      // Security & Compliance section
      expect(screen.getByText('Security Features')).toBeInTheDocument();
      expect(screen.getByText('Regulatory Compliance')).toBeInTheDocument();
      expect(screen.getByText('Supported Browsers')).toBeInTheDocument();
      expect(screen.getByText('Database Systems')).toBeInTheDocument();
      expect(screen.getByText('Deployment Architecture')).toBeInTheDocument();
    });
  });
});