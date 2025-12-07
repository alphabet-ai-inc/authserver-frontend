import { render, screen, fireEvent } from '@testing-library/react';
import { UserActivitySettings } from '../UserActivitySettings';

describe('UserActivitySettings Component', () => {
  const defaultProps = {
    formData: {
      lan: '',
      last_app: '',
      last_db: '',
      tries: 0,
    },
    errors: {},
    handleChange: jest.fn(),
    appOptions: [
      { id: 1, name: 'CRM System', description: 'Customer Relationship Management' },
      { id: 2, name: 'ERP System', description: 'Enterprise Resource Planning' },
      { id: 3, name: 'Analytics Dashboard', description: 'Business Intelligence' },
    ],
    dbOptions: [
      { id: 1, name: 'Main Database', type: 'PostgreSQL' },
      { id: 2, name: 'Analytics DB', type: 'MySQL' },
      { id: 3, name: 'Archive DB', type: 'MongoDB' },
    ],
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.confirm = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the component with title', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Activity & Usage Settings')).toBeInTheDocument();
    });

    it('renders description text', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText(/Configure user activity tracking/)).toBeInTheDocument();
    });

    it('renders all section headers', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Language & Regional Settings')).toBeInTheDocument();
      expect(screen.getByText('Recent Usage')).toBeInTheDocument();
      expect(screen.getByText('Session & Interface Settings')).toBeInTheDocument();
      expect(screen.getByText('Activity Management')).toBeInTheDocument();
      expect(screen.getByText('Current Settings Summary')).toBeInTheDocument();
    });

    it('renders warning alert in Activity Management', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Note:')).toBeInTheDocument();
      expect(screen.getByText(/These settings affect how the user's activity is tracked/)).toBeInTheDocument();
    });
  });

  describe('Language & Regional Settings Section', () => {
    it('renders language preference select with label', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Language Preference *')).toBeInTheDocument();
    });

    it('renders all language options with flags', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('🇺🇸 English')).toBeInTheDocument();
      expect(screen.getByText('🇪🇸 Spanish')).toBeInTheDocument();
      expect(screen.getByText('🇫🇷 French')).toBeInTheDocument();
      expect(screen.getByText('🇩🇪 German')).toBeInTheDocument();
    });

    it('renders date format select', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Date Format')).toBeInTheDocument();
    });

    it('renders time zone select', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Time Zone')).toBeInTheDocument();
    });

    it('renders currency select', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Currency')).toBeInTheDocument();
    });

    it('calls handleChange when language changes', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const languageSelect = screen.getByLabelText('Language Preference *');
      fireEvent.change(languageSelect, { target: { value: 'es' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays selected language value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, lan: 'fr' }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByLabelText('Language Preference *')).toHaveValue('fr');
    });

    it('shows error message for language when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { lan: 'Language is required' }
      };
      render(<UserActivitySettings {...propsWithError} />);
      expect(screen.getByText('Language is required')).toBeInTheDocument();
      expect(screen.getByLabelText('Language Preference *')).toHaveClass('is-invalid');
    });

    it('has default "Select Language" option', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const languageSelect = screen.getByLabelText('Language Preference *');
      expect(languageSelect).toHaveValue('en');
    });

    it('has default values for other selects', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Date Format')).toHaveValue('auto');
      expect(screen.getByLabelText('Time Zone')).toHaveValue('auto');
      expect(screen.getByLabelText('Currency')).toHaveValue('USD');
    });
  });

  describe('Recent Usage Section', () => {
    it('renders last app used select with label', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Last Application Used')).toBeInTheDocument();
    });

    it('renders last database used select with label', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Last Database Used')).toBeInTheDocument();
    });

    it('renders app options from props', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('CRM System - Customer Relationship Management')).toBeInTheDocument();
      expect(screen.getByText('ERP System - Enterprise Resource Planning')).toBeInTheDocument();
    });

    it('renders database options from props', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Main Database (PostgreSQL)')).toBeInTheDocument();
      expect(screen.getByText('Analytics DB (MySQL)')).toBeInTheDocument();
    });

    it('calls handleChange when last app changes', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const lastAppSelect = screen.getByLabelText('Last Application Used');
      fireEvent.change(lastAppSelect, { target: { value: '2' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('calls handleChange when last database changes', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const lastDbSelect = screen.getByLabelText('Last Database Used');
      fireEvent.change(lastDbSelect, { target: { value: '3' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays selected last app value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, last_app: '1' }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByLabelText('Last Application Used')).toHaveValue('1');
    });

    it('displays selected last database value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, last_db: '2' }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByLabelText('Last Database Used')).toHaveValue('2');
    });

    it('shows error messages for last app and database when errors exist', () => {
      const propsWithError = {
        ...defaultProps,
        errors: {
          last_app: 'Invalid app selection',
          last_db: 'Invalid database selection'
        }
      };
      render(<UserActivitySettings {...propsWithError} />);
      expect(screen.getByText('Invalid app selection')).toBeInTheDocument();
      expect(screen.getByText('Invalid database selection')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Application Used')).toHaveClass('is-invalid');
      expect(screen.getByLabelText('Last Database Used')).toHaveClass('is-invalid');
    });

    it('has default "Not specified" options', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Last Application Used')).toHaveDisplayValue('Not specified');
      expect(screen.getByLabelText('Last Database Used')).toHaveDisplayValue('Not specified');
    });
  });

  describe('Session & Interface Settings Section', () => {
    it('renders auto logout toggle', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Auto Logout')).toBeInTheDocument();
    });

    it('renders email notifications toggle', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
    });

    it('renders theme preference select', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Theme Preference')).toBeInTheDocument();
    });

    it('renders default view select', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Default View')).toBeInTheDocument();
    });

    it('has auto logout checked by default', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Auto Logout')).toBeChecked();
    });

    it('has email notifications checked by default', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Email Notifications')).toBeChecked();
    });

    it('has default values for theme and view selects', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Theme Preference')).toHaveValue('light');
      expect(screen.getByLabelText('Default View')).toHaveValue('list');
    });
  });

  describe('Activity Management Section', () => {
    it('renders login attempts input with label', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Login Attempts')).toBeInTheDocument();
    });

    it('renders activity tracking buttons', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Reset Activity')).toBeInTheDocument();
      expect(screen.getByText('View Activity Log')).toBeInTheDocument();
    });

    it('renders detailed activity tracking checkbox', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByLabelText('Enable detailed activity tracking')).toBeInTheDocument();
    });

    it('calls handleChange when login attempts input changes', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const triesInput = screen.getByLabelText('Login Attempts');
      fireEvent.change(triesInput, { target: { value: '5' } });
      expect(defaultProps.handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays login attempts value from formData', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, tries: 3 }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByLabelText('Login Attempts')).toHaveValue(3);
    });

    it('shows error message for login attempts when error exists', () => {
      const propsWithError = {
        ...defaultProps,
        errors: { tries: 'Invalid number of attempts' }
      };
      render(<UserActivitySettings {...propsWithError} />);
      expect(screen.getByText('Invalid number of attempts')).toBeInTheDocument();
      expect(screen.getByLabelText('Login Attempts')).toHaveClass('is-invalid');
    });

    it('has detailed activity tracking checked by default', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const activityCheckbox = screen.getByLabelText('Enable detailed activity tracking');
      expect(activityCheckbox).toBeChecked();
    });

    it('calls window.confirm when Reset Activity button is clicked', () => {
      window.confirm.mockReturnValue(true);
      render(<UserActivitySettings {...defaultProps} />);
      const resetButton = screen.getByText('Reset Activity');
      fireEvent.click(resetButton);
      expect(window.confirm).toHaveBeenCalledWith('Reset all activity data? This will clear last login, last action, and login attempts.');
    });

    it('does not call confirm when Reset Activity button is clicked and disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      const resetButton = screen.getByText('Reset Activity');
      fireEvent.click(resetButton);
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('login attempts input has min and max attributes', () => {
      render(<UserActivitySettings {...defaultProps} />);
      const triesInput = screen.getByLabelText('Login Attempts');
      expect(triesInput).toHaveAttribute('min', '0');
      expect(triesInput).toHaveAttribute('max', '100');
    });
  });

  describe('Current Settings Summary Section', () => {
    it('renders language summary', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Language:')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('renders last app summary', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Last App:')).toBeInTheDocument();
      expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
    });

    it('renders failed logins summary', () => {
      render(<UserActivitySettings {...defaultProps} />);
      expect(screen.getByText('Failed Logins:')).toBeInTheDocument();
      expect(screen.getByText('0 attempts')).toBeInTheDocument();
    });

    it('displays selected language in summary', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, lan: 'es' }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByText('Spanish')).toBeInTheDocument();
    });

    it('displays last app in summary', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, last_app: '1' }
      };
      render(<UserActivitySettings {...propsWithData} />);
      expect(screen.getByText('App #1')).toBeInTheDocument();
    });

    it('displays login attempts in summary with danger class when > 3', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, tries: 5 }
      };
      render(<UserActivitySettings {...propsWithData} />);
      const attemptsElement = screen.getByText('5 attempts');
      expect(attemptsElement).toHaveClass('text-danger');
    });

    it('displays login attempts in summary without danger class when ≤ 3', () => {
      const propsWithData = {
        ...defaultProps,
        formData: { ...defaultProps.formData, tries: 2 }
      };
      render(<UserActivitySettings {...propsWithData} />);
      const attemptsElement = screen.getByText('2 attempts');
      expect(attemptsElement).not.toHaveClass('text-danger');
    });
  });

  describe('Disabled State', () => {
    it('disables language select when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Language Preference *')).toBeDisabled();
    });

    it('disables date format select when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Date Format')).toBeDisabled();
    });

    it('disables last app select when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Last Application Used')).toBeDisabled();
    });

    it('disables auto logout toggle when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Auto Logout')).toBeDisabled();
    });

    it('disables login attempts input when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      expect(screen.getByLabelText('Login Attempts')).toBeDisabled();
    });

    it('disables reset activity button when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      const resetButton = screen.getByText('Reset Activity');
      expect(resetButton).toBeDisabled();
    });

    it('disables activity tracking checkbox when disabled', () => {
      render(<UserActivitySettings {...defaultProps} disabled={true} />);
      const activityCheckbox = screen.getByLabelText('Enable detailed activity tracking');
      expect(activityCheckbox).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has correct label associations', () => {
      render(<UserActivitySettings {...defaultProps} />);

      expect(screen.getByLabelText('Language Preference *')).toHaveAttribute('id', 'lan');
      expect(screen.getByLabelText('Last Application Used')).toHaveAttribute('id', 'last_app');
      expect(screen.getByLabelText('Last Database Used')).toHaveAttribute('id', 'last_db');
      expect(screen.getByLabelText('Auto Logout')).toHaveAttribute('id', 'auto_logout');
      expect(screen.getByLabelText('Email Notifications')).toHaveAttribute('id', 'email_notifications');
      expect(screen.getByLabelText('Login Attempts')).toHaveAttribute('id', 'tries');
    });

    it('has correct name attributes for controlled inputs', () => {
      render(<UserActivitySettings {...defaultProps} />);

      expect(screen.getByLabelText('Language Preference *')).toHaveAttribute('name', 'lan');
      expect(screen.getByLabelText('Last Application Used')).toHaveAttribute('name', 'last_app');
      expect(screen.getByLabelText('Last Database Used')).toHaveAttribute('name', 'last_db');
      expect(screen.getByLabelText('Auto Logout')).toHaveAttribute('name', 'auto_logout');
      expect(screen.getByLabelText('Email Notifications')).toHaveAttribute('name', 'email_notifications');
      expect(screen.getByLabelText('Login Attempts')).toHaveAttribute('name', 'tries');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty appOptions', () => {
      const propsWithoutApps = {
        ...defaultProps,
        appOptions: []
      };
      render(<UserActivitySettings {...propsWithoutApps} />);
      expect(screen.getByLabelText('Last Application Used')).toBeInTheDocument();
      expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
    });

    it('handles empty dbOptions', () => {
      const propsWithoutDBs = {
        ...defaultProps,
        dbOptions: []
      };
      render(<UserActivitySettings {...propsWithoutDBs} />);
      expect(screen.getByLabelText('Last Database Used')).toBeInTheDocument();
      expect(screen.getAllByText('Not specified').length).toBeGreaterThan(0);
    });

    it('handles missing formData values gracefully', () => {
      const propsWithoutFormData = {
        ...defaultProps,
        formData: {}
      };
      render(<UserActivitySettings {...propsWithoutFormData} />);

      // Should still render without errors
      expect(screen.getByText('Activity & Usage Settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Language Preference *')).toHaveValue('en');
    });
  });
});