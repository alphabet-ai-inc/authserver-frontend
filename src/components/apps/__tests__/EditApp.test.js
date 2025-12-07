// src/components/apps/__tests__/EditApp.test.js - CLEAN VERSION
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EditApp } from '../EditApp.jsx';
// All mocks at top...
jest.mock('../../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// ... other mocks ...

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: jest.fn(() => ({ id: '0' })),
  Link: jest.fn(({ children, ...props }) => children)
}));

describe('EditApp', () => {
  let useAuth, useParams;

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth = require('../../../context/AuthContext').useAuth;
    useParams = require('react-router-dom').useParams;

    // Default: valid token, session checked
    useAuth.mockReturnValue({
      jwtToken: 'valid-token',
      sessionChecked: true
    });

    useParams.mockReturnValue({ id: '0' });
  });

  test('redirects immediately when no JWT token and session is checked', async () => {
    // Arrange
    useAuth.mockReturnValue({
      jwtToken: '', // Empty token
      sessionChecked: true // Session IS checked
    });

    console.log('Mock setup: jwtToken="", sessionChecked=true');

    // Spy on navigate to see if it's called
    console.log('Before render, mockNavigate calls:', mockNavigate.mock.calls);
    // Act
    render(
      <MemoryRouter>
        <EditApp />
      </MemoryRouter>
    );

    // Debug: Check what's rendered
    console.log('Rendered output:', document.body.innerHTML);

    // Give a moment for useEffect to run
    await new Promise(resolve => setTimeout(resolve, 0));

    console.log('Navigate calls:', mockNavigate.mock.calls);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('does NOT redirect when session not checked yet', () => {
    // Arrange
    useAuth.mockReturnValue({
      jwtToken: '', // Empty token
      sessionChecked: false // Session NOT checked yet
    });

    // Act
    render(
      <MemoryRouter>
        <EditApp />
      </MemoryRouter>
    );

    // Assert - Should NOT redirect yet
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  test('does NOT redirect when JWT token is present', () => {
    // Arrange
    useAuth.mockReturnValue({
      jwtToken: 'valid-token', // Has token
      sessionChecked: true
    });

    // Act
    render(
      <MemoryRouter>
        <EditApp />
      </MemoryRouter>
    );

    // Assert
    expect(mockNavigate).not.toHaveBeenCalledWith('/login');
  });
});