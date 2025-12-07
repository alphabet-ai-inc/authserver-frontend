// UserAPI.test.js
import { fetchUserForEdit, fetchUserDetails, submitUserForm } from '../../users/UserFormHandlers.jsx';
import { convertApiToFormData, convertUserData } from '../../../utils/formConverters/UserConverter';

// Mock the converters module
jest.mock('../../../utils/formConverters/UserConverter', () => ({
  convertApiToFormData: jest.fn(),
  convertUserData: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock environment variable
const originalEnv = process.env;

describe('UserAPI', () => {
  const mockJwtToken = 'test-jwt-token';
  const mockUserId = 123;
  const mockBackendUrl = 'http://mock-backend.com';

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      REACT_APP_BACKEND_URL: mockBackendUrl,
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
    convertApiToFormData.mockClear();
    convertUserData.mockClear();
  });

  describe('fetchUserForEdit', () => {
    const mockApiData = { id: mockUserId, name: 'Test User' };
    const mockFormData = { name: 'Test User', email: 'test@example.com' };

    it('should fetch user data and convert it to form data successfully', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiData),
      };

      global.fetch.mockResolvedValue(mockResponse);
      convertApiToFormData.mockReturnValue(mockFormData);

      const result = await fetchUserForEdit(mockUserId, mockJwtToken);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/users/${mockUserId}`,
        {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockJwtToken}`,
          }),
        }
      );

      expect(convertApiToFormData).toHaveBeenCalledWith(mockApiData);
      expect(result).toEqual(mockFormData);
    });

    it('should throw an error when fetch fails', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
      };

      global.fetch.mockResolvedValue(mockResponse);

      await expect(fetchUserForEdit(mockUserId, mockJwtToken))
        .rejects
        .toThrow('Failed to fetch user: 404');

      expect(convertApiToFormData).not.toHaveBeenCalled();
    });

    it('should use correct headers', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockApiData),
      };

      global.fetch.mockResolvedValue(mockResponse);
      convertApiToFormData.mockReturnValue(mockFormData);

      await fetchUserForEdit(mockUserId, mockJwtToken);

      const fetchCall = global.fetch.mock.calls[0];
      const headers = fetchCall[1].headers;

      expect(headers.get('Content-Type')).toBe('application/json');
      expect(headers.get('Authorization')).toBe(`Bearer ${mockJwtToken}`);
    });
  });

  describe('fetchUserDetails', () => {
    const mockSuccessData = {
      roles: ['admin', 'user'],
      profiles: ['profile1', 'profile2'],
      groups: ['group1'],
      companies: ['company1', 'company2'],
    };

    it('should return user details on successful fetch', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessData),
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchUserDetails(mockJwtToken);

      expect(global.fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/users/details`,
        {
          method: 'GET',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockJwtToken}`,
          }),
        }
      );

      expect(result).toEqual(mockSuccessData);
    });

    it('should return empty arrays when fetch fails', async () => {
      const mockResponse = {
        ok: false,
      };

      global.fetch.mockResolvedValue(mockResponse);

      const result = await fetchUserDetails(mockJwtToken);

      expect(result).toEqual({
        roles: [],
        profiles: [],
        groups: [],
        companies: [],
      });
    });

    it('should handle network errors gracefully', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await fetchUserDetails(mockJwtToken);

      expect(result).toEqual({
        roles: [],
        profiles: [],
        groups: [],
        companies: [],
      });
    });
  });

  describe('submitUserForm', () => {
    const mockFormData = { name: 'Test User', email: 'test@example.com' };
    const mockApiData = { name: 'Test User', email: 'test@example.com', isNew: true };
    const mockSuccessResponse = { id: mockUserId, ...mockApiData };
    const mockErrorData = { message: 'Validation failed' };

    describe('for new user (POST)', () => {
      const newUserId = 0;

      it('should successfully create a new user', async () => {
        convertUserData.mockReturnValue(mockApiData);

        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse),
        };

        global.fetch.mockResolvedValue(mockResponse);

        const result = await submitUserForm(mockFormData, newUserId, mockJwtToken);

        expect(convertUserData).toHaveBeenCalledWith(mockFormData, true);
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockBackendUrl}/users`,
          {
            method: 'POST',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mockJwtToken}`,
            }),
            body: JSON.stringify(mockApiData),
          }
        );
        expect(result).toEqual(mockSuccessResponse);
      });

      it('should throw an error with message when creation fails', async () => {
        convertUserData.mockReturnValue(mockApiData);

        const mockResponse = {
          ok: false,
          json: jest.fn().mockResolvedValue(mockErrorData),
        };

        global.fetch.mockResolvedValue(mockResponse);

        await expect(submitUserForm(mockFormData, newUserId, mockJwtToken))
          .rejects
          .toThrow('Validation failed');

        expect(convertUserData).toHaveBeenCalledWith(mockFormData, true);
      });

      it('should throw generic error when no message in error response', async () => {
        convertUserData.mockReturnValue(mockApiData);

        const mockResponse = {
          ok: false,
          json: jest.fn().mockRejectedValue(new Error('Invalid JSON')),
        };

        global.fetch.mockResolvedValue(mockResponse);

        await expect(submitUserForm(mockFormData, newUserId, mockJwtToken))
          .rejects
          .toThrow('Failed to create user');
      });
    });

    describe('for existing user (PUT)', () => {
      it('should successfully update an existing user', async () => {
        convertUserData.mockReturnValue({ ...mockApiData, isNew: false });

        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse),
        };

        global.fetch.mockResolvedValue(mockResponse);

        const result = await submitUserForm(mockFormData, mockUserId, mockJwtToken);

        expect(convertUserData).toHaveBeenCalledWith(mockFormData, false);
        expect(global.fetch).toHaveBeenCalledWith(
          `${mockBackendUrl}/users/${mockUserId}`,
          {
            method: 'PUT',
            headers: new Headers({
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${mockJwtToken}`,
            }),
            body: JSON.stringify({ ...mockApiData, isNew: false }),
          }
        );
        expect(result).toEqual(mockSuccessResponse);
      });

      it('should throw an error with message when update fails', async () => {
        convertUserData.mockReturnValue({ ...mockApiData, isNew: false });

        const mockResponse = {
          ok: false,
          json: jest.fn().mockResolvedValue(mockErrorData),
        };

        global.fetch.mockResolvedValue(mockResponse);

        await expect(submitUserForm(mockFormData, mockUserId, mockJwtToken))
          .rejects
          .toThrow('Validation failed');
      });

      it('should use correct HTTP method based on userId', async () => {
        convertUserData.mockReturnValue(mockApiData);

        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSuccessResponse),
        };

        global.fetch.mockResolvedValue(mockResponse);

        // Test new user (POST)
        await submitUserForm(mockFormData, 0, mockJwtToken);
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining(`${mockBackendUrl}/users`),
          expect.objectContaining({ method: 'POST' })
        );

        // Test existing user (PUT)
        await submitUserForm(mockFormData, mockUserId, mockJwtToken);
        expect(global.fetch).toHaveBeenLastCalledWith(
          expect.stringContaining(`${mockBackendUrl}/users/${mockUserId}`),
          expect.objectContaining({ method: 'PUT' })
        );
      });
    });

    it('should pass correct isNew flag to converter', async () => {
      convertUserData.mockReturnValue(mockApiData);

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockSuccessResponse),
      };

      global.fetch.mockResolvedValue(mockResponse);

      // Test with new user (userId = 0)
      await submitUserForm(mockFormData, 0, mockJwtToken);
      expect(convertUserData).toHaveBeenLastCalledWith(mockFormData, true);

      // Test with existing user
      await submitUserForm(mockFormData, mockUserId, mockJwtToken);
      expect(convertUserData).toHaveBeenLastCalledWith(mockFormData, false);
    });
  });
});