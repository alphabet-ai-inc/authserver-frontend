import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuthSession } from './useAuthSession';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock SweetAlert2
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ then: (cb) => cb && cb() })),
}));

describe('useAuthSession', () => {
  const backendUrl = 'http://localhost:8080';

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: '',
    });
  });

  afterEach(() => {
    delete global.fetch;
    jest.useRealTimers();
  });

  test('throws if backendUrl is not provided', () => {
    expect(() => renderHook(() => useAuthSession())).toThrow('backendUrl is required');
  });

  test('sets sessionChecked true if no session cookie', async () => {
    const { result } = renderHook(() => useAuthSession(backendUrl));
    await waitFor(() => {
      expect(result.current.sessionChecked).toBe(true);
    });
  });

  test('fetches refresh token if session cookie exists', async () => {
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'refreshToken=abc;',
    });

    // Set up both fetch mocks BEFORE renderHook
    global.fetch = jest.fn((url) => {
      if (url.endsWith('/refresh')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: 'token123' }),
        });
      }
      if (url.endsWith('/validatesession')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    const { result } = renderHook(() => useAuthSession(backendUrl));
    await waitFor(() => {
      expect(result.current.sessionChecked).toBe(true);
      expect(result.current.jwtToken).toBe('token123');
    });
    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/refresh`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('toggleRefresh sets interval and updates token', async () => {
    jest.useFakeTimers();

    // Set session cookie BEFORE rendering the hook
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'refreshToken=abc;',
    });

    // Mock fetch for all calls
    global.fetch = jest.fn((url) => {
      if (url.endsWith('/refresh')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ access_token: 'newtoken' }),
        });
      }
      if (url.endsWith('/validatesession')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({}),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });

    const { result } = renderHook(() => useAuthSession(backendUrl));
    await waitFor(() => {
      expect(result.current.sessionChecked).toBe(true);
    });

    act(() => {
      result.current.setIsLoggedInExplicitly(true);
      result.current.toggleRefresh(true);
    });

    // Fast-forward timer for interval
    act(() => {
      jest.advanceTimersByTime(600000);
    });

    // Wait for async state updates
    await act(async () => { });

    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/refresh`,
      expect.objectContaining({ method: 'GET' })
    );

    jest.useRealTimers();
  });

  test('logOut clears token and calls toggleRefresh', async () => {
    // Set up fetch mock for logout
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    const { result } = renderHook(() => useAuthSession(backendUrl));
    await act(async () => {});

    act(() => {
      result.current.setJwtToken('sometoken');
      result.current.setIsLoggedInExplicitly(true);
      result.current.logOut();
    });

    await act(async () => { });
    expect(result.current.jwtToken).toBe('');
    expect(result.current.isLoggedInExplicitly).toBe(false);
  });
});