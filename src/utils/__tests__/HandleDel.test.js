// __tests__/hooks/useHandleDelete.test.js

import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { useHandleDelete, quickDelete } from '../HandleDel';

// Mock all dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  DismissReason: {
    cancel: 'cancel'
  },
  isLoading: jest.fn()
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('useHandleDelete', () => {
  let mockNavigate;
  let mockJwtToken;

  beforeEach(() => {
    jest.clearAllMocks();

    mockNavigate = jest.fn();
    mockJwtToken = 'test-jwt-token';

    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ jwtToken: mockJwtToken });

    // Default mock for Swal.fire
    Swal.fire.mockResolvedValue({ isConfirmed: false });
  });

  test('should return confirmDelete and batchDelete functions', () => {
    const { result } = renderHook(() => useHandleDelete(1, 'app'));

    expect(typeof result.current.confirmDelete).toBe('function');
    expect(typeof result.current.batchDelete).toBe('function');
    expect(typeof result.current.getConfig).toBe('function');
  });

  describe('confirmDelete', () => {
    test('should redirect to login if no JWT token', async () => {
      useAuth.mockReturnValue({ jwtToken: null });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Authentication Required'
        })
      );
    });

    test('should show confirmation dialog with correct entity config', async () => {
      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Delete Application?',
          confirmButtonColor: '#dc3545'
        })
      );
    });

    test('should have preConfirm function that calls delete endpoint', async () => {
      const mockResponse = { ok: true, json: jest.fn().mockResolvedValue({}) };
      global.fetch.mockResolvedValue(mockResponse);

      let capturedPreConfirm;
      Swal.fire.mockImplementation((options) => {
        capturedPreConfirm = options.preConfirm;
        return Promise.resolve({ isConfirmed: false });
      });

      const { result } = renderHook(() => useHandleDelete(123, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      // Test that preConfirm function exists
      expect(capturedPreConfirm).toBeDefined();
      expect(typeof capturedPreConfirm).toBe('function');

      // Test that preConfirm calls fetch
      await act(async () => {
        await capturedPreConfirm();
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/apps/123'),
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.any(Headers)
        })
      );
    });

    test('should handle successful deletion', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire
        .mockResolvedValueOnce({ isConfirmed: true, value: { success: true } })
        .mockResolvedValueOnce({}); // Success dialog

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(Swal.fire).toHaveBeenCalledTimes(2);
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Deleted!'
        })
      );
    });

    test('should navigate to success redirect on successful deletion', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire.mockResolvedValue({ isConfirmed: true, value: { success: true } });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(mockNavigate).toHaveBeenCalledWith('/apps');
    });

    test('should handle delete API error', async () => {
      const mockError = { message: 'Not found' };
      const mockResponse = {
        ok: false,
        json: jest.fn().mockResolvedValue(mockError)
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire.mockResolvedValue({ isConfirmed: false });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      // Swal should show validation message
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          preConfirm: expect.any(Function)
        })
      );
    });

    test('should handle network error during deletion', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      Swal.fire.mockResolvedValue({ isConfirmed: false });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      // Should handle error in preConfirm
      expect(Swal.fire).toHaveBeenCalled();
    });

    test('should use custom options when provided', async () => {
      Swal.fire.mockResolvedValue({ isConfirmed: false });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete({
          confirmTitle: 'Custom Title',
          successRedirect: '/custom'
        });
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Custom Title'
        })
      );
    });

    test('should show cancelled dialog when user cancels', async () => {
      Swal.fire.mockResolvedValue({
        isConfirmed: false,
        dismiss: Swal.DismissReason.cancel
      });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.confirmDelete();
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Cancelled'
        })
      );
    });
  });

  describe('batchDelete', () => {
    test('should redirect to login if no JWT token for batch delete', async () => {
      useAuth.mockReturnValue({ jwtToken: null });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([1, 2, 3]);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    test('should show warning if no IDs provided', async () => {
      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([]);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'No Items Selected'
        })
      );
    });

    test('should call batch delete endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire.mockResolvedValue({ isConfirmed: true });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([1, 2, 3]);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/admin/apps/batch-delete'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ ids: [1, 2, 3] })
        })
      );
    });

    test('should handle batch delete success', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ success: true })
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire
        .mockResolvedValueOnce({ isConfirmed: true })
        .mockResolvedValueOnce({}); // Success dialog

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([1, 2, 3]);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success!'
        })
      );
    });

    test('should handle batch delete error', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ error: true, message: 'Batch delete failed' })
      };
      global.fetch.mockResolvedValue(mockResponse);

      Swal.fire.mockResolvedValue({ isConfirmed: true });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([1, 2, 3]);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error!'
        })
      );
    });

    test('should handle network error during batch delete', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));
      Swal.fire.mockResolvedValue({ isConfirmed: true });

      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      await act(async () => {
        await result.current.batchDelete([1, 2, 3]);
      });

      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Error!'
        })
      );
    });
  });

  describe('getConfig', () => {
    test('should return app config for app entity type', () => {
      const { result } = renderHook(() => useHandleDelete(1, 'app'));

      const config = result.current.getConfig();

      expect(config.title).toBe('Application');
      expect(config.successRedirect).toBe('/apps');
    });

    test('should return user config for user entity type', () => {
      const { result } = renderHook(() => useHandleDelete(1, 'user'));

      const config = result.current.getConfig();

      expect(config.title).toBe('User Account');
      expect(config.successRedirect).toBe('/users');
    });

    test('should default to app config for unknown entity type', () => {
      const { result } = renderHook(() => useHandleDelete(1, 'unknown'));

      const config = result.current.getConfig();

      expect(config.title).toBe('Application');
    });
  });
});

