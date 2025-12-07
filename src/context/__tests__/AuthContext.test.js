import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock useAuthSession
jest.mock('../../hooks/useAuthSession', () => ({
  useAuthSession: jest.fn(),
}));

const { useAuthSession } = require('../../hooks/useAuthSession');

function TestComponent() {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="jwtToken">{auth.jwtToken}</span>
      <span data-testid="sessionChecked">{String(auth.sessionChecked)}</span>
    </div>
  );
}
/**/
/**
 * Test suite for AuthContext. It verifies that the AuthProvider correctly provides
 * authentication context values to its children components.
 */
describe('AuthContext', () => {
  beforeEach(() => {
    useAuthSession.mockReturnValue({
      jwtToken: 'mock-token',
      sessionChecked: true,
    });
  });

  test('provides auth context values to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId('jwtToken')).toHaveTextContent('mock-token');
    expect(screen.getByTestId('sessionChecked')).toHaveTextContent('true');
  });
});