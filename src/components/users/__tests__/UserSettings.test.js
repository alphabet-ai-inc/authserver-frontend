/**
 * UserSettings.test.jsx
 * ----------------------
 * Tests for UserSettings component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserSettings } from '../UserSettings.jsx';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

// Mock alert globally
global.alert = jest.fn();

const mockUserId = '123';

describe('UserSettings Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mocks
    require('react-router-dom').useParams.mockReturnValue({ id: mockUserId });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserSettings />
      </BrowserRouter>
    );
  };

  describe('Initial Render', () => {
    it('should render the component with correct title and description', () => {
      renderComponent();

      expect(screen.getByText('User Settings')).toBeInTheDocument();
      expect(screen.getByText('Personal preferences and configuration')).toBeInTheDocument();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render navigation sidebar with correct items', () => {
      renderComponent();

      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Interface')).toBeInTheDocument();
      expect(screen.getByText('Privacy')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });

    it('should render back button that navigates to user page', () => {
      renderComponent();

      const backButton = screen.getByText('Back to User');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/user/${mockUserId}`);
    });
  });

  describe('Notification Settings', () => {
    it('should render notification settings section', () => {
      renderComponent();

      expect(screen.getByText('Notification Settings')).toBeInTheDocument();

      expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Desktop Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Auto-save Changes')).toBeInTheDocument();
    });

    it('should have correct default values for notification settings', () => {
      renderComponent();

      const emailNotifications = screen.getByLabelText('Email Notifications');
      const desktopNotifications = screen.getByLabelText('Desktop Notifications');
      const autoSave = screen.getByLabelText('Auto-save Changes');

      expect(emailNotifications).toBeChecked();
      expect(desktopNotifications).not.toBeChecked();
      expect(autoSave).toBeChecked();
    });

    it('should toggle email notifications switch', () => {
      renderComponent();

      const emailSwitch = screen.getByLabelText('Email Notifications');

      expect(emailSwitch).toBeChecked();

      fireEvent.click(emailSwitch);
      expect(emailSwitch).not.toBeChecked();

      fireEvent.click(emailSwitch);
      expect(emailSwitch).toBeChecked();
    });

    it('should toggle desktop notifications switch', () => {
      renderComponent();

      const desktopSwitch = screen.getByLabelText('Desktop Notifications');

      expect(desktopSwitch).not.toBeChecked();

      fireEvent.click(desktopSwitch);
      expect(desktopSwitch).toBeChecked();

      fireEvent.click(desktopSwitch);
      expect(desktopSwitch).not.toBeChecked();
    });

    it('should show description text for each setting', () => {
      renderComponent();

      expect(screen.getByText('Receive notifications via email')).toBeInTheDocument();
      expect(screen.getByText('Show desktop notifications')).toBeInTheDocument();
      expect(screen.getByText('Automatically save changes every 5 minutes')).toBeInTheDocument();
    });
  });

  describe('Interface Settings', () => {
    it('should render interface settings section', () => {
      renderComponent();

      expect(screen.getByText('Interface Settings')).toBeInTheDocument();

      expect(screen.getByText('Theme')).toBeInTheDocument();
      expect(screen.getByText('Language')).toBeInTheDocument();
      expect(screen.getByText('Timezone')).toBeInTheDocument();
      expect(screen.getByText('Date Format')).toBeInTheDocument();
    });

    it('should have correct default values for interface settings', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');

      expect(selectElements[0]).toHaveValue('light');
      expect(selectElements[1]).toHaveValue('en');
      expect(selectElements[2]).toHaveValue('UTC');
      expect(selectElements[3]).toHaveValue('yyyy-mm-dd');
    });

    it('should change theme selection', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');
      const themeSelect = selectElements[0];

      fireEvent.change(themeSelect, { target: { value: 'dark' } });
      expect(themeSelect).toHaveValue('dark');

      fireEvent.change(themeSelect, { target: { value: 'auto' } });
      expect(themeSelect).toHaveValue('auto');

      fireEvent.change(themeSelect, { target: { value: 'light' } });
      expect(themeSelect).toHaveValue('light');
    });

    it('should have all theme options available', () => {
      renderComponent();

      // Check option texts are rendered somewhere on the page
      expect(screen.getByText('Light Theme')).toBeInTheDocument();
      expect(screen.getByText('Dark Theme')).toBeInTheDocument();
      expect(screen.getByText('Auto (System Preference)')).toBeInTheDocument();
    });

    it('should change language selection', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');
      const languageSelect = selectElements[1];

      fireEvent.change(languageSelect, { target: { value: 'es' } });
      expect(languageSelect).toHaveValue('es');

      fireEvent.change(languageSelect, { target: { value: 'fr' } });
      expect(languageSelect).toHaveValue('fr');
    });

    it('should have all language options available', () => {
      renderComponent();

      expect(screen.getByText('English')).toBeInTheDocument();
      expect(screen.getByText('Spanish')).toBeInTheDocument();
      expect(screen.getByText('French')).toBeInTheDocument();
      expect(screen.getByText('German')).toBeInTheDocument();
    });

    it('should change timezone selection', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');
      const timezoneSelect = selectElements[2];

      fireEvent.change(timezoneSelect, { target: { value: 'EST' } });
      expect(timezoneSelect).toHaveValue('EST');

      fireEvent.change(timezoneSelect, { target: { value: 'PST' } });
      expect(timezoneSelect).toHaveValue('PST');
    });

    it('should have all timezone options available', () => {
      renderComponent();

      expect(screen.getByText('UTC')).toBeInTheDocument();
      expect(screen.getByText('Eastern Time')).toBeInTheDocument();
      expect(screen.getByText('Central Time')).toBeInTheDocument();
      expect(screen.getByText('Pacific Time')).toBeInTheDocument();
    });

    it('should change date format selection', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');
      const dateFormatSelect = selectElements[3];

      fireEvent.change(dateFormatSelect, { target: { value: 'mm/dd/yyyy' } });
      expect(dateFormatSelect).toHaveValue('mm/dd/yyyy');

      fireEvent.change(dateFormatSelect, { target: { value: 'dd/mm/yyyy' } });
      expect(dateFormatSelect).toHaveValue('dd/mm/yyyy');
    });

    it('should have all date format options available', () => {
      renderComponent();

      expect(screen.getByText('MM/DD/YYYY')).toBeInTheDocument();
      expect(screen.getByText('DD/MM/YYYY')).toBeInTheDocument();
      expect(screen.getByText('YYYY-MM-DD')).toBeInTheDocument();
    });
  });

  describe('Action Buttons', () => {
    it('should render save and cancel buttons', () => {
      renderComponent();

      expect(screen.getByText('Save Settings')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    it('should show success alert when save button is clicked', () => {
      renderComponent();

      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);

      expect(global.alert).toHaveBeenCalledWith('Settings saved successfully!');
    });

    it('should navigate to user page when cancel button is clicked', () => {
      renderComponent();

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/user/${mockUserId}`);
    });
  });

  describe('Settings Persistence', () => {
    it('should maintain settings state when toggling switches', () => {
      renderComponent();

      const desktopSwitch = screen.getByLabelText('Desktop Notifications');
      const autoSaveSwitch = screen.getByLabelText('Auto-save Changes');

      fireEvent.click(desktopSwitch);
      fireEvent.click(autoSaveSwitch);

      expect(desktopSwitch).toBeChecked();
      expect(autoSaveSwitch).not.toBeChecked();

      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);
      expect(global.alert).toHaveBeenCalledWith('Settings saved successfully!');
    });

    it('should maintain settings state when changing dropdowns', () => {
      renderComponent();

      const selectElements = screen.getAllByRole('combobox');
      const themeSelect = selectElements[0];
      const languageSelect = selectElements[1];

      fireEvent.change(themeSelect, { target: { value: 'dark' } });
      fireEvent.change(languageSelect, { target: { value: 'es' } });

      expect(themeSelect).toHaveValue('dark');
      expect(languageSelect).toHaveValue('es');

      const saveButton = screen.getByText('Save Settings');
      fireEvent.click(saveButton);
      expect(global.alert).toHaveBeenCalledWith('Settings saved successfully!');
    });
  });

  describe('Navigation Sidebar', () => {
    it('should have notifications tab active by default', () => {
      renderComponent();

      const notificationsButton = screen.getByText('Notifications');

      expect(notificationsButton).toBeInTheDocument();
      expect(notificationsButton).toHaveClass('active');
    });

    it('should allow clicking on sidebar items', () => {
      renderComponent();

      const privacyButton = screen.getByText('Privacy');
      const securityButton = screen.getByText('Security');

      fireEvent.click(privacyButton);
      fireEvent.click(securityButton);

      expect(privacyButton).toBeInTheDocument();
      expect(securityButton).toBeInTheDocument();
    });
  });

  describe('Component Structure', () => {
    it('should have proper form elements with correct attributes', () => {
      renderComponent();

      const switches = screen.getAllByRole('switch');
      expect(switches).toHaveLength(3);

      switches.forEach(switchElement => {
        expect(switchElement).toHaveAttribute('type', 'checkbox');
        expect(switchElement).toHaveClass('form-check-input');
      });

      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(4);

      selects.forEach(selectElement => {
        expect(selectElement).toHaveClass('form-select');
      });
    });
  });
});