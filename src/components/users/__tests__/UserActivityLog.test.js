/**
 * UserActivityLog.test.jsx
 * -------------------------
 * Clean tests using only Testing Library patterns
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserActivityLog } from '../UserActivityLog';
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

jest.mock('../../NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">NavBar</div>,
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variable
process.env.REACT_APP_BACKEND_URL = 'http://localhost:3001';

describe('UserActivityLog', () => {
  const mockNavigate = jest.fn();
  const mockJwtToken = 'mock-jwt-token';
  const mockUserId = '123';

  const mockUserInfo = {
    first_name: 'John',
    last_name: 'Doe',
  };

  const mockActivities = [
    {
      id: 1,
      type: 'login',
      description: 'User logged in',
      timestamp: 1672531200,
      details: 'Successful authentication',
      ip_address: '192.168.1.1',
      status: 'success',
    },
    {
      id: 2,
      type: 'create',
      description: 'Created new document',
      timestamp: 1672534800,
      details: 'Document ID: doc_123',
      ip_address: '192.168.1.1',
      status: 'success',
    },
  ];

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
      if (url.includes(`/users/${mockUserId}`) && !url.includes('activities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUserInfo),
        });
      }
      if (url.includes(`/users/${mockUserId}/activities`)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockActivities),
        });
      }
      return Promise.reject(new Error('Not found'));
    });
  });

  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={[`/user/${mockUserId}/activities`]}>
        <Routes>
          <Route path="/user/:id/activities" element={<UserActivityLog />} />
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
      expect(screen.getByText('Loading activity log...')).toBeInTheDocument();
    });

    it('should not render loading spinner after data loads', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Data Fetching', () => {
    it('should fetch user info and activities on mount', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');

      renderWithRouter();

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledTimes(2);
      });

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:3001/users/123',
        expect.objectContaining({
          headers: { Authorization: 'Bearer mock-jwt-token' },
        })
      );

      expect(fetchSpy).toHaveBeenCalledWith(
        'http://localhost:3001/users/123/activities',
        expect.objectContaining({
          headers: { Authorization: 'Bearer mock-jwt-token' },
        })
      );
    });

    it('should handle empty activities array', async () => {
      global.fetch.mockImplementation((url) => {
        if (url.includes(`/users/${mockUserId}`)) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockUserInfo),
          });
        }
        if (url.includes(`/users/${mockUserId}/activities`)) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
          });
        }
      });

      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('No activities found')).toBeInTheDocument();
      });
    });
  });

  describe('Rendering Content', () => {
    it('should render navbar component', () => {
      renderWithRouter();
      expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('should display user information correctly', async () => {
      renderWithRouter();

      // Wait for user info to load by checking for User ID
      await waitFor(() => {
        expect(screen.getByText(/User ID:/i)).toBeInTheDocument();
      });

      // User name should be visible
      expect(screen.getByText(/John/i)).toBeInTheDocument();
      expect(screen.getByText(/Doe/i)).toBeInTheDocument();
    });

    it('should render activity list with correct items', async () => {
      renderWithRouter();

      // Wait for first activity to load
      await waitFor(() => {
        expect(screen.getByText('User logged in')).toBeInTheDocument();
      });

      expect(screen.getByText('Created new document')).toBeInTheDocument();
    });
  });

  describe('Filtering Functionality', () => {
    it('should filter activities by type when filter changes', async () => {
      renderWithRouter();

      // Wait for activities to load
      await waitFor(() => {
        expect(screen.getByText('User logged in')).toBeInTheDocument();
      });

      const filterSelect = screen.getByRole('combobox');

      // Test login filter
      fireEvent.change(filterSelect, { target: { value: 'login' } });

      // Login activity should still be visible
      expect(screen.getByText('User logged in')).toBeInTheDocument();

      // Create activity should not be visible
      expect(screen.queryByText('Created new document')).not.toBeInTheDocument();
    });
  });

  describe('Navigation and Actions', () => {
    it('should navigate back to user page when back button is clicked', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('User logged in')).toBeInTheDocument();
      });

      const backButton = screen.getByText('Back to User');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith('/user/123');
    });
  });

    describe('Edge Cases', () => {
    it('should handle missing jwtToken', () => {
        useAuth.mockReturnValue({ jwtToken: null });

        renderWithRouter();

        // Should show loading initially
        expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should handle activity without description', async () => {
        const activitiesWithMissingDesc = [
        {
            id: 1,
            type: 'login',
            description: null, // NULL description
            timestamp: 1672531200,
            details: 'Test details',
            ip_address: '192.168.1.1',
            status: 'success',
        },
        ];

        // Create a new mock implementation for this test
        const customFetch = jest.fn()
        .mockImplementationOnce((url) => {
            if (url.includes(`/users/${mockUserId}`) && !url.includes('activities')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUserInfo),
            });
            }
        })
        .mockImplementationOnce((url) => {
            if (url.includes(`/users/${mockUserId}/activities`)) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(activitiesWithMissingDesc),
            });
            }
        });

        global.fetch = customFetch;

        renderWithRouter();

        // Wait for the activity to appear (check for LOGIN badge - FIXED TYPO)
        await waitFor(() => {
        expect(screen.getByText('LOGIN')).toBeInTheDocument();
        });

        // The component should show "No description" when description is null
        expect(screen.getByText('No description')).toBeInTheDocument();
    });

    it('should handle activity with empty string description', async () => {
        const activitiesWithEmptyDesc = [
        {
            id: 1,
            type: 'login',
            description: '', // EMPTY STRING description
            timestamp: 1672531200,
            details: 'Test details',
            ip_address: '192.168.1.1',
            status: 'success',
        },
        ];

        // Create a new mock implementation for this test
        const customFetch = jest.fn()
        .mockImplementationOnce((url) => {
            if (url.includes(`/users/${mockUserId}`) && !url.includes('activities')) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockUserInfo),
            });
            }
        })
        .mockImplementationOnce((url) => {
            if (url.includes(`/users/${mockUserId}/activities`)) {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(activitiesWithEmptyDesc),
            });
            }
        });

        global.fetch = customFetch;

        renderWithRouter();

        // Wait for activity to appear
        await waitFor(() => {
        expect(screen.getByText('LOGIN')).toBeInTheDocument();
        });

        // Component shows: {activity.description || 'No description'}
        // Empty string is falsy, so it should show "No description"
        expect(screen.getByText('No description')).toBeInTheDocument();
    });
    });



  describe('Accessibility', () => {
    it('should have accessible form controls', async () => {
      renderWithRouter();

      await waitFor(() => {
        expect(screen.getByText('Successful Logins')).toBeInTheDocument();
      });

      // Select should be accessible
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      // Buttons should have text
      expect(screen.getByText('Back to User')).toBeInTheDocument();
      expect(screen.getByText('Export Log')).toBeInTheDocument();
      expect(screen.getByText('Print')).toBeInTheDocument();
    });
  });
});

// /**
//  * UserActivityLog.test.jsx
//  * -------------------------
//  * Tests for UserActivityLog component
//  */

