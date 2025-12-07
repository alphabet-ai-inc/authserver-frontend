// src/components/apps/FormSections/__tests__/GeneralInformation.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { GeneralInformation } from '../GeneralInformation';

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
    required,
    disabled,
    readOnly,
    options,
    multiple,
    min,
    step,
    accept
  }) {
    return (
      <div data-testid="dynamic-field" data-fieldname={name}>
        <label data-testid="field-label">{label}</label>
        <div data-testid="field-type">Type: {type}</div>
        <div data-testid="field-value">Value: {Array.isArray(value) ? value.join(', ') : value || 'empty'}</div>
        {error && <div data-testid="field-error">{error}</div>}
        {placeholder && <div data-testid="field-placeholder">Placeholder: {placeholder}</div>}
        {required && <div data-testid="field-required">Required: true</div>}
        {disabled && <div data-testid="field-disabled">Disabled: true</div>}
        {readOnly && <div data-testid="field-readonly">ReadOnly: true</div>}
        {options && <div data-testid="field-options">Options: {JSON.stringify(options)}</div>}
        {multiple && <div data-testid="field-multiple">Multiple: true</div>}
        {min && <div data-testid="field-min">Min: {min}</div>}
        {step && <div data-testid="field-step">Step: {step}</div>}
        {accept && <div data-testid="field-accept">Accept: {accept}</div>}
      </div>
    );
  };
});

// Mock selectOptions config
jest.mock('../../../../config/selectOptions.js', () => ({
  PLATFORMS: [
    { value: 'web', label: 'Web' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'desktop', label: 'Desktop' }
  ],
  LICENSE_TYPES: [
    { value: 'mit', label: 'MIT License' },
    { value: 'gpl', label: 'GPL' },
    { value: 'proprietary', label: 'Proprietary' }
  ]
}));

