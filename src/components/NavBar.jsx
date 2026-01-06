import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Swal from 'sweetalert2';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { jwtToken, setJwtToken } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out of the system.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear the token
        setJwtToken(null);

        // Close all menus
        setIsMenuOpen(false);
        setIsDropdownOpen(false);

        // Show success message
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK'
        }).then(() => {
          // Redirect to login page
          navigate('/login');
        });
      }
    });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-shield-lock me-2"></i>
          Authentication Server
        </Link>

        {/* Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation"
          data-testid="navbar-toggler"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Menu */}
        <div
          className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}
          data-testid="navbar-collapse"
        >
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                onClick={() => setIsMenuOpen(false)}
                data-testid="nav-home"
              >
                <i className="bi bi-house me-1"></i>
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/apps"
                onClick={() => setIsMenuOpen(false)}
                data-testid="nav-apps"
              >
                <i className="bi bi-grid-3x3-gap me-1"></i>
                Apps
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/users"
                onClick={() => setIsMenuOpen(false)}
                data-testid="nav-users"
              >
                <i className="bi bi-people me-1"></i>
                Users Management
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                data-testid="nav-about"
              >
                <i className="bi bi-info-circle me-1"></i>
                About
              </Link>
            </li>
          </ul>

          {/* User Menu */}
          <div className="navbar-nav" ref={dropdownRef} data-testid="user-menu">
            {jwtToken ? (
              // Logged in - Show dropdown with user options
              <div className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle d-flex align-items-center bg-transparent border-0"
                  type="button"
                  id="navbarDropdown"
                  onClick={toggleDropdown}
                  aria-expanded={isDropdownOpen}
                  style={{ cursor: 'pointer' }}
                  data-testid="account-dropdown-toggle"
                >
                  <i className="bi bi-person-circle me-2"></i>
                  <span className="d-none d-sm-inline">My Account</span>
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`}
                  aria-labelledby="navbarDropdown"
                  data-testid="dropdown-menu"
                >
                  <li>
                    <span className="dropdown-item-text small text-muted" data-testid="signed-in-text">
                      <i className="bi bi-check-circle me-2"></i>
                      Signed in
                    </span>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/profile"
                      onClick={() => {
                        setIsMenuOpen(false);
                        closeDropdown();
                      }}
                      data-testid="nav-profile"
                    >
                      <i className="bi bi-person me-2"></i>
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="/change-password"
                      onClick={() => {
                        setIsMenuOpen(false);
                        closeDropdown();
                      }}
                      data-testid="nav-change-password"
                    >
                      <i className="bi bi-key me-2"></i>
                      Change Password
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={() => {
                        handleLogout();
                        closeDropdown();
                      }}
                      data-testid="logout-button"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Not logged in - Show sign in button
              <div className="nav-item">
                <Link
                  className="nav-link btn btn-outline-primary btn-sm"
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  data-testid="nav-login"
                >
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Logout Button */}
          {jwtToken && (
            <div className="navbar-nav d-lg-none mt-2" data-testid="mobile-logout">
              <div className="nav-item">
                <button
                  className="nav-link text-danger btn btn-link text-decoration-none p-0"
                  onClick={handleLogout}
                  data-testid="mobile-logout-button"
                >
                  <i className="bi bi-box-arrow-right me-1"></i>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};


export default NavBar;