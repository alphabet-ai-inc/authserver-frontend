import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext.jsx';

// Debug: First check what the actual module looks like
console.log('Testing AuthContext...');

// Try a different mock approach
vi.mock('../../hooks/useAuthSession', async (importOriginal) => {
  console.log('Mocking useAuthSession module');

  // Get the actual module
  const actual = await importOriginal();
  console.log('Actual module keys:', Object.keys(actual));

  // Return a mock that works
  return {
    ...actual,
    default: vi.fn((backendUrl) => {
      console.log('Mock useAuthSession called with:', backendUrl);
      return {
        jwtToken: 'mock-token',
        setJwtToken: vi.fn(),
        sessionChecked: true,
        isLoggedInExplicitly: false,
        setIsLoggedInExplicitly: vi.fn(),
        toggleRefresh: vi.fn(),
        logOut: vi.fn(),
        sessionValid: true,
        tokenValid: true
      };
    }),
    useAuthSession: vi.fn((backendUrl) => {
      console.log('Mock useAuthSession (named) called with:', backendUrl);
      return {
        jwtToken: 'mock-token',
        setJwtToken: vi.fn(),
        sessionChecked: true,
        isLoggedInExplicitly: false,
        setIsLoggedInExplicitly: vi.fn(),
        toggleRefresh: vi.fn(),
        logOut: vi.fn(),
        sessionValid: true,
        tokenValid: true
      };
    })
  };
});

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="jwtToken">{auth.jwtToken}</span>
      <span data-testid="sessionChecked">{String(auth.sessionChecked)}</span>
    </div>
  );
}

describe('AuthContext', () => {
  test('AuthProvider works', () => {
    console.log('Running test...');
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    console.log('Test rendered');
    expect(screen.getByTestId('jwtToken')).toBeInTheDocument();
  });
});