describe('GeneralInformation Component', () => {
  const defaultFormData = {
    id: '',
    name: '',
    release: '',
    category: '',
    title: '',
    description: '',
    positioning_stmt: '',
    platform: [],
    size: '',
    license_type: '',
    developer: '',
    web: '',
    url: '',
    landing_page: '',
    logo: '',
    created: '',
    updated: ''
  };

  const defaultErrors = {};
  const defaultReleaseOptions = [
    { value: '1.0', label: 'Version 1.0' },
    { value: '2.0', label: 'Version 2.0' }
  ];

  const defaultProps = {
    formData: defaultFormData,
    handleChange: jest.fn(),
    errors: defaultErrors,
    releaseOptions: defaultReleaseOptions
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render section title', () => {
    render(<GeneralInformation {...defaultProps} />);
    expect(screen.getByText('General Information')).toBeInTheDocument();
  });

  it('should render section description', () => {
    render(<GeneralInformation {...defaultProps} />);
    expect(screen.getByText(/Basic application details, identification, and core information/)).toBeInTheDocument();
  });

  it('should render all section subheaders', () => {
    render(<GeneralInformation {...defaultProps} />);

    expect(screen.getByText('Application Identification')).toBeInTheDocument();
    expect(screen.getByText('Application Details')).toBeInTheDocument();
    expect(screen.getByText('Platform & Technical')).toBeInTheDocument();
    expect(screen.getByText('Web Presence')).toBeInTheDocument();
    expect(screen.getByText('Media & Dates')).toBeInTheDocument();
  });

  describe('Application Identification Fields', () => {
    it('should render all identification fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      expect(screen.getByText('Application ID')).toBeInTheDocument();
      expect(screen.getByText('Application Name')).toBeInTheDocument();
      expect(screen.getByText('Release Version')).toBeInTheDocument();
      expect(screen.getByText('Category')).toBeInTheDocument();
    });

    it('should have Application ID as disabled and readOnly', () => {
      render(<GeneralInformation {...defaultProps} />);

      const disabledElements = screen.getAllByTestId('field-disabled');
      const readOnlyElements = screen.getAllByTestId('field-readonly');

      expect(disabledElements.length).toBeGreaterThan(0);
      expect(readOnlyElements.length).toBeGreaterThan(0);
    });

    it('should have Application Name as required', () => {
      render(<GeneralInformation {...defaultProps} />);

      const requiredElements = screen.getAllByTestId('field-required');
      expect(requiredElements.length).toBeGreaterThan(0);
    });

    it('should pass releaseOptions to Release Version field', () => {
      render(<GeneralInformation {...defaultProps} />);

      const optionsElements = screen.getAllByTestId('field-options');
      const optionsText = optionsElements.map(el => el.textContent);

      expect(optionsText.some(text => text.includes('Version 1.0'))).toBe(true);
      expect(optionsText.some(text => text.includes('Version 2.0'))).toBe(true);
    });
  });

  describe('Application Details Fields', () => {
    it('should render all details fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      expect(screen.getByText('Application Title')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Positioning Statement')).toBeInTheDocument();
    });

    it('should have textarea fields for Description and Positioning Statement', () => {
      render(<GeneralInformation {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const textareaCount = typeElements.filter(el => el.textContent === 'Type: textarea').length;

      expect(textareaCount).toBe(2);
    });
  });

  describe('Platform & Technical Fields', () => {
    it('should render all platform fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      expect(screen.getByText('Supported Platforms')).toBeInTheDocument();
      expect(screen.getByText('Application Size (MB)')).toBeInTheDocument();
      expect(screen.getByText('License Type')).toBeInTheDocument();
      expect(screen.getByText('Developer/Company')).toBeInTheDocument();
    });

    it('should pass PLATFORMS options to Supported Platforms', () => {
      render(<GeneralInformation {...defaultProps} />);

      const optionsElements = screen.getAllByTestId('field-options');
      const optionsText = optionsElements.map(el => el.textContent);

      expect(optionsText.some(text => text.includes('Web'))).toBe(true);
      expect(optionsText.some(text => text.includes('Mobile'))).toBe(true);
      expect(optionsText.some(text => text.includes('Desktop'))).toBe(true);
    });

    it('should have multiple=true for Supported Platforms', () => {
      render(<GeneralInformation {...defaultProps} />);

      const multipleElements = screen.getAllByTestId('field-multiple');
      expect(multipleElements.length).toBeGreaterThan(0);
    });

    it('should pass LICENSE_TYPES to License Type field', () => {
      render(<GeneralInformation {...defaultProps} />);

      const optionsElements = screen.getAllByTestId('field-options');
      const optionsText = optionsElements.map(el => el.textContent);

      expect(optionsText.some(text => text.includes('MIT License'))).toBe(true);
      expect(optionsText.some(text => text.includes('GPL'))).toBe(true);
    });

    it('should have min and step for Application Size', () => {
      render(<GeneralInformation {...defaultProps} />);

      const minElements = screen.getAllByTestId('field-min');
      const stepElements = screen.getAllByTestId('field-step');

      expect(minElements.length).toBeGreaterThan(0);
      expect(stepElements.length).toBeGreaterThan(0);
    });
  });

  describe('Web Presence Fields', () => {
    it('should render all web presence fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      expect(screen.getByText('Website')).toBeInTheDocument();
      expect(screen.getByText('Application URL')).toBeInTheDocument();
      expect(screen.getByText('Landing Page')).toBeInTheDocument();
    });

    it('should have type=url for web fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const urlTypeElements = typeElements.filter(el => el.textContent === 'Type: url');

      expect(urlTypeElements.length).toBe(3);
    });
  });

  describe('Media & Dates Fields', () => {
    it('should render all media fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      expect(screen.getByText('Application Logo')).toBeInTheDocument();
      expect(screen.getByText('Creation Date')).toBeInTheDocument();
      expect(screen.getByText('Last Updated')).toBeInTheDocument();
    });

    it('should have type=file for Application Logo with image/* accept', () => {
      render(<GeneralInformation {...defaultProps} />);

      const fileFields = screen.getAllByTestId('field-type').filter(el => el.textContent === 'Type: file');
      expect(fileFields.length).toBe(1);

      const acceptElements = screen.getAllByTestId('field-accept');
      expect(acceptElements.length).toBe(1);
      expect(acceptElements[0].textContent).toBe('Accept: image/*');
    });

    it('should have type=date for date fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      const typeElements = screen.getAllByTestId('field-type');
      const dateTypeElements = typeElements.filter(el => el.textContent === 'Type: date');

      expect(dateTypeElements.length).toBe(2);
    });

    it('should have readOnly for date fields', () => {
      render(<GeneralInformation {...defaultProps} />);

      const readOnlyElements = screen.getAllByTestId('field-readonly');
      expect(readOnlyElements.length).toBe(3); // ID + 2 date fields
    });
  });

  describe('Error Handling', () => {
    it('should display errors when they exist', () => {
      const errors = {
        name: 'Application name is required',
        release: 'Release version is required',
        description: 'Description cannot be empty'
      };

      render(<GeneralInformation {...defaultProps} errors={errors} />);

      const errorElements = screen.getAllByTestId('field-error');
      expect(errorElements).toHaveLength(3);

      expect(screen.getByText('Application name is required')).toBeInTheDocument();
      expect(screen.getByText('Release version is required')).toBeInTheDocument();
      expect(screen.getByText('Description cannot be empty')).toBeInTheDocument();
    });
  });

  describe('Field Counts', () => {
    it('should render correct number of DynamicField components', () => {
      render(<GeneralInformation {...defaultProps} />);

      const dynamicFields = screen.getAllByTestId('dynamic-field');
      expect(dynamicFields.length).toBe(17);
    });
  });
});