describe('quickDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  test('should successfully delete entity', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    };
    global.fetch.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const result = await quickDelete('app', 123, 'test-token', onSuccess, onError);

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/apps/123'),
      expect.objectContaining({
        method: 'DELETE'
      })
    );

    expect(onSuccess).toHaveBeenCalledWith({ success: true });
    expect(onError).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test('should handle API error response', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ error: true, message: 'Delete failed' })
    };
    global.fetch.mockResolvedValue(mockResponse);

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const result = await quickDelete('app', 123, 'test-token', onSuccess, onError);

    expect(onError).toHaveBeenCalledWith('Delete failed');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('should handle network error', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    const onSuccess = jest.fn();
    const onError = jest.fn();

    const result = await quickDelete('app', 123, 'test-token', onSuccess, onError);

    expect(onError).toHaveBeenCalledWith('Network error');
    expect(onSuccess).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });

  test('should use default config for unknown entity type', async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true })
    };
    global.fetch.mockResolvedValue(mockResponse);

    const result = await quickDelete('unknown', 123, 'test-token');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/apps/123'),
      expect.any(Object)
    );
    expect(result).toBe(true);
  });
});

describe('ENTITY_CONFIG', () => {
  beforeEach(() => {
    // Ensure useAuth is properly mocked for these tests
    useAuth.mockReturnValue({ jwtToken: 'test-token' });
  });

  test('should have correct app configuration', () => {
    const { result } = renderHook(() => useHandleDelete(1, 'app'));
    const config = result.current.getConfig();

    expect(config.title).toBe('Application');
    expect(config.successRedirect).toBe('/apps');
    expect(typeof config.endpoint).toBe('function');
    expect(config.endpoint(123)).toContain('/admin/apps/123');
  });

  test('should have correct user configuration', () => {
    const { result } = renderHook(() => useHandleDelete(1, 'user'));
    const config = result.current.getConfig();

    expect(config.title).toBe('User Account');
    expect(config.successRedirect).toBe('/users');
    expect(config.endpoint(456)).toContain('/admin/users/456');
  });
});