// src/components/apps/__tests__/AppFormHandlers.test.jsx
import {
  fetchAppDetails,
  fetchAppForEdit,
  submitAppForm,
  deleteApp,
  uploadAppFile,
  fetchAppById,
  fetchAllApps
} from '../AppFormHandlers.jsx';

import { handleError } from '../../../utils/fetchHandling.js';
// Mock the fetch API
global.fetch = jest.fn();
global.console.error = jest.fn();

// Mock handleError
jest.mock('../../../utils/fetchHandling', () => ({
  handleError: jest.fn()
}));

describe('AppFormHandlers', () => {
  const mockJwtToken = 'test-jwt-token';
  const mockBackendUrl = 'http://localhost:5000/api';

  beforeEach(() => {
    fetch.mockClear();
    console.error.mockClear();
    process.env.REACT_APP_BACKEND_URL = mockBackendUrl;
  });

  describe('fetchAppDetails', () => {
    it('should fetch releases successfully', async () => {
      const mockReleases = [
        { id: 1, value: 'v1.0' },
        { id: 2, value: 'v2.0' }
      ];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockReleases)
      });

      const result = await fetchAppDetails(mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/releases`,
        {
          headers: {
            Authorization: `Bearer ${mockJwtToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual({
        release: [
          { value: 1, label: 'v1.0' },
          { value: 2, label: 'v2.0' }
        ]
      });
    });

    it('should handle fetch error', async () => {
      fetch.mockResolvedValueOnce({
        ok: false
      });

      const result = await fetchAppDetails(mockJwtToken);

      expect(handleError).toHaveBeenCalled();
      expect(result).toEqual({});
    });
  });

  describe('fetchAppForEdit', () => {
    it('should fetch existing app for edit', async () => {
      const mockApp = { id: 1, name: 'Test App' };
      const appId = 1;

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApp)
      });

      const result = await fetchAppForEdit(appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps/1`,
        {
          headers: {
            'Authorization': `Bearer ${mockJwtToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockApp);
    });

    it('should fetch new app template when appId is 0', async () => {
      const mockNewAppTemplate = { id: 0, name: '' };
      const appId = 0;

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNewAppTemplate)
      });

      const result = await fetchAppForEdit(appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps/new`,
        expect.any(Object)
      );

      expect(result).toEqual(mockNewAppTemplate);
    });

    it('should throw error when fetch fails', async () => {
      const appId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found')
      });

      await expect(fetchAppForEdit(appId, mockJwtToken)).rejects.toThrow('Failed to fetch app: 404 - Not Found');
    });
  });

  describe('submitAppForm', () => {
    const mockFormData = { name: 'Test App', version: '1.0' };

    it('should create new app when appId is 0', async () => {
      const appId = 0;
      const mockResponse = { id: 123, ...mockFormData };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers(),
        json: () => Promise.resolve(mockResponse)
      });

      const result = await submitAppForm(mockFormData, appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockJwtToken}`
          },
          credentials: 'include',
          body: JSON.stringify(mockFormData)
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should update existing app when appId is not 0', async () => {
      const appId = 123;
      const mockResponse = { id: 123, ...mockFormData };

      fetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: () => Promise.resolve(mockResponse)
      });

      const result = await submitAppForm(mockFormData, appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps/123`,
        {
          method: 'PUT',
          headers: expect.any(Object),
          credentials: 'include',
          body: JSON.stringify(mockFormData)
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should handle 401 unauthorized error', async () => {
      const appId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Unauthorized' })
      });

      await expect(submitAppForm(mockFormData, appId, mockJwtToken)).rejects.toThrow('SESSION_EXPIRED');
    });

    it('should handle network errors', async () => {
      const appId = 1;

      fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(submitAppForm(mockFormData, appId, mockJwtToken)).rejects.toThrow('Network error: Unable to connect to server. Please check your connection.');
    });

    it('should handle JSON parse error in error response', async () => {
      const appId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        text: () => Promise.resolve('Internal Server Error')
      });

      await expect(submitAppForm(mockFormData, appId, mockJwtToken)).rejects.toThrow('Server error: 500 - Internal Server Error');
    });
  });

  describe('deleteApp', () => {
    it('should delete app successfully', async () => {
      const appId = 1;
      const mockResponse = { success: true };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await deleteApp(appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps/1`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${mockJwtToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockResponse);
    });

    it('should throw error when delete fails', async () => {
      const appId = 1;

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        text: () => Promise.resolve('App not found')
      });

      await expect(deleteApp(appId, mockJwtToken)).rejects.toThrow('Delete failed: 404 - App not found');
    });
  });

  describe('uploadAppFile', () => {
    it('should upload file successfully', async () => {
      const appId = 1;
      const fieldName = 'logo';
      const mockFile = new File(['test'], 'logo.png', { type: 'image/png' });
      const mockResponse = { url: 'http://example.com/logo.png' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await uploadAppFile(mockFile, appId, fieldName, mockJwtToken);

      const formData = new FormData();
      formData.append('file', mockFile);
      formData.append('app_id', appId.toString());
      formData.append('field_name', fieldName);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps/1/upload`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mockJwtToken}`
          },
          credentials: 'include',
          body: expect.any(FormData)
        }
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe('fetchAppById', () => {
    it('should fetch app with authentication', async () => {
      const appId = 1;
      const mockApp = { id: 1, name: 'Test App' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApp)
      });

      const result = await fetchAppById(appId, mockJwtToken);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/apps/1`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockJwtToken}`
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockApp);
    });

    it('should fetch app without authentication', async () => {
      const appId = 1;
      const mockApp = { id: 1, name: 'Test App' };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApp)
      });

      const result = await fetchAppById(appId);

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/apps/1`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockApp);
    });
  });

  describe('fetchAllApps', () => {
    it('should fetch all apps with authentication', async () => {
      const mockApps = [{ id: 1, name: 'App 1' }, { id: 2, name: 'App 2' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApps)
      });

      const result = await fetchAllApps(mockJwtToken, 'admin/apps');

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/admin/apps`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mockJwtToken}`
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockApps);
    });

    it('should fetch all apps without authentication', async () => {
      const mockApps = [{ id: 1, name: 'App 1' }, { id: 2, name: 'App 2' }];

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockApps)
      });

      const result = await fetchAllApps();

      expect(fetch).toHaveBeenCalledWith(
        `${mockBackendUrl}/apps`,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      expect(result).toEqual(mockApps);
    });
  });
});