// import { render, screen, waitFor, fireEvent } from '@testing-library/react';
// import { MemoryRouter, Route, Routes } from 'react-router-dom';
// import { UserActivityLog } from '../UserActivityLog';
// import { useAuth } from '../../../context/AuthContext';

// // Mock dependencies
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: jest.fn(),
//   useNavigate: jest.fn(),
// }));

// jest.mock('../../../context/AuthContext', () => ({
//   useAuth: jest.fn(),
// }));

// jest.mock('../../../utils/Unix2Ymd', () => ({
//   formatUnixTimestamp: jest.fn().mockReturnValue('Formatted Timestamp'),
// }));

// jest.mock('../../NavBar', () => ({
//   __esModule: true,
//   default: () => <div data-testid="navbar">NavBar</div>,
// }));

// // Mock fetch globally
// global.fetch = jest.fn();

// // Mock environment variable
// process.env.REACT_APP_BACKEND_URL = 'http://localhost:3001';

// describe('UserActivityLog', () => {
//   const mockNavigate = jest.fn();
//   const mockJwtToken = 'mock-jwt-token';
//   const mockUserId = '123';
//   const mockUserInfo = {
//     first_name: 'John',
//     last_name: 'Doe',
//   };

//   const mockActivities = [
//     {
//       id: 1,
//       type: 'login',
//       description: 'User logged in',
//       timestamp: 1672531200,
//       details: 'Successful authentication',
//       ip_address: '192.168.1.1',
//       status: 'success',
//     },
//     {
//       id: 2,
//       type: 'create',
//       description: 'Created new document',
//       timestamp: 1672534800,
//       details: 'Document ID: doc_123',
//       ip_address: '192.168.1.1',
//       status: 'success',
//     },
//   ];

