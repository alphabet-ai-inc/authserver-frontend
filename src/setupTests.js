// vi-dom adds custom vi matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/vi-dom
import '@testing-library/vi-dom';

// Mock SweetAlert2
vi.mock('sweetalert2', () => ({
  fire: vi.fn().mockResolvedValue({}),
  close: vi.fn(),
}));

// Mock axios
vi.mock('axios', () => ({
  __esModule: true,
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    create: vi.fn(() => ({
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
      interceptors: {
        request: { use: vi.fn(), eject: vi.fn() },
        response: { use: vi.fn(), eject: vi.fn() }
      }
    })),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() }
    }
  }
}));

// Mock fetch API for AppFormHandlers tests (ADD THIS)
global.fetch = vi.fn();

// Mock console.error to keep test output clean (ADD THIS)
global.console.error = vi.fn();

// Mock matchMedia for any component tests (ADD THIS)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Clear all mocks after each test (ADD THIS)
afterEach(() => {
  vi.clearAllMocks();
});
