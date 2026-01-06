import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../App.jsx';

// Mock useAuthSession as named export
vi.mock('../hooks/useAuthSession', () => ({
  useAuthSession: vi.fn()
}));

// Mock LoadingScreen
vi.mock('../utils/LoadingScreen', () => ({
  LoadingScreen: () => <div>Loading session...</div>
}));

// Mock Alert
vi.mock('../utils/Alert', () => ({
  Alert: () => <div data-testid="alert" />
}));

// Import the mocked module to get the mock function
import { useAuthSession } from '../hooks/useAuthSession';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('loading state shows loading screen', () => {
    useAuthSession.mockReturnValue({
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
    useAuthSession.mockReturnValue({
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
    useAuthSession.mockReturnValue({
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

  test('renders Alert component', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('alert')).toBeInTheDocument();
  });

  test('renders main container with correct classes', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('container', 'mt-3');
  });

  test('calls useAuthSession with correct backend URL', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(useAuthSession).toHaveBeenCalledWith(import.meta.env.VITE_BACKEND_URL);
  });

  test('unauthenticated state with falsy jwtToken shows Home link', () => {
    useAuthSession.mockReturnValue({
      jwtToken: '',
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

  test('authenticated state with non-empty jwtToken shows Apps link', () => {
    useAuthSession.mockReturnValue({
      jwtToken: 'valid-token',
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

  test('unauthenticated state with undefined jwtToken shows Home link', () => {
    useAuthSession.mockReturnValue({
      jwtToken: undefined,
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

  test('does not render links when session is not checked', () => {
    useAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: false
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.queryByText('Home')).not.toBeInTheDocument();
    expect(screen.queryByText('Apps')).not.toBeInTheDocument();
    expect(screen.getByText('Loading session...')).toBeInTheDocument();
  });
});