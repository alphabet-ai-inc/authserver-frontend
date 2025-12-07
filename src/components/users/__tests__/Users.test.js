/**
 * Users Component Tests
 * Tests for the Users component and its subcomponents
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Users } from '../Users';
import { useAuth } from '../../../context/AuthContext';

// Mock dependencies FIRST, before any imports that use them
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../NavBar', () => () => <div data-testid="navbar">NavBar Mock</div>);

// Create mock navigate function
const mockNavigate = jest.fn();

// Mock react-router-dom
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');

  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }) => (
      <a href={to} {...props} data-testid={`link-${to}`}>
        {children}
      </a>
    ),
    useLocation: () => ({ pathname: '/users' }),
  };
});

// Mock fetch globally
global.fetch = jest.fn();

// Test data
const mockUsers = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
    role: 'admin',
    active: true,
    blocked: false,
    code: 'JD001',
    last_login: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    last_action: 'Logged in'
  },
  {
    id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    email: 'jane@example.com',
    role: 'user',
    active: false,
    blocked: true,
    code: 'JS002',
    last_login: null,
    last_action: null
  },
  {
    id: 3,
    first_name: 'Bob',
    last_name: 'Johnson',
    email: 'bob@example.com',
    role: 'user',
    active: true,
    blocked: false,
    code: 'BJ003',
    last_login: Math.floor(Date.now() / 1000) - 86400, // 1 day ago
    last_action: 'Updated profile'
  }
];

describe('Users Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth context
    useAuth.mockReturnValue({
      jwtToken: 'mock-jwt-token'
    });

    // Default fetch mock
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers
    });

    // Mock environment variable
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:8080';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Authentication', () => {
    it('redirects to login when jwtToken is empty', async () => {
      useAuth.mockReturnValue({ jwtToken: '' });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login');

      await waitFor(() => {
        expect(fetch).not.toHaveBeenCalled();
      });
    });

    it('does not redirect when jwtToken exists', async () => {
      useAuth.mockReturnValue({ jwtToken: 'valid-token' });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(mockNavigate).not.toHaveBeenCalledWith('/login');
      });

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('API Integration', () => {
    it('fetches users on mount with correct headers', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        // The Headers object in the actual component creates a Headers instance
        // which has different structure than a plain object
        expect(global.fetch).toHaveBeenCalledWith(
          'http://localhost:8080/users',
          expect.objectContaining({
            method: 'GET',
            headers: expect.any(Headers) // Accept any Headers instance
          })
        );
      });

      // Additional check for header values
      const fetchCall = global.fetch.mock.calls[0];
      const headers = fetchCall[1].headers;

      // Check that headers contain the expected values
      expect(headers.get('Authorization')).toBe('Bearer mock-jwt-token');
      expect(headers.get('Content-Type')).toBe('application/json');
    });

    it('handles successful API response', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });
    });

    it('handles API error gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Error Loading Users')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to load users. Please try again later.')).toBeInTheDocument();
      });
    });

    it('handles non-array API response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ error: 'Invalid data' })
      });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Get started by adding your first user')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering States', () => {
    it('shows loading state initially', () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      expect(screen.getByText('Loading users...')).toBeInTheDocument();

      return waitFor(() => {
        expect(screen.queryByText('Loading users...')).not.toBeInTheDocument();
      });
    });

    it('shows empty state when no users', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => []
      });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('No users found')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Get started by adding your first user')).toBeInTheDocument();
      });
    });

    it('renders navbar', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      expect(screen.getByTestId('navbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });
    });
  });

  describe('Filtering Functionality', () => {
    it('filters users when "Active Only" is checked', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Showing 3 of 3 users')).toBeInTheDocument();
      });

      const filterSwitch = screen.getByLabelText('Active Only');
      fireEvent.click(filterSwitch);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Showing 2 of 3 users')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('navigates to add user page when "Add New User" button in sticky bar is clicked', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(fetch).toHaveBeenCalled();
      });

      const addButtons = screen.getAllByText('Add New User');
      fireEvent.click(addButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/edituser/0');
    });

    it('navigates to edit user page when edit button is clicked', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      expect(screen.getByTestId('link-/edituser/1')).toBeInTheDocument();
      expect(screen.getByTestId('link-/edituser/2')).toBeInTheDocument();
      expect(screen.getByTestId('link-/edituser/3')).toBeInTheDocument();
    });

    it('calls navigate when view details button is clicked', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const viewButtons = screen.getAllByTitle('View Details');
      fireEvent.click(viewButtons[0]);

      expect(mockNavigate).toHaveBeenCalledWith('/user/1');
    });

    it('calls window.history.back when back button is clicked', async () => {
      const mockBack = jest.fn();
      Object.defineProperty(window, 'history', {
        value: { back: mockBack },
        configurable: true
      });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Back')).toBeInTheDocument();
      });

      const backButton = screen.getByText('Back');
      fireEvent.click(backButton);

      expect(mockBack).toHaveBeenCalled();
    });
  });

  describe('Subcomponents', () => {
    it('renders UserStatusBadge correctly', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getAllByText('Active')).toHaveLength(2);
      });

      await waitFor(() => {
        expect(screen.getByText('Inactive')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Blocked')).toBeInTheDocument();
      });
    });

    it('renders LastActivity correctly', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Logged in')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Updated profile')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getAllByText('—').length).toBeGreaterThan(0);
      });
    });

    it('renders statistics cards', async () => {
      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Total Users')).toBeInTheDocument();
      });

      const totalUsersElements = screen.getAllByText('3');
      expect(totalUsersElements.length).toBeGreaterThan(0);

      await waitFor(() => {
        expect(screen.getByText('Active Users')).toBeInTheDocument();
      });

      const number2Elements = screen.getAllByText('2');
      expect(number2Elements.length).toBe(2);

      await waitFor(() => {
        expect(screen.getByText('Blocked Users')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Recent Logins (7d)')).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles user with missing data', async () => {
      const incompleteUser = {
        id: 4,
        first_name: null,
        last_name: null,
        email: null,
        role: null,
        active: null,
        blocked: null,
        code: null,
        last_login: null,
        last_action: null
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [incompleteUser]
      });

      render(
        <MemoryRouter>
          <Users />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Managing 1 user')).toBeInTheDocument();
      });

      // Use a custom text matcher to find "ID: 4" in the DOM
      await waitFor(() => {
        const elementsWithId = screen.getAllByText((content, element) => {
          // Check if element's text content includes "ID: 4"
          const text = element?.textContent || '';
          return text.includes('ID: 4');
        });

        expect(elementsWithId.length).toBeGreaterThan(0);
      });

      // For a user with all null values, we expect at least 2 em-dash elements:
      // 1. Code: —
      // 2. Email: —
      // 3. Last Action: —
      // The role shows "No role" instead of —
      const emptyElements = screen.getAllByText('—');
      expect(emptyElements.length).toBeGreaterThanOrEqual(2);

      // Also check for "No role" which appears instead of —
      expect(screen.getByText('No role')).toBeInTheDocument();
    });
  });
});

// Define UsersStickyActionBar component for testing (outside describe blocks)
const UsersStickyActionBar = ({ userCount, onAddNew, filterActive, onFilterToggle }) => (
  <div data-testid="sticky-action-bar">
    <h4>User Management</h4>
    <div data-testid="user-count">
      {userCount === 0 ? 'No users found' : `Managing ${userCount} ${userCount === 1 ? 'user' : 'users'}`}
    </div>
    <button data-testid="add-user-button" onClick={onAddNew}>Add New User</button>
    <input
      type="checkbox"
      data-testid="filter-switch"
      checked={filterActive}
      onChange={onFilterToggle}
      aria-label="Active Only"
    />
  </div>
);

// Export for external testing if needed
export { UsersStickyActionBar };