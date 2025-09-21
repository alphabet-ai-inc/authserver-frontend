import { render, screen, waitFor } from '@testing-library/react';
import { Apps } from './Apps';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth
let mockJwtToken = 'test-token';

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    jwtToken: mockJwtToken,
  }),
}));

// Mock NavBar
jest.mock('./NavBar', () => ({
  NavBar: () => <div data-testid="navbar" />,
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  Link: ({ to, children, ...props }) => <a href={to} {...props}>{children}</a>,
}));

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

    // Wait for the fetched data to appear
    await waitFor(() => {
      expect(screen.getByText('App1')).toBeInTheDocument();
      expect(screen.getByText('1.0.0')).toBeInTheDocument(); // release value for 'A'
      expect(screen.getByText('/app1')).toBeInTheDocument();
      expect(screen.getByText('init1')).toBeInTheDocument();
      expect(screen.getByText('web1')).toBeInTheDocument();
      expect(screen.getByText('Title1')).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('redirects to login if jwtToken is empty', () => {
  mockJwtToken = '';
  render(<Apps />, { wrapper: MemoryRouter });
  expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('does not redirect if jwtToken is present', () => {
    render(<Apps />, { wrapper: MemoryRouter });
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');});
});