import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuthSession } from '../useAuthSession';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock SweetAlert2
// vi.mock('sweetalert2', () => ({
//   fire: vi.fn(() => Promise.resolve({ then: (cb) => cb && cb() })),
// }));

vi.mock('sweetalert2', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      ...actual.default,
      fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
    },
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true }))
  };
});

describe('useAuthSession', () => {
  const backendUrl = 'http://localhost:8080';

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn(() =>
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
    vi.clearAllTimers();
    vi.useRealTimers();
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
    global.fetch = vi.fn((url) => {
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
    });
    expect(result.current.jwtToken).toBe('token123');

    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/refresh`,
      expect.objectContaining({ method: 'GET' })
    );
  });

  test('toggleRefresh sets interval and updates token', async () => {
    // Set session cookie BEFORE rendering the hook
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'refreshToken=abc;',
    });

    // Mock fetch for all calls
    global.fetch = vi.fn((url) => {
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

    const { result, unmount } = renderHook(() => useAuthSession(backendUrl));
    await waitFor(() => {
      expect(result.current.sessionChecked).toBe(true);
    });

    // Switch to fake timers only after initial async work completes
    vi.useFakeTimers();

    act(() => {
      result.current.setIsLoggedInExplicitly(true);
      result.current.toggleRefresh(true);
    });

    // Fast-forward timer for interval
    act(() => {
      vi.advanceTimersByTime(600000);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${backendUrl}/refresh`,
      expect.objectContaining({ method: 'GET' })
    );

    // stop interval to prevent open handles
    act(() => {
      result.current.toggleRefresh(false);
    });
    unmount();
    vi.clearAllTimers();

    vi.useRealTimers();
  }, 10000);

  test('logOut clears token and calls toggleRefresh', async () => {
    // Set up fetch mock for logout
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );
    const { result } = renderHook(() => useAuthSession(backendUrl));

    act(() => {
      result.current.setJwtToken('sometoken');
      result.current.setIsLoggedInExplicitly(true);
    });

    act(() => {
      result.current.setJwtToken('sometoken');
      result.current.setIsLoggedInExplicitly(true);
      result.current.logOut();
    });

    await waitFor(() => {
      expect(result.current.jwtToken).toBe('');
    });
    expect(result.current.isLoggedInExplicitly).toBe(false);
  });
});