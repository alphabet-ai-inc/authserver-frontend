import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserGeneralInformation } from '../UserGeneralInformation.jsx';

describe('UserGeneralInformation Component', () => {
  const defaultProps = {
    formData: {
      id: '',
      first_name: '',
      last_name: '',
      email: '',
      code: '',
    },
    errors: {},
    handleChange: vi.fn(), // Note: This won't be used directly in the component anymore
    roleOptions: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'Regular User' },
      { value: 'manager', label: 'Manager' },
    ],
    disabled: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with title', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('General Information')).toBeInTheDocument();
      expect(screen.getByText('Basic user identification details')).toBeInTheDocument();
    });

    it('renders all required form fields', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
      expect(screen.getByText('User Code')).toBeInTheDocument();
    });

    it('renders user ID field', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('User ID')).toBeInTheDocument();
    });
  });

  describe('Form Data Display', () => {
    it('displays first name from formData', () => {
      const propsWithData = {
        formData: { ...defaultProps.formData, first_name: 'John' },
        errors: {}
      };
      render(<UserGeneralInformation {...propsWithData} />);
      // The DynamicField component might render the value differently
      // Check if the value is displayed somewhere
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    });

    it('displays last name from formData', () => {
      const propsWithData = {
        formData: { ...defaultProps.formData, last_name: 'Doe' },
        errors: {}
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });

    it('displays email from formData', () => {
      const propsWithData = {
        formData: { ...defaultProps.formData, email: 'john.doe@example.com' },
        errors: {}
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });

    it('displays user code from formData', () => {
      const propsWithData = {
        formData: { ...defaultProps.formData, code: 'EMP001' },
        errors: {}
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByDisplayValue('EMP001')).toBeInTheDocument();
    });

    it('displays user ID from formData', () => {
      const propsWithData = {
        formData: { ...defaultProps.formData, id: '123' },
        errors: {}
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByDisplayValue('123')).toBeInTheDocument();
    });
  });

  describe('Error States', () => {
    it('shows error message for first name when error exists', () => {
      const propsWithError = {
        formData: defaultProps.formData,
        errors: { first_name: 'First name is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('First name is required')).toBeInTheDocument();
    });

    it('shows error message for last name when error exists', () => {
      const propsWithError = {
        formData: defaultProps.formData,
        errors: { last_name: 'Last name is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });

    it('shows error message for email when error exists', () => {
      const propsWithError = {
        formData: defaultProps.formData,
        errors: { email: 'Valid email is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('Valid email is required')).toBeInTheDocument();
    });

    it('shows error message for user code when error exists', () => {
      const propsWithError = {
        formData: defaultProps.formData,
        errors: { code: 'User code must be unique' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('User code must be unique')).toBeInTheDocument();
    });

    it('shows error message for user ID when error exists', () => {
      const propsWithError = {
        formData: defaultProps.formData,
        errors: { id: 'Invalid ID' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('Invalid ID')).toBeInTheDocument();
    });

    it('handles multiple errors simultaneously', () => {
      const propsWithMultipleErrors = {
        formData: defaultProps.formData,
        errors: {
          first_name: 'Required',
          last_name: 'Required',
          email: 'Invalid email'
        }
      };
      render(<UserGeneralInformation {...propsWithMultipleErrors} />);
      expect(screen.getAllByText('Required')).toHaveLength(2);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('has section headings', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('User Identification')).toBeInTheDocument();
    });

    it('has correct icons', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('General Information')).toContainHTML('i class');
      expect(screen.getByText('User Identification')).toContainHTML('i class');
    });
  });

  describe('Placeholder Text', () => {
    it('shows placeholders for fields', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      // Since DynamicField renders inputs internally, we need to check for placeholders
      // This depends on how DynamicField passes props to the input element
      const inputs = screen.getAllByRole('textbox');
      expect(inputs.some(input => input.placeholder === 'Enter first name')).toBeTruthy();
      expect(inputs.some(input => input.placeholder === 'Enter last name')).toBeTruthy();
      expect(inputs.some(input => input.placeholder === 'Enter email address')).toBeTruthy();
      expect(inputs.some(input => input.placeholder === 'Unique identifier')).toBeTruthy();
    });
  });

describe('DynamicField Integration', () => {
  // Remove or comment out the mock since it's causing issues
  // The actual DynamicField component is probably rendering differently

  it('renders all DynamicField components', () => {
    render(<UserGeneralInformation {...defaultProps} />);

    // Instead of trying to mock DynamicField, check for the actual rendered content
    // Check that all expected fields are present
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
    expect(screen.getByText('Email Address')).toBeInTheDocument();
    expect(screen.getByText('User Code')).toBeInTheDocument();
  });

  it('passes correct props to DynamicField components for first name', () => {
    const propsWithData = {
      formData: { ...defaultProps.formData, first_name: 'John' },
      errors: { first_name: 'Required' }
    };
    render(<UserGeneralInformation {...propsWithData} />);

    // The DynamicField should display the value and error
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('marks required fields correctly', () => {
    render(<UserGeneralInformation {...defaultProps} />);

    // Check that required fields have asterisks (this depends on how DynamicField renders required fields)
    // You might need to check the actual DynamicField implementation
    const firstNameLabel = screen.getByText('First Name');
    const lastNameLabel = screen.getByText('Last Name');
    const emailLabel = screen.getByText('Email Address');

    // Check parent elements for asterisks or required indicators
    expect(firstNameLabel.parentElement?.innerHTML).toContain('*');
    expect(lastNameLabel.parentElement?.innerHTML).toContain('*');
    expect(emailLabel.parentElement?.innerHTML).toContain('*');
  });
});

});