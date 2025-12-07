// src/components/apps/FormSections/__tests__/ComplianceOperations.test.js
import { render, screen } from '@testing-library/react';
import { ComplianceOperations } from '../ComplianceOperations';

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
        {rows && <div data-testid="field-rows">Rows: {rows}</div>}
      </div>
    );
  };
});

describe('ComplianceOperations Component', () => {
  const defaultFormData = {
    backup_recovery_options: '',
    data_backup_location: '',
    localization_support: [],
    accessibility_features: [],
    team_structure: '',
    compliance_standards: [],
    security_protocols: '',
    supported_regions: []
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
    render(<ComplianceOperations {...defaultProps} />);
    expect(screen.getByText('Compliance & Operations')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<ComplianceOperations {...defaultProps} />);
    expect(screen.getByText(/Security, accessibility, team structure, and operational compliance requirements/)).toBeInTheDocument();
  });

  it('should render all section subheaders', () => {
    render(<ComplianceOperations {...defaultProps} />);

    expect(screen.getByText('Security & Data Protection')).toBeInTheDocument();
    expect(screen.getByText('Compliance & Accessibility')).toBeInTheDocument();
    expect(screen.getByText('Team & Operations')).toBeInTheDocument();
  });

  it('should render all field labels', () => {
    render(<ComplianceOperations {...defaultProps} />);

    expect(screen.getByText('Backup & Recovery Procedures')).toBeInTheDocument();
    expect(screen.getByText('Data Backup Location')).toBeInTheDocument();
    expect(screen.getByText('Localization & Language Support')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Features')).toBeInTheDocument();
    expect(screen.getByText('Team Structure & Responsibilities')).toBeInTheDocument();
    expect(screen.getByText('Compliance Standards')).toBeInTheDocument();
    expect(screen.getByText('Security Protocols')).toBeInTheDocument();
    expect(screen.getByText('Supported Regions/Countries')).toBeInTheDocument();
  });

  it('should render correct number of DynamicField components', () => {
    render(<ComplianceOperations {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');
    expect(dynamicFields).toHaveLength(8);
  });

  it('should have correct field types distribution', () => {
    render(<ComplianceOperations {...defaultProps} />);

    const typeElements = screen.getAllByTestId('field-type');
    const typeTexts = typeElements.map(el => el.textContent);

    const textareaCount = typeTexts.filter(text => text === 'Type: textarea').length;
    const arrayCount = typeTexts.filter(text => text === 'Type: array').length;
    const textCount = typeTexts.filter(text => text === 'Type: text').length;

    expect(textareaCount).toBe(3); // backup_recovery_options, team_structure, security_protocols
    expect(arrayCount).toBe(4); // localization_support, accessibility_features, compliance_standards, supported_regions
    expect(textCount).toBe(1); // data_backup_location
  });

  it('should have correct colWidth values', () => {
    render(<ComplianceOperations {...defaultProps} />);

    const dynamicFields = screen.getAllByTestId('dynamic-field');

    const colWidth12Fields = dynamicFields.filter(field => field.getAttribute('data-colwidth') === '12');
    const colWidth6Fields = dynamicFields.filter(field => field.getAttribute('data-colwidth') === '6');

    expect(colWidth12Fields.length).toBe(5); // backup_recovery_options, team_structure, compliance_standards, security_protocols, supported_regions
    expect(colWidth6Fields.length).toBe(3); // data_backup_location, localization_support, accessibility_features
  });

  it('should have correct placeholder texts', () => {
    render(<ComplianceOperations {...defaultProps} />);

    const placeholderElements = screen.getAllByTestId('field-placeholder');
    const placeholderTexts = placeholderElements.map(el => el.textContent);

    expect(placeholderTexts).toContain('Placeholder: Describe your data backup frequency, recovery procedures, and disaster recovery plans...');
    expect(placeholderTexts).toContain('Placeholder: e.g., AWS S3, Google Cloud Storage, On-premise servers...');
    expect(placeholderTexts).toContain('Placeholder: English, Spanish, French, German, Japanese...');
    expect(placeholderTexts).toContain('Placeholder: Screen reader support, Keyboard navigation, High contrast mode...');
    expect(placeholderTexts).toContain('Placeholder: Describe your team organization, roles, and operational responsibilities...');
    expect(placeholderTexts).toContain('Placeholder: GDPR, HIPAA, SOC2, PCI-DSS, ISO 27001...');
    expect(placeholderTexts).toContain('Placeholder: Describe your security measures, encryption standards, and access controls...');
    expect(placeholderTexts).toContain('Placeholder: United States, European Union, Canada, Australia...');
  });

  it('should have rows specified for textarea fields', () => {
    render(<ComplianceOperations {...defaultProps} />);

    const rowsElements = screen.getAllByTestId('field-rows');
    expect(rowsElements).toHaveLength(3); // Three textarea fields with rows prop

    const rowsValues = rowsElements.map(el => el.textContent);
    expect(rowsValues).toContain('Rows: 4');
    expect(rowsValues).toContain('Rows: 3');
  });

  describe('Data Display', () => {
    it('should display populated form data', () => {
      const formDataWithValues = {
        backup_recovery_options: 'Daily backups to AWS S3 with 30-day retention',
        data_backup_location: 'AWS S3 us-east-1',
        localization_support: ['English', 'Spanish', 'French'],
        accessibility_features: ['Screen reader', 'Keyboard navigation'],
        team_structure: '5 developers, 2 QA, 1 DevOps',
        compliance_standards: ['GDPR', 'HIPAA'],
        security_protocols: 'AES-256 encryption, 2FA required',
        supported_regions: ['US', 'EU', 'Canada']
      };

      render(<ComplianceOperations {...defaultProps} formData={formDataWithValues} />);

      const valueElements = screen.getAllByTestId('field-value');
      const valuesText = valueElements.map(el => el.textContent);

      expect(valuesText).toContain('Value: Daily backups to AWS S3 with 30-day retention');
      expect(valuesText).toContain('Value: AWS S3 us-east-1');
      expect(valuesText).toContain('Value: English, Spanish, French');
      expect(valuesText).toContain('Value: Screen reader, Keyboard navigation');
      expect(valuesText).toContain('Value: 5 developers, 2 QA, 1 DevOps');
      expect(valuesText).toContain('Value: GDPR, HIPAA');
      expect(valuesText).toContain('Value: AES-256 encryption, 2FA required');
      expect(valuesText).toContain('Value: US, EU, Canada');
    });

    it('should display empty for unpopulated form data', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const valueElements = screen.getAllByTestId('field-value');
      valueElements.forEach(element => {
        expect(element.textContent).toBe('Value: empty');
      });
    });

    it('should handle empty arrays correctly', () => {
      const formDataWithEmptyArrays = {
        ...defaultFormData,
        localization_support: [],
        accessibility_features: []
      };

      render(<ComplianceOperations {...defaultProps} formData={formDataWithEmptyArrays} />);

      const valueElements = screen.getAllByTestId('field-value');
      const arrayFieldValues = valueElements.filter(el => el.textContent === 'Value: empty');
      expect(arrayFieldValues.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        backup_recovery_options: 'Backup procedures are required',
        compliance_standards: 'At least one compliance standard must be selected'
      };

      render(<ComplianceOperations {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(2);

      expect(screen.getByText('Backup procedures are required')).toBeInTheDocument();
      expect(screen.getByText('At least one compliance standard must be selected')).toBeInTheDocument();
    });

    it('should not display errors when none exist', () => {
      render(<ComplianceOperations {...defaultProps} />);

      const errorElements = screen.queryAllByTestId('field-error');
      expect(errorElements).toHaveLength(0);
    });
  });

  it('should group fields under correct subheaders', () => {
    render(<ComplianceOperations {...defaultProps} />);

    // All fields should be present
    expect(screen.getByText('Backup & Recovery Procedures')).toBeInTheDocument();
    expect(screen.getByText('Data Backup Location')).toBeInTheDocument();
    expect(screen.getByText('Localization & Language Support')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Features')).toBeInTheDocument();
    expect(screen.getByText('Team Structure & Responsibilities')).toBeInTheDocument();
    expect(screen.getByText('Compliance Standards')).toBeInTheDocument();
    expect(screen.getByText('Security Protocols')).toBeInTheDocument();
    expect(screen.getByText('Supported Regions/Countries')).toBeInTheDocument();
  });
});