//   beforeEach(() => {
//     jest.clearAllMocks();

//     // Mock useParams
//     require('react-router-dom').useParams.mockReturnValue({ id: mockUserId });

//     // Mock useNavigate
//     require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);

//     // Mock useAuth
//     useAuth.mockReturnValue({ jwtToken: mockJwtToken });

//     // Reset formatUnixTimestamp mock
//     require('../../../utils/Unix2Ymd').formatUnixTimestamp.mockReturnValue('Formatted Timestamp');

//     // Default fetch implementation
//     global.fetch.mockImplementation((url) => {
//       if (url.includes(`/users/${mockUserId}`) && !url.includes('activities')) {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve(mockUserInfo),
//         });
//       }
//       if (url.includes(`/users/${mockUserId}/activities`)) {
//         return Promise.resolve({
//           ok: true,
//           json: () => Promise.resolve(mockActivities),
//         });
//       }
//       return Promise.reject(new Error('Not found'));
//     });
//   });

//   const renderWithRouter = () => {
//     return render(
//       <MemoryRouter initialEntries={[`/user/${mockUserId}/activities`]}>
//         <Routes>
//           <Route path="/user/:id/activities" element={<UserActivityLog />} />
//         </Routes>
//       </MemoryRouter>
//     );
//   };

//   describe('Initial Loading State', () => {
//     it('should show loading spinner when data is being fetched', () => {
//       // Delay the fetch response
//       global.fetch.mockImplementation(() => new Promise(() => {}));

//       renderWithRouter();

//       expect(screen.getByRole('status')).toBeInTheDocument();
//       expect(screen.getByText('Loading activity log...')).toBeInTheDocument();
//     });

//     it('should not render loading spinner after data loads', async () => {
//       renderWithRouter();

//       // Loading spinner should disappear once data is loaded
//       await waitFor(() => {
//         expect(screen.queryByRole('status')).not.toBeInTheDocument();
//       }, { timeout: 3000 });
//     });
//   });

//   describe('Data Fetching', () => {
//     it('should fetch user info and activities on mount', async () => {
//       const fetchSpy = jest.spyOn(global, 'fetch');

//       renderWithRouter();

//       // Wait for component to mount and make fetch calls
//       await waitFor(() => {
//         expect(fetchSpy).toHaveBeenCalledTimes(2);
//       });

//       expect(fetchSpy).toHaveBeenCalledWith(
//         'http://localhost:3001/users/123',
//         expect.objectContaining({
//           headers: { Authorization: 'Bearer mock-jwt-token' },
//         })
//       );

//       expect(fetchSpy).toHaveBeenCalledWith(
//         'http://localhost:3001/users/123/activities',
//         expect.objectContaining({
//           headers: { Authorization: 'Bearer mock-jwt-token' },
//         })
//       );
//     });

