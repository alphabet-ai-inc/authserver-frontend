// __tests__/App.test.js

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App';
import { useAuthSession } from '../hooks/useAuthSession';

// Mock dependencies correctly
jest.mock('../hooks/useAuthSession');

// Correct mock for LoadingScreen (named export)
jest.mock('../utils/LoadingScreen', () => ({
  LoadingScreen: () => <div>Loading session...</div>
}));

// Correct mock for Alert (named export based on your error)
jest.mock('../utils/Alert', () => ({
  Alert: () => <div data-testid="alert" />
}));

describe('App', () => {
  const mockUseAuthSession = useAuthSession;

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('loading state shows loading screen', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: false
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });

  test('authenticated state shows Apps link', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: 'token',
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const appsLink = screen.getByText('Apps');
    expect(appsLink).toBeInTheDocument();
    expect(appsLink).toHaveAttribute('href', '/apps');
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('unauthenticated state shows Home link', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/home');
    expect(screen.queryByText('Apps')).not.toBeInTheDocument();
  });

  test('calls useAuthSession with correct URL', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(mockUseAuthSession).toHaveBeenCalledWith(process.env.REACT_APP_BACKEND_URL);
  });
});