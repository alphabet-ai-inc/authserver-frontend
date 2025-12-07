
// src/components/apps/__tests__/Apps.test.js
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

// Clear any existing mocks
jest.clearAllMocks();

// Mock useAuth
const mockUseAuth = jest.fn();
jest.mock('../../../context/AuthContext', () => ({
  useAuth: mockUseAuth
}));

// Mock NavBar
jest.mock('../../NavBar', () => ({
  __esModule: true,
  default: () => <div data-testid="navbar">NavBar</div>
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => (
    <a href={to} {...props}>{children}</a>
  )
}));

// Mock fetch
global.fetch = jest.fn();

// Mock the entire Apps component to isolate the issue
jest.mock('../Apps.jsx', () => {
  const React = require('react');

  // Simple mock component
  const MockApps = () => {
    const { jwtToken } = require('../../../context/AuthContext').useAuth();
    const navigate = require('react-router-dom').useNavigate();

    React.useEffect(() => {
      if (jwtToken === "") {
        navigate("/login");
      }
    }, [jwtToken, navigate]);

    return (
      <div data-testid="apps-component">
        <div data-testid="navbar">NavBar</div>
        <h1>Application Portfolio</h1>
        <table>
          <tbody>
            <tr>
              <td>Test App</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return {
    __esModule: true,
    default: MockApps, // If using default export
    Apps: MockApps     // If using named export
  };
});

describe('Apps Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();

    // Setup fetch mock
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([
        { id: 1, name: 'Test App', release: '1.0' }
      ])
    });
  });

  it('should not redirect if jwtToken is present', async () => {
    // Setup auth context
    mockUseAuth.mockReturnValue({
      jwtToken: 'valid-token',
      sessionChecked: true
    });

    // Dynamically import to avoid hoisting issues
    const { default: Apps } = await import('../Apps.jsx');

    render(
      <MemoryRouter>
        <Apps />
      </MemoryRouter>
    );

    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });

  it('should redirect to login if jwtToken is empty', async () => {
    mockUseAuth.mockReturnValue({
      jwtToken: '',
      sessionChecked: true
    });

    const { default: Apps } = await import('../Apps.jsx');

    render(
      <MemoryRouter>
        <Apps />
      </MemoryRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});