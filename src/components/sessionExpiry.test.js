// src/__tests__/sessionExpiry.test.js
import { render, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import api from '../utils/api';

// Mock the API
jest.mock('../utils/api');

const TestComponent = () => {
  const { user, loading } = useAuth();
  return <div>{loading ? 'Loading...' : user ? 'Logged in' : 'Logged out'}</div>;
};

test('redirects to login on session expiry', async () => {
  // Mock 401 response
  api.get.mockRejectedValueOnce({
    response: { status: 401 }
  });

  // Mock window.location
  delete window.location;
  window.location = { href: '' };

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  await waitFor(() => {
    expect(window.location.href).toBe('/login?session=expired');
  });
});