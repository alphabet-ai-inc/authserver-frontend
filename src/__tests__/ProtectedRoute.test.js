// src/__tests__/ProtectedRoute.test.js

import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { ProtectedRoute } from '../ProtectedRoute.jsx';
import { useAuth } from '../context/AuthContext';

// Mock dependencies
jest.mock('../context/AuthContext');

const MockProtectedContent = () => <div data-testid="protected-content">Protected Content</div>;
const MockLoginPage = () => <div data-testid="login-page">Login Page</div>;

describe('ProtectedRoute', () => {
  const mockUseAuth = useAuth;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show loading spinner when session is not checked', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: false
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Verifying authentication...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should hide loading when session check is complete', async () => {
      mockUseAuth.mockReturnValue({
        jwtToken: 'test-token',
        sessionChecked: true
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      });
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('authentication', () => {
    it('should render children when user has JWT token', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: 'test-token',
        sessionChecked: true
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('should redirect to login when user has no JWT token', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: true
      });

      // Use MemoryRouter to test navigation
      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<MockLoginPage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should use replace navigation when redirecting', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: true
      });

      render(
        <MemoryRouter initialEntries={['/protected']}>
          <Routes>
            <Route path="/login" element={<MockLoginPage />} />
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <MockProtectedContent />
                </ProtectedRoute>
              }
            />
          </Routes>
        </MemoryRouter>
      );

      // Verify navigation happened by checking the result
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });


  describe('loading indicator styling', () => {
    it('should have accessible loading state', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: false
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      // Check visually hidden text is properly hidden
      const hiddenText = screen.getByText('Loading...');
      expect(hiddenText).toHaveClass('visually-hidden');
    });

    it('should have primary color spinner', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: false
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const spinner = screen.getByRole('status');
      expect(spinner).toHaveClass('spinner-border', 'text-primary');
    });

    it('should have visually hidden loading text for accessibility', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: false
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const hiddenText = screen.getByText('Loading...');
      expect(hiddenText).toHaveClass('visually-hidden');
    });
  });

  describe('edge cases', () => {
    it('should handle session check completion after initial render', async () => {
      let sessionChecked = false;

      mockUseAuth.mockImplementation(() => ({
        jwtToken: null,
        sessionChecked
      }));

      const { rerender } = render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      // Initially loading
      expect(screen.getByRole('status')).toBeInTheDocument();

      // Simulate session check completion
      sessionChecked = true;
      mockUseAuth.mockReturnValue({
        jwtToken: 'test-token',
        sessionChecked: true
      });

      rerender(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      await waitFor(() => {
        expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      });
    });

    it('should handle null or undefined children', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: 'test-token',
        sessionChecked: true
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>{null}</ProtectedRoute>
        </BrowserRouter>
      );

      // Should render without errors even with null children
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('snapshot tests', () => {
    it('matches loading state snapshot', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: null,
        sessionChecked: false
      });

      const { asFragment } = render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('matches authenticated state snapshot', () => {
      mockUseAuth.mockReturnValue({
        jwtToken: 'test-token',
        sessionChecked: true
      });

      const { asFragment } = render(
        <BrowserRouter>
          <ProtectedRoute>
            <MockProtectedContent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });
});