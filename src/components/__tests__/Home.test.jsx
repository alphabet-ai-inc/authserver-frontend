import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Home } from '../Home';

// Mock the image import
vi.mock('./../../images/switch1.jpeg', () => ({
  default: 'mocked-security-image.jpg'
}));

// Mock useAuthSession hook
vi.mock('../../hooks/useAuthSession', () => ({
  useAuthSession: vi.fn()
}));

// Import the mocked hook
import { useAuthSession } from '../../hooks/useAuthSession';

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('Home Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state when session is not checked', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: false,
      setIsLoggedInExplicitly: vi.fn(),
      toggleRefresh: vi.fn()
    });

    render(<Home />);

    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  it('renders LoginPrompt when not logged in and session is checked', () => {
    const mockSetIsLoggedInExplicitly = vi.fn();
    const mockToggleRefresh = vi.fn();

    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true,
      setIsLoggedInExplicitly: mockSetIsLoggedInExplicitly,
      toggleRefresh: mockToggleRefresh
    });

    render(<Home />);

    expect(screen.getByText('AuthServer')).toBeInTheDocument();
    expect(screen.getByText('Secure access to your IT ecosystem: services, users, databases, and more.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByAltText('security')).toBeInTheDocument();

    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(mockSetIsLoggedInExplicitly).toHaveBeenCalledWith(true);
    expect(mockToggleRefresh).toHaveBeenCalledWith(true);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('renders welcome back when logged in', () => {
    useAuthSession.mockReturnValue({
      jwtToken: 'mock-jwt-token',
      sessionChecked: true,
      setIsLoggedInExplicitly: vi.fn(),
      toggleRefresh: vi.fn()
    });

    render(<Home />);

    expect(screen.getByText('AuthServer')).toBeInTheDocument();
    expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /login/i })).not.toBeInTheDocument();
  });

  it('renders static sections', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true,
      setIsLoggedInExplicitly: vi.fn(),
      toggleRefresh: vi.fn()
    });

    render(<Home />);

    expect(screen.getByText('Services')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Databases')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Biometrics')).toBeInTheDocument();
    expect(screen.getByText('IPs')).toBeInTheDocument();
    expect(screen.getByText('Profiles')).toBeInTheDocument();
    expect(screen.getByText('Logs')).toBeInTheDocument();
    expect(screen.getByText('Regions')).toBeInTheDocument();
    expect(screen.getByText('© 2025 AuthServer. All rights reserved.')).toBeInTheDocument();
  });
});