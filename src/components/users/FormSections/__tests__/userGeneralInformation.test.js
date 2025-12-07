import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserGeneralInformation } from '../UserGeneralInformation';

describe('UserGeneralInformation Component', () => {
  const defaultProps = {
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      code: '',
    },
    errors: {},
    handleChange: jest.fn(),
    roleOptions: [
      { value: 'admin', label: 'Administrator' },
      { value: 'user', label: 'Regular User' },
      { value: 'manager', label: 'Manager' },
    ],
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with title', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByText('General Information')).toBeInTheDocument();
    });

    it('renders all required form fields', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address *')).toBeInTheDocument();
      expect(screen.getByLabelText('User Code')).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('marks required fields with asterisk', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).toBeRequired();
      expect(screen.getByLabelText('Last Name *')).toBeRequired();
      expect(screen.getByLabelText('Email Address *')).toBeRequired();
    });

    it('does not mark user code as required', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const userCodeInput = screen.getByLabelText('User Code');
      expect(userCodeInput).not.toBeRequired();
    });

    it('displays correct input types', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Last Name *')).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText('Email Address *')).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText('User Code')).toHaveAttribute('type', 'text');
    });

    it('shows placeholder for user code field', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const userCodeInput = screen.getByLabelText('User Code');
      expect(userCodeInput).toHaveAttribute('placeholder', 'Unique identifier');
    });
  });

  describe('Form Data Display', () => {
    it('displays first name from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, first_name: 'John' }
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByLabelText('First Name *')).toHaveValue('John');
    });

    it('displays last name from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, last_name: 'Doe' }
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByLabelText('Last Name *')).toHaveValue('Doe');
    });

    it('displays email from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, email: 'john.doe@example.com' }
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByLabelText('Email Address *')).toHaveValue('john.doe@example.com');
    });

    it('displays user code from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, code: 'EMP001' }
      };
      render(<UserGeneralInformation {...propsWithData} />);
      expect(screen.getByLabelText('User Code')).toHaveValue('EMP001');
    });
  });

  describe('Event Handling', () => {
    it('calls handleChange when first name input changes', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const firstNameInput = screen.getByLabelText('First Name *');
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange when last name input changes', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const lastNameInput = screen.getByLabelText('Last Name *');
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange when email input changes', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const emailInput = screen.getByLabelText('Email Address *');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange when user code input changes', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      const userCodeInput = screen.getByLabelText('User Code');
      fireEvent.change(userCodeInput, { target: { value: 'CODE123' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error States', () => {
    it('shows error message for first name when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { first_name: 'First name is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByLabelText('First Name *')).toHaveClass('is-invalid');
    });

    it('shows error message for last name when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { last_name: 'Last name is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name *')).toHaveClass('is-invalid');
    });

    it('shows error message for email when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { email: 'Valid email is required' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('Valid email is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address *')).toHaveClass('is-invalid');
    });

    it('shows error message for user code when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { code: 'User code must be unique' }
      };
      render(<UserGeneralInformation {...propsWithError} />);
      expect(screen.getByText('User code must be unique')).toBeInTheDocument();
      expect(screen.getByLabelText('User Code')).toHaveClass('is-invalid');
    });

    it('does not show error classes when no errors exist', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).not.toHaveClass('is-invalid');
      expect(screen.getByLabelText('Last Name *')).not.toHaveClass('is-invalid');
      expect(screen.getByLabelText('Email Address *')).not.toHaveClass('is-invalid');
      expect(screen.getByLabelText('User Code')).not.toHaveClass('is-invalid');
    });

    it('handles multiple errors simultaneously', () => {
      const propsWithMultipleErrors = {
        ...defaultProps,
        errors: {
          first_name: 'Required',
          last_name: 'Required',
          email: 'Invalid email'
        }
      };
      render(<UserGeneralInformation {...propsWithMultipleErrors} />);
      expect(screen.getAllByText('Required')).toHaveLength(2);
      expect(screen.getByText('Invalid email')).toBeInTheDocument();
      expect(screen.getByLabelText('First Name *')).toHaveClass('is-invalid');
      expect(screen.getByLabelText('Last Name *')).toHaveClass('is-invalid');
      expect(screen.getByLabelText('Email Address *')).toHaveClass('is-invalid');
    });
  });

  describe('Disabled State', () => {
    it('disables all inputs when disabled prop is true', () => {
      render(<UserGeneralInformation {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('First Name *')).toBeDisabled();
      expect(screen.getByLabelText('Last Name *')).toBeDisabled();
      expect(screen.getByLabelText('Email Address *')).toBeDisabled();
      expect(screen.getByLabelText('User Code')).toBeDisabled();
    });

    it('enables all inputs when disabled prop is false', () => {
      render(<UserGeneralInformation {...defaultProps} disabled={false} />);
      expect(screen.getByLabelText('First Name *')).not.toBeDisabled();
      expect(screen.getByLabelText('Last Name *')).not.toBeDisabled();
      expect(screen.getByLabelText('Email Address *')).not.toBeDisabled();
      expect(screen.getByLabelText('User Code')).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct label associations', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).toHaveAttribute('id', 'first_name');
      expect(screen.getByLabelText('Last Name *')).toHaveAttribute('id', 'last_name');
      expect(screen.getByLabelText('Email Address *')).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText('User Code')).toHaveAttribute('id', 'code');
    });

    it('has correct name attributes', () => {
      render(<UserGeneralInformation {...defaultProps} />);
      expect(screen.getByLabelText('First Name *')).toHaveAttribute('name', 'first_name');
      expect(screen.getByLabelText('Last Name *')).toHaveAttribute('name', 'last_name');
      expect(screen.getByLabelText('Email Address *')).toHaveAttribute('name', 'email');
      expect(screen.getByLabelText('User Code')).toHaveAttribute('name', 'code');
    });
  });
});