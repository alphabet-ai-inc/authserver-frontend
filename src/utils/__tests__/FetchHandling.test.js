// __tests__/utils/fetchWithHandling.test.js

import { fetchWithHandling, handleError } from '../FetchHandling';

// Mock fetch globally
global.fetch = vi.fn();

// Mock console.error and alert
console.error = vi.fn();
global.alert = vi.fn();

describe('fetchWithHandling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should successfully fetch and return JSON data', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = {
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockData)
    };

    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchWithHandling('https://api.example.com/data');

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', {});
    expect(result).toEqual(mockData);
  });

  test('should successfully fetch and return text data', async () => {
    const mockText = 'Plain text response';
    const mockResponse = {
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('text/plain')
      },
      text: vi.fn().mockResolvedValue(mockText)
    };

    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchWithHandling('https://api.example.com/data');

    expect(result).toBe(mockText);
  });

  test('should handle response without content-type header', async () => {
    const mockText = 'Response without content-type';
    const mockResponse = {
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue(null)
      },
      text: vi.fn().mockResolvedValue(mockText)
    };

    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchWithHandling('https://api.example.com/data');

    expect(result).toBe(mockText);
  });

  test('should throw error with JSON error data when response not ok', async () => {
    const mockError = { error: 'Invalid request' };
    const mockResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockError)
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow('Invalid request');
  });

  test('should throw error with stringified JSON when no error property', async () => {
    const mockError = { message: 'Something went wrong', code: 400 };
    const mockResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockError)
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow(JSON.stringify(mockError));
  });

  test('should throw error with text error data when response not ok and not JSON', async () => {
    const mockError = 'Server error: Internal server error';
    const mockResponse = {
      ok: false,
      status: 500,
      headers: {
        get: vi.fn().mockReturnValue('text/plain')
      },
      text: vi.fn().mockResolvedValue(mockError)
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow('Server error: Internal server error');
  });

  test('should pass options to fetch', async () => {
    const mockData = { success: true };
    const mockResponse = {
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockData)
    };

    global.fetch.mockResolvedValue(mockResponse);

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    };

    await fetchWithHandling('https://api.example.com/data', options);

    expect(fetch).toHaveBeenCalledWith('https://api.example.com/data', options);
  });

  test('should handle content-type with charset', async () => {
    const mockData = { id: 1, name: 'Test' };
    const mockResponse = {
      ok: true,
      headers: {
        get: vi.fn().mockReturnValue('application/json; charset=utf-8')
      },
      json: vi.fn().mockResolvedValue(mockData)
    };

    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchWithHandling('https://api.example.com/data');

    expect(result).toEqual(mockData);
  });

  test('should handle network errors', async () => {
    global.fetch.mockRejectedValue(new Error('Network error'));

    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow('Network error');
  });

  test('should handle JSON parsing errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockRejectedValue(new Error('Invalid JSON'))
    };

    global.fetch.mockResolvedValue(mockResponse);

    // The error from json() will propagate
    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow('Invalid JSON');
  });

  test('should handle text parsing errors gracefully', async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      headers: {
        get: vi.fn().mockReturnValue('text/plain')
      },
      text: vi.fn().mockRejectedValue(new Error('Text parsing error'))
    };

    global.fetch.mockResolvedValue(mockResponse);

    await expect(fetchWithHandling('https://api.example.com/data'))
      .rejects
      .toThrow('Text parsing error');
  });
});

describe('handleError', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should log error to console and show alert with error message', () => {
    const error = new Error('Something went wrong');

    handleError(error);

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(global.alert).toHaveBeenCalledWith('Something went wrong');
  });

  test('should handle error without message property', () => {
    const error = { customProperty: 'Custom error' };

    handleError(error);

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(global.alert).toHaveBeenCalledWith('An unexpected error occurred.');
  });

// With fixed handleError function
test('should handle string errors', () => {
  const error = 'String error message';

  handleError(error);

  expect(console.error).toHaveBeenCalledWith('Error:', error);
  expect(global.alert).toHaveBeenCalledWith('String error message');
});

test('should handle null/undefined errors', () => {
  handleError(null);

  expect(console.error).toHaveBeenCalledWith('Error:', null);
  expect(global.alert).toHaveBeenCalledWith('An unexpected error occurred.');

  console.error.mockClear();
  global.alert.mockClear();

  handleError(undefined);

  expect(console.error).toHaveBeenCalledWith('Error:', undefined);
  expect(global.alert).toHaveBeenCalledWith('An unexpected error occurred.');
});



  test('should handle empty string error message', () => {
    const error = new Error('');

    handleError(error);

    expect(console.error).toHaveBeenCalledWith('Error:', error);
    expect(global.alert).toHaveBeenCalledWith('An unexpected error occurred.');
  });
});

describe('Integration between fetchWithHandling and handleError', () => {
  test('typical error handling flow', async () => {
    const mockError = { error: 'Validation failed' };
    const mockResponse = {
      ok: false,
      status: 400,
      headers: {
        get: vi.fn().mockReturnValue('application/json')
      },
      json: vi.fn().mockResolvedValue(mockError)
    };

    global.fetch.mockResolvedValue(mockResponse);

    try {
      await fetchWithHandling('https://api.example.com/data');
    } catch (error) {
      handleError(error);
    }

    expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    expect(global.alert).toHaveBeenCalledWith('Validation failed');
  });

  test('network error handling flow', async () => {
    global.fetch.mockRejectedValue(new Error('Failed to fetch'));

    try {
      await fetchWithHandling('https://api.example.com/data');
    } catch (error) {
      handleError(error);
    }

    expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    expect(global.alert).toHaveBeenCalledWith('Failed to fetch');
  });
});