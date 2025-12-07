import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ThisUser } from '../ThisUser';
import { useAuth } from '../../../context/AuthContext';
import Swal from 'sweetalert2';

// Mock external dependencies with corrected paths
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../utils/Unix2Ymd', () => ({
  formatUnixTimestamp: jest.fn((timestamp) =>
    timestamp ? `Formatted: ${timestamp}` : 'Never'
  ),
}));

jest.mock('../../../utils/HandleDel', () => ({
  useHandleDelete: jest.fn(),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

jest.mock('../../NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">NavBar</div>,
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('ThisUser Component', () => {
  const mockNavigate = jest.fn();
  const mockUseHandleDelete = jest.fn();
  const mockSetJwtToken = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup default mocks
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useParams.mockReturnValue({ id: '123' });
    require('../../../utils/HandleDel').useHandleDelete.mockReturnValue(mockUseHandleDelete);

    useAuth.mockReturnValue({
      jwtToken: 'mock-jwt-token',
      sessionChecked: true,
      setJwtToken: mockSetJwtToken,
    });

    // Setup environment variable
    process.env.REACT_APP_BACKEND_URL = 'http://localhost:8080';
  });

  // Helper to render component with MemoryRouter
  const renderComponent = (initialEntries = ['/users/123']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/users/:id" element={<ThisUser />} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/users" element={<div>Users List</div>} />
          <Route path="/edituser/:id" element={<div>Edit User Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Rendering and Initial State', () => {
    it('renders NavBar component', () => {
      // Mock a successful response with minimal user data
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 123 }),
      });

      renderComponent();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('shows loading state initially', () => {
      // Mock a delayed response
      fetch.mockImplementationOnce(() => new Promise(() => {}));

      renderComponent();
      expect(screen.getByText('Loading user data...')).toBeInTheDocument();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('User Data Display', () => {
    const mockUser = {
      id: 123,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      active: true,
      blocked: false,
      role: 'admin',
      code: 'JD001',
      created: 1609459200,
      updated: 1609545600,
      last_login: 1609632000,
      last_try: 1609632000,
      tries: 2,
      profile_id: 1,
      group_id: 10,
      company_id: 100,
      last_session: 'session_abc123',
      last_app: 'CRM',
      last_db: 'PostgreSQL',
      last_action: 'Logged in',
      activation_time: 1609459200,
      dbsauth_id: 'DBS123',
      lan: 'en',
    };

    beforeEach(() => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });
    });

    it('renders sticky action bar with user name when loaded', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Viewing: John Doe')).toBeInTheDocument();
      });
    });

    it('displays user full name and email correctly', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      });
    });

    it('shows user status indicators', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getAllByText('admin').length).toBeGreaterThan(0);
      });
    });
  });

  describe('Authentication and Redirects', () => {
    it('redirects to login when no JWT token', async () => {
      useAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: true,
        setJwtToken: mockSetJwtToken,
      });

      // Mock SweetAlert to return a promise with then method
      const mockPromise = { then: jest.fn() };
      Swal.fire.mockReturnValue(mockPromise);

      renderComponent();

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalled();
      });
    });

    it('shows error message when fetch fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      renderComponent();

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Failed to load user data/);
      });
    });
  });

  describe('User Not Found State', () => {
    it('shows empty state when user not found - returns empty object', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ }),
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('User Not Found')).toBeInTheDocument();
      });
    });

    it('shows empty state when API returns error', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: true, message: 'User not found' }),
      });

      renderComponent();

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('User not found');
      });
    });

    it('has back button in empty state', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ }),
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Back to Users List')).toBeInTheDocument();
      });
    });
  });

  describe('Action Bar Interactions', () => {
    const mockUser = {
      id: 123,
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
    };

    beforeEach(() => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });
    });

    it('edit button navigates to edit page', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Edit User')).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText('Edit User'));
      expect(mockNavigate).toHaveBeenCalledWith('/edituser/123');
    });

    it('delete button is shown for valid user', async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText('Delete')).toBeInTheDocument();
      });
    });
  });

  describe('StatusIndicator Component', () => {
    it('shows active status badge', async () => {
      const mockUser = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        active: true,
        blocked: false,
        role: 'admin'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getAllByText(/active/i).length).toBeGreaterThan(0);
      });
    });

    it('shows blocked status badge', async () => {
      const mockUser = {
        id: 123,
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        active: false,
        blocked: true,
        role: 'user'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getAllByText('Blocked').length).toBeGreaterThan(0);
      });

      await waitFor(() => {
        expect(screen.getByText('Inactive')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('makes correct API request', async () => {
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderComponent();

      await waitFor(() => {
        expect(fetch).toHaveBeenCalledWith(
          'http://localhost:8080/users/123',
          expect.objectContaining({
            method: 'GET',
          })
        );
      });
    });

    it('includes correct headers in API request', async () => {
      const mockUser = {
        id: 123,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User'
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderComponent();

      await waitFor(() => {
        // First assertion
        const fetchCall = fetch.mock.calls[0];
        const url = fetchCall[0];
        expect(url).toBe('http://localhost:8080/users/123');
      });

      await waitFor(() => {
        // Second assertion
        const fetchCall = fetch.mock.calls[0];
        const options = fetchCall[1];
        expect(options.method).toBe('GET');
      });

      await waitFor(() => {
        // Third assertion
        const fetchCall = fetch.mock.calls[0];
        const options = fetchCall[1];
        expect(options.headers.get('Authorization')).toBe('Bearer mock-jwt-token');
      });
    });
  });

  describe('Error Handling', () => {
    it('shows HTTP error status message', async () => {
      fetch.mockRejectedValueOnce(new Error('HTTP error! status: 404'));

      renderComponent();

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent('Failed to load user data. Please try again.');
      });
    });

    it('handles non-ok response with error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'User not found' }),
      });

      renderComponent();

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Failed to load user data/);
      });
    });
  });
});