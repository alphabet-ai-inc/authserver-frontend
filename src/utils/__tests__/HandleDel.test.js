import { renderHook, act } from '@testing-library/react';
import { useHandleDelete } from './HandleDel';

// Mock dependencies
const mockNavigate = jest.fn();
let mockJwtToken = 'test-token';

jest.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    jwtToken: mockJwtToken,
  }),
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
}));

describe('useHandleDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    const Swal = require('sweetalert2');
    Swal.fire.mockResolvedValue({ isConfirmed: true });
    mockJwtToken = 'test-token'; // reset default
  });

  afterEach(() => {
    global.fetch.mockRestore();
  });

  test('redirects to login if no jwtToken', async () => {
    mockJwtToken = null; // set token to null for this test

    const { result } = renderHook(() => useHandleDelete(1));
    await act(async () => {
      await result.current();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('shows confirm dialog and deletes app on confirm', async () => {
    const Swal = require('sweetalert2');
    Swal.fire.mockResolvedValue({ isConfirmed: true });

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: false }),
    });

    const { result } = renderHook(() => useHandleDelete(2));
    await act(async () => {
      await result.current();
    });

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Delete App?' }));
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/admin/apps/2'),
      expect.objectContaining({ method: 'DELETE' })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/apps');
  });

  test('shows error dialog if delete returns error', async () => {
    const Swal = require('sweetalert2');
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    Swal.fire.mockResolvedValueOnce(); // For error dialog

    global.fetch.mockResolvedValue({
      json: () => Promise.resolve({ error: true, message: 'Delete failed' }),
    });

    const { result } = renderHook(() => useHandleDelete(3));
    await act(async () => {
      await result.current();
    });

    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: 'Error!' }));
  });
});