//     it('should handle empty activities array', async () => {
//       // Override default mock for this test
//       global.fetch.mockImplementation((url) => {
//         if (url.includes(`/users/${mockUserId}`)) {
//           return Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve(mockUserInfo),
//           });
//         }
//         if (url.includes(`/users/${mockUserId}/activities`)) {
//           return Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve([]),
//           });
//         }
//       });

//       renderWithRouter();

//       await waitFor(() => {
//         expect(screen.getByText('No activities found')).toBeInTheDocument();
//       });
//     });
//   });

//   describe('Rendering Content', () => {
//     it('should render navbar component', () => {
//       renderWithRouter();
//       expect(screen.getByTestId('navbar')).toBeInTheDocument();
//     });

//     it('should display user information correctly', async () => {
//     renderWithRouter();

//     // Wait for the user ID number (most specific)
//     // await screen.findByText('123');
//     await waitFor(() => {
//         screen.getByText(/User ID: 123/i);
//     });
//     // Everything else should be there
//     expect(screen.getByText(/John/i)).toBeInTheDocument();
//     expect(screen.getByText(/Doe/i)).toBeInTheDocument();
//     // expect(screen.getByText(/User ID:/i)).toBeInTheDocument();
//     });

//     it('should render activity list with correct items', async () => {
//       renderWithRouter();

//       await waitFor(() => {
//         expect(screen.getByText('User logged in')).toBeInTheDocument();
//       });

//       expect(screen.getByText('Created new document')).toBeInTheDocument();
//     });
//   });

//   describe('Filtering Functionality', () => {
//     it('should filter activities by type when filter changes', async () => {
//       renderWithRouter();

//       // Wait for activities to load
//       await waitFor(() => {
//         expect(screen.getByText('User logged in')).toBeInTheDocument();
//       });

//       const filterSelect = screen.getByRole('combobox');

//       // Test login filter
//       fireEvent.change(filterSelect, { target: { value: 'login' } });

//       // Login activity should still be visible
//       expect(screen.getByText('User logged in')).toBeInTheDocument();

//       // Create activity should not be visible
//       expect(screen.queryByText('Created new document')).not.toBeInTheDocument();
//     });
//   });

//   describe('Navigation and Actions', () => {
//     it('should navigate back to user page when back button is clicked', async () => {
//       renderWithRouter();

//       await waitFor(() => {
//         expect(screen.getByText('User logged in')).toBeInTheDocument();
//       });

//       const backButton = screen.getByText('Back to User');
//       fireEvent.click(backButton);

//       expect(mockNavigate).toHaveBeenCalledWith('/user/123');
//     });
//   });

//   describe('Edge Cases', () => {
//     it('should handle missing jwtToken', () => {
//       useAuth.mockReturnValue({ jwtToken: null });

//       renderWithRouter();

//       // Should show loading initially
//       expect(screen.getByRole('status')).toBeInTheDocument();
//     });

//     it('should handle activity without description', async () => {
//       const activitiesWithMissingDesc = [
//         {
//           id: 1,
//           type: 'login',
//           description: 'No description',
//           timestamp: 1672531200,
//           details: 'Test details',
//           ip_address: '192.168.1.1',
//           status: 'success',
//         },
//       ];

//       // Override fetch mock for this test
//       global.fetch.mockImplementation((url) => {
//         if (url.includes(`/users/${mockUserId}`)) {
//           return Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve(mockUserInfo),
//           });
//         }
//         if (url.includes(`/users/${mockUserId}/activities`)) {
//           return Promise.resolve({
//             ok: true,
//             json: () => Promise.resolve(activitiesWithMissingDesc),
//           });
//         }
//       });

//       renderWithRouter();

//       // The component should render "No description" when description is null
//       await waitFor(() => {
//         expect(screen.getAllByText('No description')).toBeInTheDocument();
//     });
//     });
//   });
// });