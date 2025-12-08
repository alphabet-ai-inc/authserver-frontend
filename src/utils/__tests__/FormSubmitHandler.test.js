// src/utils/__tests__/FormSubmitHandler.test.js

// Mock global objects at the very top
global.fetch = jest.fn();

// Create a mock FormData class
global.FormData = class FormData {
  constructor() {
    this.data = new Map();
  }

  append(key, value) {
    this.data.set(key, value);
  }

  entries() {
    const entries = Array.from(this.data.entries());
    return entries[Symbol.iterator]();
  }

  get(key) {
    return this.data.get(key);
  }

  getAll(key) {
    const value = this.data.get(key);
    return value ? [value] : [];
  }
};

// Create a mock FileReader
global.FileReader = class FileReader {
  constructor() {
    this.readAsDataURL = jest.fn((file) => {
      this.file = file;
    });
    this.onload = null;
    this.onerror = null;
    this.result = null;
    this.file = null;
  }
};

// Now import the module
import {
  handleGenericFormSubmit,
  uploadFile,
  fileToBase64,
  scrollToFirstError,
} from '../FormSubmitHandler';

describe('Form Submit Handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Reset environment variable
    delete process.env.REACT_APP_BACKEND_URL;

    // Mock document methods
    document.getElementById = jest.fn();
    document.querySelector = jest.fn();

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  // Test 1: Basic function exports
  describe('Basic exports', () => {
    it('should export handleGenericFormSubmit function', () => {
      expect(typeof handleGenericFormSubmit).toBe('function');
    });

    it('should export uploadFile function', () => {
      expect(typeof uploadFile).toBe('function');
    });

    it('should export fileToBase64 function', () => {
      expect(typeof fileToBase64).toBe('function');
    });

    it('should export scrollToFirstError function', () => {
      expect(typeof scrollToFirstError).toBe('function');
    });
  });

  // Test 2: scrollToFirstError
  describe('scrollToFirstError', () => {
    it('should do nothing when errors is null', () => {
      expect(() => scrollToFirstError(null)).not.toThrow();
    });

    it('should do nothing when errors is undefined', () => {
      expect(() => scrollToFirstError(undefined)).not.toThrow();
    });

    it('should do nothing when errors is empty object', () => {
      expect(() => scrollToFirstError({})).not.toThrow();
    });

    it('should scroll to element with matching id', () => {
      const mockElement = { scrollIntoView: jest.fn() };
      document.getElementById.mockReturnValue(mockElement);

      scrollToFirstError({ email: 'Invalid email' });

      expect(document.getElementById).toHaveBeenCalledWith('email');
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
    });

    it('should find element by name when id not found', () => {
      document.getElementById.mockReturnValue(null);
      const mockElement = { scrollIntoView: jest.fn() };
      document.querySelector.mockReturnValue(mockElement);

      scrollToFirstError({ email: 'Invalid email' });

      expect(document.querySelector).toHaveBeenCalledWith('[name="email"]');
      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });
  });

  // Test 3: fileToBase64 - FIXED
  describe('fileToBase64', () => {
    it('should convert file to base64 string', async () => {
      const mockFile = { name: 'test.txt', type: 'text/plain' };

      // Track FileReader instances
      const fileReaderInstances = [];
      const OriginalFileReader = global.FileReader;
      global.FileReader = class MockFileReader {
        constructor() {
          const instance = new OriginalFileReader();
          fileReaderInstances.push(instance);
          return instance;
        }
      };

      const promise = fileToBase64(mockFile);

      // Get the FileReader instance that was created
      const fileReaderInstance = fileReaderInstances[0];

      // Trigger the onload callback
      if (fileReaderInstance.onload) {
        fileReaderInstance.result = 'data:text/plain;base64,test123';
        fileReaderInstance.onload();
      }

      const result = await promise;

      expect(fileReaderInstance.readAsDataURL).toHaveBeenCalledWith(mockFile);
      expect(result).toBe('data:text/plain;base64,test123');

      // Restore original FileReader
      global.FileReader = OriginalFileReader;
    });

    it('should reject on file read error', async () => {
      const mockFile = { name: 'test.txt' };

      // Track FileReader instances
      const fileReaderInstances = [];
      const OriginalFileReader = global.FileReader;
      global.FileReader = class MockFileReader {
        constructor() {
          const instance = new OriginalFileReader();
          fileReaderInstances.push(instance);
          return instance;
        }
      };

      const promise = fileToBase64(mockFile);

      // Get the FileReader instance
      const fileReaderInstance = fileReaderInstances[0];

      // Trigger the onerror callback
      if (fileReaderInstance.onerror) {
        fileReaderInstance.onerror(new Error('Read error'));
      }

      await expect(promise).rejects.toThrow('Read error');

      // Restore original FileReader
      global.FileReader = OriginalFileReader;
    });
  });

// Test 4: uploadFile - FIXED
describe('uploadFile', () => {
  it('should upload file successfully', async () => {
    const mockFile = { name: 'test.txt' };

    // Create a mock FormData with Jest mock functions
    const mockAppend = jest.fn();
    const OriginalFormData = global.FormData;
    global.FormData = class MockFormData {
      constructor() {
        this.append = mockAppend;
        this.data = new Map();
      }

      // Mock the entries method
      entries() {
        const entries = Array.from(this.data.entries());
        return entries[Symbol.iterator]();
      }
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ success: true }),
    };
    global.fetch.mockResolvedValue(mockResponse);

    const result = await uploadFile(mockFile, '/upload', 'test-token');

    // Verify append was called
    expect(mockAppend).toHaveBeenCalledWith('file', mockFile);

    expect(global.fetch).toHaveBeenCalled();
    expect(result).toEqual({ success: true });

    // Restore original FormData
    global.FormData = OriginalFormData;
  });

  it('should throw error on failed upload', async () => {
    const mockFile = { name: 'test.txt' };

    const mockResponse = {
      ok: false,
      status: 500,
    };
    global.fetch.mockResolvedValue(mockResponse);

    await expect(uploadFile(mockFile, '/upload', 'test-token'))
      .rejects.toThrow('File upload failed: 500');
  });

  it('should use custom field name', async () => {
    const mockFile = { name: 'test.txt' };

    // Create a mock FormData with Jest mock functions
    const mockAppend = jest.fn();
    const OriginalFormData = global.FormData;
    global.FormData = class MockFormData {
      constructor() {
        this.append = mockAppend;
        this.data = new Map();
      }

      entries() {
        const entries = Array.from(this.data.entries());
        return entries[Symbol.iterator]();
      }
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    global.fetch.mockResolvedValue(mockResponse);

    await uploadFile(mockFile, '/upload', 'test-token', 'document');

    expect(mockAppend).toHaveBeenCalledWith('document', mockFile);

    // Restore original FormData
    global.FormData = OriginalFormData;
  });
});
  // Test 5: handleGenericFormSubmit
  describe('handleGenericFormSubmit', () => {
    const mockEvent = {
      preventDefault: jest.fn(),
    };

    const createMockFormElement = () => {
      const mockFormElement = {
        id: 'test-form',
        querySelectorAll: jest.fn(() => []),
      };
      return mockFormElement;
    };

    beforeEach(() => {
      mockEvent.preventDefault.mockClear();
    });

    it('should prevent default event behavior', async () => {
      const mockFormElement = createMockFormElement();
      document.getElementById.mockReturnValue(mockFormElement);

      const mockSubmitFn = jest.fn().mockResolvedValue({ id: 1 });

      await handleGenericFormSubmit({
        event: mockEvent,
        formId: 'test-form',
        submitFn: mockSubmitFn,
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should return error if form not found', async () => {
      document.getElementById.mockReturnValue(null);

      const result = await handleGenericFormSubmit({
        event: mockEvent,
        formId: 'non-existent',
        submitFn: jest.fn(),
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Form with ID "non-existent" not found');
    });

    it('should handle successful form submission', async () => {
      const mockFormElement = createMockFormElement();
      document.getElementById.mockReturnValue(mockFormElement);

      const mockSubmitFn = jest.fn().mockResolvedValue({ id: 1 });

      const result = await handleGenericFormSubmit({
        event: mockEvent,
        formId: 'test-form',
        submitFn: mockSubmitFn,
      });

      // Since we're mocking FormData, it won't extract real form data
      // but the function should complete without error
      expect(mockSubmitFn).toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const mockFormElement = createMockFormElement();
      document.getElementById.mockReturnValue(mockFormElement);

      const validationErrors = { email: 'Invalid email' };
      const mockValidateFn = jest.fn().mockReturnValue(validationErrors);
      const mockOnError = jest.fn();

      const result = await handleGenericFormSubmit({
        event: mockEvent,
        formId: 'test-form',
        submitFn: jest.fn(),
        validateFn: mockValidateFn,
        onError: mockOnError,
      });

      expect(mockValidateFn).toHaveBeenCalled();
    });

    it('should handle API errors', async () => {
      const mockFormElement = createMockFormElement();
      document.getElementById.mockReturnValue(mockFormElement);

      const mockSubmitFn = jest.fn().mockRejectedValue(new Error('API Error'));
      const mockOnError = jest.fn();

      const result = await handleGenericFormSubmit({
        event: mockEvent,
        formId: 'test-form',
        submitFn: mockSubmitFn,
        onError: mockOnError,
      });

      expect(result.success).toBe(false);
    });

    it('should handle file uploads in forms', async () => {
      const mockFile = {
        name: 'test.jpg',
        type: 'image/jpeg',
        size: 1024
      };

      const mockFileInput = {
        name: 'avatar',
        files: [mockFile],
      };

      const mockFormElement = createMockFormElement();
      mockFormElement.querySelectorAll.mockReturnValue([mockFileInput]);

      document.getElementById.mockReturnValue(mockFormElement);

      // Track FileReader instances
      const fileReaderInstances = [];
      const OriginalFileReader = global.FileReader;
      global.FileReader = class MockFileReader {
        constructor() {
          const instance = new OriginalFileReader();
          fileReaderInstances.push(instance);
          return instance;
        }
      };

      const mockSubmitFn = jest.fn().mockResolvedValue({ id: 1 });

      const promise = handleGenericFormSubmit({
        event: mockEvent,
        formId: 'test-form',
        submitFn: mockSubmitFn,
      });

      // Get the FileReader instance
      const fileReaderInstance = fileReaderInstances[0];

      // Trigger file reading
      if (fileReaderInstance && fileReaderInstance.onload) {
        fileReaderInstance.result = 'data:image/jpeg;base64,filecontent';
        fileReaderInstance.onload();
      }

      const result = await promise;

      expect(mockFormElement.querySelectorAll).toHaveBeenCalledWith('input[type="file"]');

      // Restore original FileReader
      global.FileReader = OriginalFileReader;
    });
  });
});