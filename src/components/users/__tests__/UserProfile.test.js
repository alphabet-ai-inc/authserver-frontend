/**
 * UserProfile.test.jsx
 * --------------------
 * Tests for UserProfile component
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProfile } from '../UserProfile';
import { useAuth } from '../../../context/AuthContext';

// Mock dependencies
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../../../utils/Unix2Ymd', () => ({
  formatUnixTimestamp: jest.fn().mockReturnValue('Formatted Timestamp'),
}));

jest.mock('../../../components/NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">NavBar</div>,
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variable
process.env.REACT_APP_BACKEND_URL = 'http://localhost:3001';

describe('UserProfile', () => {
  const mockNavigate = jest.fn();
  const mockJwtToken = 'mock-jwt-token';
  const mockUserId = '123';

  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    role: 'Administrator',
    active: true,
    blocked: false,
    created: 1672531200,
    updated: 1672534800,
    last_login: 1672538400,
    code: 'USER123',
    lan: 'en',
    profile_id: 'PROF001',
    group_id: 'GRP001',
    company_id: 'COMP001',
    last_action: 'Logged in',
    tries: 1,
    last_try: 1672538400,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useParams
    require('react-router-dom').useParams.mockReturnValue({ id: mockUserId });

    // Mock useNavigate
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

    // Mock useAuth
    useAuth.mockReturnValue({ jwtToken: mockJwtToken });

    // Mock formatUnixTimestamp
    require('../../../utils/Unix2Ymd').formatUnixTimestamp.mockReturnValue('Formatted Timestamp');

    // Default fetch implementation
    global.fetch.mockImplementation((url) => {
      if (url.includes(`/users/${mockUserId}/profile`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUser),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={[`/user/${mockUserId}/profile`]}>
        <Routes>
          <Route path="/user/:id/profile" element={<UserProfile />} />
        </Routes>
      </MemoryRouter>
    );
  };

  describe('Initial Loading State', () => {
    it('should show loading spinner when data is being fetched', () => {
      // Delay the fetch response
      global.fetch.mockImplementation(() => new Promise(() => {}));

      renderWithRouter();

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    it('should not render loading spinner after data loads', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch user profile on mount', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      renderWithRouter();

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:3001/users/123/profile',
        expect.objectContaining({
          headers: { Authorization: 'Bearer mock-jwt-token' },
        })
      );
    });

    it('should show error when user not found', async () => {
      global.fetch.mockImplementation((url) => {
        if (url.includes(`/users/${mockUserId}/profile`)) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(null),
          });
        }
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User profile not found')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering User Profile', () => {
    it('should render navbar component', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should display user name correctly', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display user email', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('john.doe@example.com')).toBeInTheDocument();
    });

    it('should display user role', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('Administrator')).toBeInTheDocument();
    });

    it('should show active status badge', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('Active')).toBeInTheDocument();
    });
  });

    describe('Quick Info Section', () => {
    it('should show member since date', async () => {
        renderWithRouter();

        await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
        });

        // Check that "Formatted Timestamp" appears (multiple times)
        expect(screen.getAllByText('Formatted Timestamp').length).toBeGreaterThan(0);
    });

    // ... rest of tests
    });

  describe('Contact Information Section', () => {
    it('should show email in contact section', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      const emailInput = screen.getByDisplayValue('john.doe@example.com');
      expect(emailInput).toBeInTheDocument();
    });

    it('should show account status', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('Active Account')).toBeInTheDocument();
    });
  });

  describe('Access Information Section', () => {
    it('should show profile ID', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('PROF001')).toBeInTheDocument();
    });

    it('should show group ID', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('GRP001')).toBeInTheDocument();
    });

    it('should show company ID', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByDisplayValue('COMP001')).toBeInTheDocument();
    });
  });

  describe('Recent Activity Section', () => {
    it('should show last action', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('Logged in')).toBeInTheDocument();
    });

    it('should show login attempts', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('1 attempts')).toBeInTheDocument();
    });

    it('should have link to activity log', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      expect(screen.getByText('Activity Log')).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is clicked', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      const backButton = screen.getByText('Back to User');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/user/123');
    });

    it('should navigate to activity log when link is clicked', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User Profile')).toBeInTheDocument();
      });

      const activityLink = screen.getByText('Activity Log');
      fireEvent.click(activityLink);

      expect(mockNavigate).toHaveBeenCalledWith('/user/123/activity');
    });
  });

    describe('Edge Cases', () => {
    // ... other tests

    it('should handle missing optional fields', async () => {
        const minimalUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        active: true,
        created: 1672531200,
        updated: 1672534800,
        // Missing optional fields
        };

        global.fetch.mockImplementation((url) => {
        if (url.includes(`/users/${mockUserId}/profile`)) {
            return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(minimalUser),
            });
        }
        });

        renderWithRouter();

        await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        });
        await waitFor(() => {
            // "Never" should appear at least once
            expect(screen.queryAllByText('Never').length).toBeGreaterThan(0);
        });
        // Check for specific fallback values
        expect(screen.getByText('No role specified')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();
        expect(screen.getByText('Default')).toBeInTheDocument();
        expect(screen.getByText('No recent actions')).toBeInTheDocument();
        expect(screen.getByText('0 attempts')).toBeInTheDocument();
    });
    });
});