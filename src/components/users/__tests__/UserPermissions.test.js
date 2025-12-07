/**
 * UserPermissions.test.jsx
 * -------------------------
 * Tests for UserPermissions component
 */

import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UserPermissions } from '../UserPermissions.jsx';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../NavBar', () => () => <div data-testid="navbar">NavBar</div>);

// Mock fetch globally
global.fetch = jest.fn();

const mockJwtToken = 'mock-jwt-token';
const mockUserId = '123';
const mockUserInfo = {
  first_name: 'John',
  last_name: 'Doe',
  role: 'Administrator',
};

const mockPermissions = [
  {
    id: 1,
    name: 'Create Users',
    code: 'user.create',
    description: 'Permission to create new users',
    category: 'User Management',
    granted: true,
  },
  {
    id: 2,
    name: 'Edit Users',
    code: 'user.edit',
    description: 'Permission to edit existing users',
    category: 'User Management',
    granted: false,
  },
  {
    id: 3,
    name: 'System Configuration',
    code: 'system.config',
    description: 'Permission to configure system settings',
    category: 'System',
    granted: true,
  },
];

describe('UserPermissions Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock environment variable
    process.env.REACT_APP_BACKEND_URL = 'http://mock-backend.com';

    // Default mocks
    require('react-router-dom').useParams.mockReturnValue({ id: mockUserId });
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('../../../context/AuthContext').useAuth.mockReturnValue({ jwtToken: mockJwtToken });

    // Reset fetch mocks
    global.fetch.mockReset();
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <UserPermissions />
      </BrowserRouter>
    );
  };

  describe('Initial State and Loading', () => {
    it('should show loading spinner when data is being fetched', () => {
      // Don't resolve fetch immediately
      global.fetch.mockImplementation(() => new Promise(() => {}));

      renderComponent();

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading permissions...')).toBeInTheDocument();
    });

    it('should not fetch data if jwtToken is not available', () => {
      require('../../../context/AuthContext').useAuth.mockReturnValue({ jwtToken: null });

      renderComponent();

      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch user info and permissions on mount', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });

      renderComponent();

      await waitFor(() => {
        expect(global.fetch.mock.calls).toEqual([
          [
            `${process.env.REACT_APP_BACKEND_URL}/users/${mockUserId}`,
            {
              headers: { Authorization: `Bearer ${mockJwtToken}` },
            },
          ],
          [
            `${process.env.REACT_APP_BACKEND_URL}/users/${mockUserId}/permissions`,
            {
              headers: { Authorization: `Bearer ${mockJwtToken}` },
            },
          ],
        ]);
      });
    });

    it('should handle API errors gracefully', async () => {
      console.error = jest.fn();
      global.fetch.mockRejectedValue(new Error('API Error'));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No permissions configured')).toBeInTheDocument();
      });

      expect(console.error).toHaveBeenCalledWith('Error fetching permissions:', expect.any(Error));
    });

    it('should handle non-array permissions response', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ error: 'Invalid data' }),
        });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No permissions configured')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering User Info', () => {
    beforeEach(() => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    it('should display user information correctly', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      expect(screen.getByText('User Permissions')).toBeInTheDocument();

      // Find the paragraph containing user info
      const userInfoParagraph = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'p' &&
               element.className.includes('text-muted') &&
               content.includes('John Doe') &&
               content.includes('Administrator');
      });

      expect(userInfoParagraph).toBeInTheDocument();
      expect(userInfoParagraph.textContent).toContain('John Doe');
      expect(userInfoParagraph.textContent).toContain('Administrator');
    });

    it('should display NavBar component', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should render back button that navigates to user page', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      const backButton = screen.getByText('Back to User');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/user/${mockUserId}`);
    });
  });

  describe('Permissions Table', () => {
    beforeEach(() => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    it('should display all permissions in a table', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Get the table body
      const table = screen.getByRole('table');
      const tableBody = within(table).getAllByRole('rowgroup')[1]; // tbody is second rowgroup

      // Get all rows in the table body
      const rows = within(tableBody).getAllByRole('row');

      // Check each permission appears in a row
      const rowTexts = rows.map(row => row.textContent);

      expect(rowTexts.some(text => text.includes('Create Users') && text.includes('user.create'))).toBe(true);
      expect(rowTexts.some(text => text.includes('Edit Users') && text.includes('user.edit'))).toBe(true);
      expect(rowTexts.some(text => text.includes('System Configuration') && text.includes('system.config'))).toBe(true);
    });

    it('should display correct permission status badges', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Find badges in the table
      const table = screen.getByRole('table');
      const grantedBadges = within(table).getAllByText('Granted');
      const deniedBadges = within(table).getAllByText('Denied');

      expect(grantedBadges).toHaveLength(2); // Create Users and System Configuration
      expect(deniedBadges).toHaveLength(1); // Edit Users
    });

    it('should display permission categories as badges', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      const table = screen.getByRole('table');

      // Check categories appear in the table
      expect(within(table).getAllByText('User Management')).toHaveLength(2);
      expect(within(table).getByText('System')).toBeInTheDocument();
    });

    it('should show permission count in footer', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      expect(screen.getByText('2 of 3 permissions granted')).toBeInTheDocument();
    });
  });

  describe('Permission Interactions', () => {
    beforeEach(() => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    it('should toggle permission checkbox when clicked', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Get checkboxes from the main permissions table
      const table = screen.getByRole('table');
      const tableBody = within(table).getAllByRole('rowgroup')[1];
      const rows = within(tableBody).getAllByRole('row');

      // Find Edit Users row
      const editUserRow = rows.find(row =>
        row.textContent.includes('Edit Users')
      );
      const editUserCheckbox = within(editUserRow).getByRole('checkbox');

      // Initially unchecked
      expect(editUserCheckbox).not.toBeChecked();

      // Click to check
      fireEvent.click(editUserCheckbox);
      expect(editUserCheckbox).toBeChecked();

      // Click to uncheck
      fireEvent.click(editUserCheckbox);
      expect(editUserCheckbox).not.toBeChecked();
    });

    it('should update permission status badge when toggled', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Get the table
      const table = screen.getByRole('table');
      const tableBody = within(table).getAllByRole('rowgroup')[1];
      const rows = within(tableBody).getAllByRole('row');

      // Find the row containing Edit Users
      const editUserRow = rows.find(row =>
        row.textContent.includes('Edit Users')
      );

      // Find the badge within the row
      const badge = within(editUserRow).getByText('Denied');
      expect(badge).toHaveClass('bg-secondary');

      // Find the checkbox for Edit Users
      const editUserCheckbox = within(editUserRow).getByRole('checkbox');

      // Toggle permission
      fireEvent.click(editUserCheckbox);

      // Badge should now show "Granted" with success class
      expect(within(editUserRow).getByText('Granted')).toHaveClass('bg-success');
    });

    it('should update granted count in footer when permissions change', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Get the table
      const table = screen.getByRole('table');
      const tableBody = within(table).getAllByRole('rowgroup')[1];
      const rows = within(tableBody).getAllByRole('row');

      // Find rows
      const editUserRow = rows.find(row =>
        row.textContent.includes('Edit Users')
      );
      const createUserRow = rows.find(row =>
        row.textContent.includes('Create Users')
      );

      // Get checkboxes
      const editUserCheckbox = within(editUserRow).getByRole('checkbox');
      const createUserCheckbox = within(createUserRow).getByRole('checkbox');

      // Initial count: 2 of 3
      expect(screen.getByText('2 of 3 permissions granted')).toBeInTheDocument();

      // Grant Edit Users permission
      fireEvent.click(editUserCheckbox);
      expect(screen.getByText('3 of 3 permissions granted')).toBeInTheDocument();

      // Revoke Create Users permission
      fireEvent.click(createUserCheckbox);
      expect(screen.getByText('2 of 3 permissions granted')).toBeInTheDocument();
    });
  });

  describe('Save Permissions', () => {
    let originalAlert;

    beforeEach(() => {
      originalAlert = global.alert;
      global.alert = jest.fn();

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    afterEach(() => {
      global.alert = originalAlert;
    });

    it('should call save API with updated permissions', async () => {
      // Mock the save API call
      global.fetch.mockResolvedValueOnce({
        ok: true,
      });

      renderComponent();
      await screen.findByText('Permission Matrix');

      // Get table and find Edit Users row
      const table = screen.getByRole('table');
      const tableBody = within(table).getAllByRole('rowgroup')[1];
      const rows = within(tableBody).getAllByRole('row');
      const editUserRow = rows.find(row =>
        row.textContent.includes('Edit Users')
      );
      const editUserCheckbox = within(editUserRow).getByRole('checkbox');

      // Toggle permission
      fireEvent.click(editUserCheckbox);

      // Click save button
      const saveButton = screen.getByText('Save Permissions');
      fireEvent.click(saveButton);

      // Wait for the API call to be made
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(3); // 2 initial fetches + 1 save
      });

      // Check the save API call specifically
      const saveCall = global.fetch.mock.calls[2]; // Third call is the save
      expect(saveCall[0]).toBe(
        `${process.env.REACT_APP_BACKEND_URL}/users/${mockUserId}/permissions`
      );

      // Parse the body to compare actual data
      const requestBody = JSON.parse(saveCall[1].body);
      const editUserPermission = requestBody.permissions.find(p => p.id === 2);

      expect(saveCall[1]).toEqual({
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${mockJwtToken}`,
          'Content-Type': 'application/json',
        },
        body: expect.any(String),
      });

      expect(editUserPermission).toBeDefined();
      expect(editUserPermission.granted).toBe(true);
      expect(global.alert).toHaveBeenCalledWith('Permissions updated successfully!');
    });

    it('should handle save API error', async () => {
      // Mock the save API call to fail
      global.fetch.mockResolvedValueOnce({
        ok: false,
      });

      renderComponent();
      await screen.findByText('Permission Matrix');

      const saveButton = screen.getByText('Save Permissions');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Failed to update permissions');
      });
    });

    it('should handle network error during save', async () => {
      console.error = jest.fn();

      // Mock the save API call to reject
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      renderComponent();
      await screen.findByText('Permission Matrix');

      const saveButton = screen.getByText('Save Permissions');
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(console.error).toHaveBeenCalledWith('Error saving permissions:', expect.any(Error));
      });

      expect(global.alert).toHaveBeenCalledWith('Error saving permissions');
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no permissions are returned', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('No permissions configured')).toBeInTheDocument();
      });

      expect(screen.getByText("This user doesn't have any specific permissions assigned.")).toBeInTheDocument();
    });
  });

  describe('Permission Groups Section', () => {
    beforeEach(() => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    it('should render permission groups cards', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      // Use more specific queries for card headers
      const cardHeaders = screen.getAllByRole('heading', { level: 6 });
      const cardHeaderTexts = cardHeaders.map(header => header.textContent);

      expect(cardHeaderTexts).toContain('System Permissions');
      expect(cardHeaderTexts).toContain('User Management');
      expect(cardHeaderTexts).toContain('Data Access');

      // Check for specific permission checkboxes in groups
      expect(screen.getByLabelText('System Administration')).toBeInTheDocument();
      expect(screen.getByLabelText('Create Users')).toBeInTheDocument();
      expect(screen.getByLabelText('Read Data')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockUserInfo,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockPermissions,
        });
    });

    it('should navigate to user page when cancel button is clicked', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/user/${mockUserId}`);
    });

    it('should navigate to user page when back button is clicked', async () => {
      renderComponent();
      await screen.findByText('Permission Matrix');

      const backButton = screen.getByText('Back to User');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(`/user/${mockUserId}`);
    });
  });
});