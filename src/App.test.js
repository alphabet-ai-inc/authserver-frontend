import { render, screen } from '@testing-library/react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { App } from './App';
import userEvent from '@testing-library/user-event';

// Mock the custom hook and other components
jest.mock('./hooks/useAuthSession', () => ({
  useAuthSession: jest.fn(),
}));

jest.mock('./utils/LoadingScreen', () => ({
  LoadingScreen: () => <div data-testid="loading-screen">Loading...</div>,
}));

jest.mock('./utils/Alert', () => ({
  Alert: ({ message, className }) => (
    <div data-testid="alert" className={className}>
      {message}
    </div>
  ),
}));

describe('App', () => {
  const mockUseAuthSession = jest.requireMock('./hooks/useAuthSession').useAuthSession;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders LoadingScreen when session is not checked', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: false,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  test('renders Alert component with correct props', () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true,
    });

    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    const alert = screen.getByTestId('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('d-none');
    expect(alert).toHaveTextContent('');
  });

  test('renders Link to "/apps" when jwtToken is present', async () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: 'some-token',
      sessionChecked: true,
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/apps" element={<div data-testid="apps-page">Apps Page</div>} />
        </Routes>
      </BrowserRouter>
    );

    // Simulate clicking the link
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/apps');
    await userEvent.click(link);

    expect(await screen.getByTestId('apps-page')).toBeInTheDocument();
  });

  test('renders Link to "/home" when jwtToken is not present', async () => {
    mockUseAuthSession.mockReturnValue({
      jwtToken: null,
      sessionChecked: true,
    });

    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />} />
          <Route path="/home" element={<div data-testid="home-page">Home Page</div>} />
        </Routes>
      </BrowserRouter>
    );


    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/home');
    await userEvent.click(link);

    // Print the current DOM
    expect(await screen.getByTestId('home-page')).toBeInTheDocument();
  });
});
