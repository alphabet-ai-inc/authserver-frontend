/**
 * Apps Component Test
 * --------------------
 * Tests the functionality of the Apps component.
 *
 * Dependencies:
 * - React Testing Library
 * - Mock Service Worker (MSW) for API mocking
 *
 * @component
 */
import { render, screen } from '@testing-library/react';
import { Apps } from './Apps';
import { MemoryRouter } from 'react-router-dom';

/**
 * Mock useAuth
 * gives control over the jwtToken value for testing different scenarios.
 * mockJwtToken variable can be set in each test to simulate logged-in or logged-out states.
 */

let mockJwtToken = 'test-token';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    jwtToken: mockJwtToken,
  }),
}));

/**
 * Mock NavBar component to avoid rendering the actual NavBar during tests.
 * This prevents potential side effects and focuses tests on the Apps component.
 */
jest.mock('./NavBar', () => ({
  NavBar: () => <div data-testid="navbar" />,
}));

/**
 * Mocks the useNavigate hook from react-router-dom to track navigation calls.
 */
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

/**
 * Sets up a global fetch mock to simulate API responses.
 * The mock returns a predefined list of apps for testing purposes.
 * This is done before each test to ensure a consistent testing environment.
 * The mock is restored after each test to avoid interference with other tests.
 */
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        {
          id: 1,
          name: 'App1',
          release: 'A',
          path: '/app1',
          init: 'init1',
          web: 'web1',
          title: 'Title1'
        }
      ]),
    })
  );
});

afterEach(() => {
  global.fetch.mockRestore();
});

/** Test Suite for Apps Component
 * -----------------------------
 * Contains tests to verify the rendering and functionality of the Apps component.
 * Tests include rendering the component, displaying fetched data, and handling navigation based on authentication state.
 * Each test is isolated to ensure reliability and accuracy of results.
 */

describe('Apps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJwtToken = 'test-token';
  });

  test('renders heading and table', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([
          {
            id: 1,
            name: 'App1',
            release: 'A',
            path: '/app1',
            init: 'init1',
            web: 'web1',
            title: 'Title1'
          }
        ]),
      })
    );

    render(<Apps />, { wrapper: MemoryRouter });

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/apps/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();

    // Wait for each fetched data element separately
    expect(await screen.findByText('App1')).toBeInTheDocument();
    expect(await screen.findByText('1.0.0')).toBeInTheDocument();
    expect(await screen.findByText('/app1')).toBeInTheDocument();
    expect(await screen.findByText('init1')).toBeInTheDocument();
    expect(await screen.findByText('web1')).toBeInTheDocument();
    expect(await screen.findByText('Title1')).toBeInTheDocument();

    global.fetch.mockRestore();
  });
    test('redirects to login if jwtToken is empty', () => {
      mockJwtToken = '';
      render(<Apps />, { wrapper: MemoryRouter });
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('does not redirect if jwtToken is present', () => {
      render(<Apps />, { wrapper: MemoryRouter });
      expect(mockNavigate).not.toHaveBeenCalledWith('/login');
    });
  });

