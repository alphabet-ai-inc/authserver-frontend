import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from './Login';
import { MemoryRouter } from 'react-router-dom';

// Mock useAuth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    setJwtToken: jest.fn(),
    setIsLoggedInExplicitly: jest.fn(),
    toggleRefresh: jest.fn(),
  }),
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
/**
 * test to ensure the Login component renders correctly
 * and handles user interactions as expected.
 */
  test('renders login form', () => {
    render(<Login />, { wrapper: MemoryRouter });
    expect(screen.getByTestId(/loginform/i)).toBeInTheDocument();
    expect(screen.getByTestId(/email-address/i)).toBeInTheDocument();
    expect(screen.getByTestId(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error on failed login', async () => {
    // Mock fetch to return error
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: true, message: 'Invalid credentials' }),
      })
    );

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByTestId(/email-address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });

    global.fetch.mockRestore();
  });

  test('navigates to /apps on successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ access_token: 'token' }),
      })
    );

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByTestId(/email-address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByTestId(/password/i), { target: { value: 'correctpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/apps');
    });

    global.fetch.mockRestore();
  });
});