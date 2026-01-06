/**
 * NavBar.test.jsx
 * ----------------
 * Tests for NavBar component
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavBar from '../NavBar.jsx';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Mock AuthContext
const mockSetJwtToken = vi.fn();
const mockAuthContext = {
  jwtToken: null,
  setJwtToken: mockSetJwtToken,
};

vi.mock('../../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}));

// Import mocks
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Swal from 'sweetalert2';

describe('NavBar Component', () => {
  let addEventListenerSpy;
  let removeEventListenerSpy;
  let mockNavigate;

  beforeEach(() => {
    vi.clearAllMocks();

    mockNavigate = vi.fn();
    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue(mockAuthContext);

    Swal.fire.mockResolvedValue({ isConfirmed: false });

    addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    if (addEventListenerSpy) addEventListenerSpy.mockRestore();
    if (removeEventListenerSpy) removeEventListenerSpy.mockRestore();
  });

  const renderComponent = (authToken = null) => {
    useAuth.mockReturnValue({
      ...mockAuthContext,
      jwtToken: authToken,
    });

    return render(
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    );
  };

  describe('Initial Render - Not Logged In', () => {
    it('should render the navbar with correct brand name', () => {
      renderComponent();

      const brandLink = screen.getByRole('link', { name: /authentication server/i });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute('href', '/');
    });

    it('should render navigation links for non-authenticated users', () => {
      renderComponent();

      expect(screen.getByTestId('nav-home')).toBeInTheDocument();
      expect(screen.getByTestId('nav-apps')).toBeInTheDocument();
      expect(screen.getByTestId('nav-users')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
    });

    it('should render sign in button when not logged in', () => {
      renderComponent();

      const signInLink = screen.getByTestId('nav-login');
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('should not show user dropdown when not logged in', () => {
      renderComponent();

      expect(screen.queryByTestId('account-dropdown-toggle')).not.toBeInTheDocument();
      expect(screen.queryByTestId('signed-in-text')).not.toBeInTheDocument();
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('should toggle mobile menu when hamburger button is clicked', () => {
      renderComponent();

      const toggleButton = screen.getByTestId('navbar-toggler');
      const navbarCollapse = screen.getByTestId('navbar-collapse');

      expect(navbarCollapse).not.toHaveClass('show');

      fireEvent.click(toggleButton);
      expect(navbarCollapse).toHaveClass('show');

      fireEvent.click(toggleButton);
      expect(navbarCollapse).not.toHaveClass('show');
    });
  });

  describe('Logged In State', () => {
    beforeEach(() => {
      mockAuthContext.jwtToken = 'mock-token';
    });

    it('should show user dropdown when logged in', () => {
      renderComponent('mock-token');

      expect(screen.getByTestId('account-dropdown-toggle')).toBeInTheDocument();
      expect(screen.queryByTestId('nav-login')).not.toBeInTheDocument();
    });

    it('should toggle dropdown when My Account is clicked', () => {
      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      const dropdownMenu = screen.getByTestId('dropdown-menu');

      expect(dropdownMenu).not.toHaveClass('show');

      fireEvent.click(accountButton);
      expect(dropdownMenu).toHaveClass('show');

      fireEvent.click(accountButton);
      expect(dropdownMenu).not.toHaveClass('show');
    });

    it('should show dropdown menu items when dropdown is open', () => {
      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      expect(screen.getByTestId('signed-in-text')).toBeInTheDocument();
      expect(screen.getByTestId('nav-profile')).toBeInTheDocument();
      expect(screen.getByTestId('nav-change-password')).toBeInTheDocument();
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('should have correct links in dropdown menu', () => {
      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      const profileLink = screen.getByTestId('nav-profile');
      const changePasswordLink = screen.getByTestId('nav-change-password');

      expect(profileLink).toHaveAttribute('href', '/profile');
      expect(changePasswordLink).toHaveAttribute('href', '/change-password');
    });

    it('should close mobile menu when clicking on dropdown links', () => {
      renderComponent('mock-token');

      const toggleButton = screen.getByTestId('navbar-toggler');
      fireEvent.click(toggleButton);

      const navbarCollapse = screen.getByTestId('navbar-collapse');
      expect(navbarCollapse).toHaveClass('show');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      fireEvent.click(screen.getByTestId('nav-profile'));

      expect(navbarCollapse).not.toHaveClass('show');
      const dropdownMenu = screen.getByTestId('dropdown-menu');
      expect(dropdownMenu).not.toHaveClass('show');
    });

    it('should show mobile logout button when logged in', () => {
      renderComponent('mock-token');

      expect(screen.getByTestId('mobile-logout-button')).toBeInTheDocument();
    });
  });

  describe('Logout Functionality', () => {
    beforeEach(() => {
      mockAuthContext.jwtToken = 'mock-token';
    });

    it('should show confirmation dialog when logout is clicked from dropdown', async () => {
      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      expect(Swal.fire).toHaveBeenCalledWith({
        title: 'Are you sure?',
        text: 'You will be logged out of the system.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out!',
        cancelButtonText: 'Cancel'
      });
    });

    it('should handle successful logout confirmation', async () => {
      Swal.fire
        .mockResolvedValueOnce({ isConfirmed: true })
        .mockResolvedValueOnce({});

      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSetJwtToken).toHaveBeenCalledWith(null);
      });

      expect(Swal.fire).toHaveBeenCalledTimes(2);
      expect(Swal.fire).toHaveBeenLastCalledWith({
        title: 'Logged out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('should close menus after logout', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: true });

      renderComponent('mock-token');

      const toggleButton = screen.getByTestId('navbar-toggler');
      fireEvent.click(toggleButton);

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        const navbarCollapse = screen.getByTestId('navbar-collapse');

        expect(navbarCollapse).not.toHaveClass('show');
      });
    const dropdownMenu = screen.getByTestId('dropdown-menu');
     expect(dropdownMenu).not.toHaveClass('show');

    });

    it('should not logout when confirmation is cancelled', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: false });

      renderComponent('mock-token');

      const accountButton = screen.getByTestId('account-dropdown-toggle');
      fireEvent.click(accountButton);

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      await waitFor(() => {
        expect(mockSetJwtToken).not.toHaveBeenCalled();
      });
      expect(mockNavigate).not.toHaveBeenCalled();

    });

    it('should handle logout from mobile logout button', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: true });

      renderComponent('mock-token');

      const mobileLogoutButton = screen.getByTestId('mobile-logout-button');
      fireEvent.click(mobileLogoutButton);

      await waitFor(() => {
        expect(Swal.fire).toHaveBeenCalled();
      });
    expect(mockSetJwtToken).toHaveBeenCalledWith(null);
    });
  });

  describe('Navigation Links', () => {
    it('should close mobile menu when clicking on navigation links', () => {
      renderComponent();

      const toggleButton = screen.getByTestId('navbar-toggler');
      fireEvent.click(toggleButton);

      const navbarCollapse = screen.getByTestId('navbar-collapse');
      expect(navbarCollapse).toHaveClass('show');

      fireEvent.click(screen.getByTestId('nav-home'));
      expect(navbarCollapse).not.toHaveClass('show');
    });

    it('should have correct href attributes for all navigation links', () => {
      renderComponent();

      expect(screen.getByTestId('nav-home')).toHaveAttribute('href', '/');
      expect(screen.getByTestId('nav-apps')).toHaveAttribute('href', '/apps');
      expect(screen.getByTestId('nav-users')).toHaveAttribute('href', '/users');
      expect(screen.getByTestId('nav-about')).toHaveAttribute('href', '/about');
    });
  });

  describe('Click Outside Dropdown', () => {
    it('should add event listener for click outside', () => {
      renderComponent('mock-token');

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
  });
});