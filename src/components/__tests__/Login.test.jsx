/**
 * Login Component Tests
 * Tests for the Login component
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Login } from '../Login';  // Correct: Go up one level from __tests__
import { useAuth } from '../../context/AuthContext.jsx';  // Go up 3 levels from __tests__
import { useLocation } from 'react-router-dom';

// Mock dependencies - MODULE LEVEL MOCKS
vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

// Create mock functions for react-router-dom at module level
const mockNavigate = vi.fn();

// Mock react-router-dom at MODULE LEVEL (before imports that use it)
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: vi.fn(() => ({ search: '', state: null })),
  };
});

// Mock fetch globally
global.fetch = vi.fn();

describe('Login Component', () => {
  // Create mock functions for auth context
  const mockSetJwtToken = vi.fn();
  const mockSetIsLoggedInExplicitly = vi.fn();
  const mockToggleRefresh = vi.fn();
  const mockSetJustLoggedIn = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Default auth context mock
    useAuth.mockReturnValue({
      setJwtToken: mockSetJwtToken,
      setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
      toggleRefresh: mockToggleRefresh,
      setJustLoggedIn: mockSetJustLoggedIn,
      login: mockLogin,
      user: null,
      loading: false,
    });

    // Mock environment variables
    import.meta.env.VITE_BACKEND_URL = 'http://localhost:8080';
    process.env.NODE_ENV = 'test';

    // Reset location mock
    useLocation.mockReturnValue({ search: '', state: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders login form with all elements', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      expect(screen.getByTestId('LoginForm')).toBeInTheDocument();
    });

    it('shows email and password inputs', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('email-address')).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId('password')).toBeInTheDocument();
      });
    });

    it('shows welcome message', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Welcome Back')).toBeInTheDocument();
      });
    });

    it('shows sign in button', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Sign In')).toBeInTheDocument();
      });
    });

    it('shows create account button', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading indicator when authLoading is true', () => {
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: mockLogin,
        user: null,
        loading: true,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      expect(screen.getByText('Checking authentication status...')).toBeInTheDocument();
    });

    it('shows signing in spinner when form is submitting', async () => {
      // Mock a slow login function
      const slowLogin = vi.fn().mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: slowLogin,
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Signing in...')).toBeInTheDocument();
      });
    });
  });

  describe('Session Expiry Handling', () => {
    it('shows session expiry message when URL has session=expired', async () => {
      useLocation.mockReturnValue({
        search: '?session=expired',
        state: null,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Your session has expired. Please login again.')).toBeInTheDocument();
      });
    });

    it('redirects to intended page when user is already logged in', () => {
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: mockLogin,
        user: { id: 1, email: 'test@example.com' },
        loading: false,
      });

      useLocation.mockReturnValue({
        search: '',
        state: { from: { pathname: '/dashboard' } },
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
    });
  });

  describe('Form Interactions', () => {
    it('updates email field when typing', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput.value).toBe('test@example.com');
    });

    it('updates password field when typing', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const passwordInput = screen.getByTestId('password');
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput.value).toBe('password123');
    });
  });

  describe('Enhanced Login Function', () => {
    it('calls enhanced login function when form is submitted', async () => {
      const mockEnhancedLogin = vi.fn().mockResolvedValue({ success: true });

      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: mockEnhancedLogin,
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockEnhancedLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        expect(mockSetIsLoggedInExplicitly).toHaveBeenCalledWith(true);
        expect(mockToggleRefresh).toHaveBeenCalledWith(true);
        expect(mockSetJustLoggedIn).toHaveBeenCalledWith(true);
        expect(mockNavigate).toHaveBeenCalledWith('/apps', { replace: true });
      });
    });

    it('shows error when enhanced login fails', async () => {
      const mockEnhancedLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));

      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: mockEnhancedLogin,
        user: null,
        loading: false,
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Legacy Fetch Login', () => {
    it('calls fetch API when enhanced login is not available', async () => {
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: undefined,
        user: null,
        loading: false,
      });

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'mock-jwt-token',
        }),
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('handles successful login with fetch', async () => {
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: undefined,
        user: null,
        loading: false,
      });

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'mock-jwt-token',
        }),
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockSetJwtToken).toHaveBeenCalledWith('mock-jwt-token');
        expect(mockSetIsLoggedInExplicitly).toHaveBeenCalledWith(true);
        expect(mockToggleRefresh).toHaveBeenCalledWith(true);
        expect(mockSetJustLoggedIn).toHaveBeenCalledWith(true);
        expect(mockNavigate).toHaveBeenCalledWith('/apps', { replace: true });
      });
    });

    it('handles login failure with fetch', async () => {
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: undefined,
        user: null,
        loading: false,
      });

      global.fetch.mockResolvedValue({
        ok: false,
        json: async () => ({
          message: 'Invalid credentials',
        }),
      });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      const passwordInput = screen.getByTestId('password');
      const submitButton = screen.getByText('Sign In');

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      // Reset navigation mocks before each navigation test
      mockNavigate.mockClear();

      // Ensure default auth context for navigation tests
      useAuth.mockReturnValue({
        setJwtToken: mockSetJwtToken,
        setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
        toggleRefresh: mockToggleRefresh,
        setJustLoggedIn: mockSetJustLoggedIn,
        login: undefined,
        user: null,
        loading: false,
      });
    });

    it('navigates to forgot password when button is clicked', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      // Wait for the button to be rendered
      await waitFor(() => {
        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
      });

      const forgotPasswordButton = screen.getByText('Forgot Password?');
      fireEvent.click(forgotPasswordButton);

      // Check navigation was called with correct path
      expect(mockNavigate).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/forgot-password');
      });
    });

    it('navigates to register when create account is clicked', async () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      // Wait for the button to be rendered
      await waitFor(() => {
        expect(screen.getByText('Create Account')).toBeInTheDocument();
      });

      const createAccountButton = screen.getByText('Create Account');
      fireEvent.click(createAccountButton);

      // Check navigation was called with correct path
      expect(mockNavigate).toHaveBeenCalled();

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/register');
      });
    });
  });

  describe('Form Validation', () => {
    it('has required email field', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const emailInput = screen.getByTestId('email-address');
      expect(emailInput).toBeRequired();
    });

    it('has required password field', () => {
      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      const passwordInput = screen.getByTestId('password');
      expect(passwordInput).toBeRequired();
    });
  });
});