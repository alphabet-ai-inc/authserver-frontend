import { render, screen, fireEvent } from '@testing-library/react';
import { UserSystemIntegration } from '../UserSystemIntegration';

describe('UserSystemIntegration Component', () => {
  const defaultProps = {
    formData: {
      company_id: '',
      dbsauth_id: '',
    },
    errors: {},
    handleChange: jest.fn(),
    companyOptions: [],
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with title', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('System Integration')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText(/Configure user integration with external systems/)).toBeInTheDocument();
    });

    it('renders all section headers', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('Company Assignment')).toBeInTheDocument();
      expect(screen.getByText('External System Integration')).toBeInTheDocument();
      expect(screen.getByText('Integration Settings')).toBeInTheDocument();
      expect(screen.getByText('Integration Status')).toBeInTheDocument();
    });

    it('renders default companies when no companyOptions provided', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('Main Company (MAIN)')).toBeInTheDocument();
      expect(screen.getByText('Subsidiary A (SUB-A)')).toBeInTheDocument();
      expect(screen.getByText('Subsidiary B (SUB-B)')).toBeInTheDocument();
    });

    it('renders custom companies when companyOptions provided', () => {
      const customCompanies = [
        { id: 10, name: 'Custom Company', code: 'CUST' },
        { id: 20, name: 'Another Company', code: 'ANOTH' },
      ];

      render(<UserSystemIntegration {...defaultProps} companyOptions={customCompanies} />);

      expect(screen.getByText('Custom Company (CUST)')).toBeInTheDocument();
      expect(screen.getByText('Another Company (ANOTH)')).toBeInTheDocument();
      expect(screen.queryByText('Main Company (MAIN)')).not.toBeInTheDocument();
    });
  });

  describe('Company Assignment Section', () => {
    it('renders primary company select with label', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Primary Company *')).toBeInTheDocument();
    });

    it('marks primary company as required', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const primaryCompanySelect = screen.getByLabelText('Primary Company *');
      expect(primaryCompanySelect).toBeRequired();
    });

    it('has default "Select Company" option', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const select = screen.getByLabelText('Primary Company *');
      expect(select).toHaveValue('');
      expect(select).toHaveDisplayValue('Select Company');
    });

    it('renders secondary companies select with label', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Secondary Companies')).toBeInTheDocument();
    });

    it('secondary companies select is multiple select', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const secondarySelect = screen.getByLabelText('Secondary Companies');
      expect(secondarySelect).toHaveAttribute('multiple');
    });

    it('calls handleChange when primary company changes', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const primaryCompanySelect = screen.getByLabelText('Primary Company *');
      fireEvent.change(primaryCompanySelect, { target: { value: '1' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays selected company value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, company_id: '2' }
      };
      render(<UserSystemIntegration {...propsWithData} />);
      const primaryCompanySelect = screen.getByLabelText('Primary Company *');
      expect(primaryCompanySelect).toHaveValue('2');
    });

    it('shows error message for company_id when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { company_id: 'Company is required' }
      };
      render(<UserSystemIntegration {...propsWithError} />);
      expect(screen.getByText('Company is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Primary Company *')).toHaveClass('is-invalid');
    });
  });

  describe('External System Integration Section', () => {
    it('renders Database Auth ID input', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Database Auth ID')).toBeInTheDocument();
    });

    it('renders LDAP/AD Integration input', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByPlaceholderText('LDAP/Active Directory username')).toBeInTheDocument();
    });

    it('renders SSO Integration toggle', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Enable Single Sign-On')).toBeInTheDocument();
    });

    it('renders API Access Key field with refresh button', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByDisplayValue('••••••••••••••••')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveAttribute('id', 'refresh_api_key');
    });

    it('calls handleChange when Database Auth ID changes', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const dbsauthInput = screen.getByLabelText('Database Auth ID');
      fireEvent.change(dbsauthInput, { target: { value: 'DB-12345' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays Database Auth ID value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, dbsauth_id: 'DB-98765' }
      };
      render(<UserSystemIntegration {...propsWithData} />);
      expect(screen.getByLabelText('Database Auth ID')).toHaveValue('DB-98765');
    });

    it('shows error message for dbsauth_id when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { dbsauth_id: 'Invalid format' }
      };
      render(<UserSystemIntegration {...propsWithError} />);
      expect(screen.getByText('Invalid format')).toBeInTheDocument();
      expect(screen.getByLabelText('Database Auth ID')).toHaveClass('is-invalid');
    });

    it('has placeholder for Database Auth ID', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByPlaceholderText('e.g., DB-12345')).toBeInTheDocument();
    });
  });

  describe('Integration Settings Section', () => {
    it('renders Login Method select', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Login Method')).toBeInTheDocument();
    });

    it('renders Sync Frequency select', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Sync Frequency')).toBeInTheDocument();
    });

    it('renders Audit Logging toggle', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Audit Logging')).toBeInTheDocument();
    });

    it('renders Auto-provision Resources toggle', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByLabelText('Auto-provision Resources')).toBeInTheDocument();
    });

    it('has default values for Login Method', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const loginMethodSelect = screen.getByLabelText('Login Method');
      expect(loginMethodSelect).toHaveValue('both');
    });

    it('has default values for Sync Frequency', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const syncFrequencySelect = screen.getByLabelText('Sync Frequency');
      expect(syncFrequencySelect).toHaveValue('realtime');
    });

    it('has Audit Logging checked by default', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const auditLoggingToggle = screen.getByLabelText('Audit Logging');
      expect(auditLoggingToggle).toBeChecked();
    });

    it('has Auto-provision Resources checked by default', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      const autoProvisionToggle = screen.getByLabelText('Auto-provision Resources');
      expect(autoProvisionToggle).toBeChecked();
    });
  });

  describe('Integration Status Section', () => {
    it('renders company status', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('Company:')).toBeInTheDocument();
      expect(screen.getByText('Not assigned')).toBeInTheDocument();
    });

    it('renders DB Auth ID status', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('DB Auth ID:')).toBeInTheDocument();
      expect(screen.getByText('Not configured')).toBeInTheDocument();
    });

    it('renders integration status', () => {
      render(<UserSystemIntegration {...defaultProps} />);
      expect(screen.getByText('Integration:')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('displays assigned company name in status', () => {
    const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, company_id: 1 }
    };
    render(<UserSystemIntegration {...propsWithData} />);

    expect(screen.getByText('Main Company (MAIN)')).toBeInTheDocument();
    });

    it('displays Database Auth ID in status', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, dbsauth_id: 'DB-99999' }
      };
      render(<UserSystemIntegration {...propsWithData} />);
      expect(screen.getByText('DB-99999')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('disables primary company select when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Primary Company *')).toBeDisabled();
    });

    it('disables secondary companies select when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Secondary Companies')).toBeDisabled();
    });

    it('disables Database Auth ID input when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Database Auth ID')).toBeDisabled();
    });

    it('disables LDAP input when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      const ldapInput = screen.getByPlaceholderText('LDAP/Active Directory username');
      expect(ldapInput).toBeDisabled();
    });

    it('disables SSO toggle when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Enable Single Sign-On')).toBeDisabled();
    });

    it('disables API refresh button when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('disables Login Method select when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Login Method')).toBeDisabled();
    });

    it('disables Audit Logging toggle when disabled', () => {
      render(<UserSystemIntegration {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Audit Logging')).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct label associations', () => {
      render(<UserSystemIntegration {...defaultProps} />);

      expect(screen.getByLabelText('Primary Company *')).toHaveAttribute('id', 'company_id');
      expect(screen.getByLabelText('Secondary Companies')).toHaveAttribute('id', 'secondary_companies');
      expect(screen.getByLabelText('Database Auth ID')).toHaveAttribute('id', 'dbsauth_id');
      expect(screen.getByLabelText('Enable Single Sign-On')).toHaveAttribute('id', 'sso_enabled');
      expect(screen.getByLabelText('Login Method')).toHaveAttribute('id', 'login_method');
      expect(screen.getByLabelText('Sync Frequency')).toHaveAttribute('id', 'sync_frequency');
      expect(screen.getByLabelText('Audit Logging')).toHaveAttribute('id', 'audit_logging');
      expect(screen.getByLabelText('Auto-provision Resources')).toHaveAttribute('id', 'auto_provision');
    });

    it('has correct name attributes for controlled inputs', () => {
      render(<UserSystemIntegration {...defaultProps} />);

      expect(screen.getByLabelText('Primary Company *')).toHaveAttribute('name', 'company_id');
      expect(screen.getByLabelText('Database Auth ID')).toHaveAttribute('name', 'dbsauth_id');
      expect(screen.getByLabelText('Enable Single Sign-On')).toHaveAttribute('name', 'sso_enabled');
      expect(screen.getByLabelText('Login Method')).toHaveAttribute('name', 'login_method');
      expect(screen.getByLabelText('Sync Frequency')).toHaveAttribute('name', 'sync_frequency');
      expect(screen.getByLabelText('Audit Logging')).toHaveAttribute('name', 'audit_logging');
      expect(screen.getByLabelText('Auto-provision Resources')).toHaveAttribute('name', 'auto_provision');
    });
  });
});