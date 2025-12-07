// src/components/users/FormSections/__tests__/UserAccessPermissions.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import { UserAccessPermissions } from '../UserAccessPermissions.jsx';

describe('UserAccessPermissions Component', () => {
  const defaultFormData = {
    role: '',
    profile_id: '',
    group_id: ''
  };

  const defaultErrors = {};

  const defaultProps = {
    formData: defaultFormData,
    errors: defaultErrors,
    handleChange: jest.fn(),
    disabled: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render section title and description', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      expect(screen.getByText('Access & Permissions')).toBeInTheDocument();
      expect(screen.getByText(/Configure user roles, profiles, and group memberships for access control/)).toBeInTheDocument();
    });

    it('should render all three main sections', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      expect(screen.getByText('Role Assignment')).toBeInTheDocument();
      expect(screen.getByText('Profile & Group Settings')).toBeInTheDocument();
      expect(screen.getByText('Permission Summary')).toBeInTheDocument();
    });
  });

  describe('Role Assignment Section', () => {
    it('should render primary role dropdown with default options', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      const roleSelect = screen.getByTestId('primary-role-select');
      expect(roleSelect).toBeInTheDocument();
      expect(roleSelect.tagName).toBe('SELECT');

      expect(screen.getByText('Select Role')).toBeInTheDocument();
      expect(screen.getByText('Administrator - Full system access')).toBeInTheDocument();
      expect(screen.getByText('Manager - Department management access')).toBeInTheDocument();
      expect(screen.getByText('Standard User - Regular user access')).toBeInTheDocument();
      expect(screen.getByText('Viewer - Read-only access')).toBeInTheDocument();
      expect(screen.getByText('Guest - Limited temporary access')).toBeInTheDocument();
    });

    it('should render secondary roles multi-select', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      const secondarySelect = screen.getByTestId('secondary-roles-select');
      expect(secondarySelect).toBeInTheDocument();
      expect(secondarySelect).toHaveAttribute('multiple');
      expect(screen.getByText('Hold Ctrl/Cmd to select multiple roles')).toBeInTheDocument();
    });

    it('should display error for role field when error exists', () => {
      const errors = { role: 'Role is required' };
      render(<UserAccessPermissions {...defaultProps} errors={errors} />);

      expect(screen.getByText('Role is required')).toBeInTheDocument();
      expect(screen.getByTestId('primary-role-select')).toHaveClass('is-invalid');
    });

    it('should use custom role options when provided', () => {
      const customRoles = [
        { id: 'superadmin', name: 'Super Admin', description: 'Highest level access' },
        { id: 'moderator', name: 'Moderator', description: 'Content moderation access' }
      ];

      render(<UserAccessPermissions {...defaultProps} roleOptions={customRoles} />);

      expect(screen.getByText('Super Admin - Highest level access')).toBeInTheDocument();
      expect(screen.getByText('Moderator - Content moderation access')).toBeInTheDocument();
      expect(screen.queryByText('Administrator - Full system access')).not.toBeInTheDocument();
    });
  });

  describe('Profile & Group Settings Section', () => {
    it('should render profile dropdown with default options', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      const profileSelect = screen.getByTestId('profile-select');
      expect(profileSelect).toBeInTheDocument();

      expect(screen.getByText('Select Profile')).toBeInTheDocument();
      expect(screen.getByText('System Admin')).toBeInTheDocument();
      expect(screen.getByText('Content Manager')).toBeInTheDocument();
      expect(screen.getByText('Data Analyst')).toBeInTheDocument();
    });

    it('should render group dropdown with default options', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      const groupSelect = screen.getByTestId('group-select');
      expect(groupSelect).toBeInTheDocument();

      expect(screen.getByText('Select Group')).toBeInTheDocument();
      expect(screen.getByText('Administrators (System)')).toBeInTheDocument();
      expect(screen.getByText('Managers (Management)')).toBeInTheDocument();
      expect(screen.getByText('Developers (Technical)')).toBeInTheDocument();
    });

    it('should display errors for profile and group fields', () => {
      const errors = {
        profile_id: 'Profile is required',
        group_id: 'Group is required'
      };

      render(<UserAccessPermissions {...defaultProps} errors={errors} />);

      expect(screen.getByText('Profile is required')).toBeInTheDocument();
      expect(screen.getByText('Group is required')).toBeInTheDocument();
      expect(screen.getByTestId('profile-select')).toHaveClass('is-invalid');
      expect(screen.getByTestId('group-select')).toHaveClass('is-invalid');
    });

    it('should use custom profile and group options when provided', () => {
      const customProfiles = [
        { id: 10, name: 'Custom Profile 1', permissions: 100 },
        { id: 20, name: 'Custom Profile 2', permissions: 200 }
      ];

      const customGroups = [
        { id: 10, name: 'Custom Group 1', type: 'Custom' },
        { id: 20, name: 'Custom Group 2', type: 'Special' }
      ];

      render(
        <UserAccessPermissions
          {...defaultProps}
          profileOptions={customProfiles}
          groupOptions={customGroups}
        />
      );

      expect(screen.getByText('Custom Profile 1')).toBeInTheDocument();
      expect(screen.getByText('Custom Profile 2')).toBeInTheDocument();
      expect(screen.getByText('Custom Group 1 (Custom)')).toBeInTheDocument();
      expect(screen.getByText('Custom Group 2 (Special)')).toBeInTheDocument();
      expect(screen.queryByText('System Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Administrators (System)')).not.toBeInTheDocument();
    });
  });

  describe('Permission Summary Section', () => {
    it('should render permission summary with checkmarks', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      expect(screen.getByText('Current Permissions')).toBeInTheDocument();
      expect(screen.getByText('Access Areas')).toBeInTheDocument();

      expect(screen.getByText('Read Access')).toBeInTheDocument();
      expect(screen.getByText('Write Access')).toBeInTheDocument();
      expect(screen.getByText('Delete Access')).toBeInTheDocument();
      expect(screen.getByText('View Reports')).toBeInTheDocument();
      expect(screen.getByText('Manage Users')).toBeInTheDocument();

      expect(screen.getByTestId('dashboard-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('reports-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('settings-checkbox')).toBeInTheDocument();
      expect(screen.getByTestId('admin-checkbox')).toBeInTheDocument();
    });

    it('should have correct default checked states for checkboxes', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      expect(screen.getByTestId('dashboard-checkbox')).toBeChecked();
      expect(screen.getByTestId('reports-checkbox')).toBeChecked();
      expect(screen.getByTestId('settings-checkbox')).not.toBeChecked();
      expect(screen.getByTestId('admin-checkbox')).not.toBeChecked();
    });
  });

  describe('Form Data Handling', () => {
    it('should display populated form data', () => {
      const formData = {
        role: 'admin',
        profile_id: '1',
        group_id: '2'
      };

      render(<UserAccessPermissions {...defaultProps} formData={formData} />);

      expect(screen.getByTestId('primary-role-select')).toHaveValue('admin');
      expect(screen.getByTestId('profile-select')).toHaveValue('1');
      expect(screen.getByTestId('group-select')).toHaveValue('2');
    });

    it('should call handleChange when inputs change', () => {
      const handleChange = jest.fn();
      render(<UserAccessPermissions {...defaultProps} handleChange={handleChange} />);

      const roleSelect = screen.getByTestId('primary-role-select');
      fireEvent.change(roleSelect, { target: { value: 'manager' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('Disabled State', () => {
    it('should disable all inputs when disabled prop is true', () => {
      render(<UserAccessPermissions {...defaultProps} disabled={true} />);

      expect(screen.getByTestId('primary-role-select')).toBeDisabled();
      expect(screen.getByTestId('profile-select')).toBeDisabled();
      expect(screen.getByTestId('group-select')).toBeDisabled();
      expect(screen.getByTestId('secondary-roles-select')).toBeDisabled();

      expect(screen.getByTestId('dashboard-checkbox')).toBeDisabled();
      expect(screen.getByTestId('reports-checkbox')).toBeDisabled();
      expect(screen.getByTestId('settings-checkbox')).toBeDisabled();
      expect(screen.getByTestId('admin-checkbox')).toBeDisabled();
    });

    it('should not disable inputs when disabled prop is false', () => {
      render(<UserAccessPermissions {...defaultProps} disabled={false} />);

      expect(screen.getByTestId('primary-role-select')).not.toBeDisabled();
      expect(screen.getByTestId('profile-select')).not.toBeDisabled();
      expect(screen.getByTestId('group-select')).not.toBeDisabled();

      expect(screen.getByTestId('dashboard-checkbox')).not.toBeDisabled();
      expect(screen.getByTestId('reports-checkbox')).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper label associations', () => {
      render(<UserAccessPermissions {...defaultProps} />);

      const roleInput = screen.getByLabelText('Primary Role *');
      expect(roleInput).toHaveAttribute('id', 'role');

      const profileInput = screen.getByLabelText('Profile');
      expect(profileInput).toHaveAttribute('id', 'profile_id');

      const groupInput = screen.getByLabelText('Primary Group');
      expect(groupInput).toHaveAttribute('id', 'group_id');
    });
  });
});