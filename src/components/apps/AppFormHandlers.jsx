// src/components/apps/AppFormHandlers.jsx
import { handleError } from "../../utils/FetchHandling";

/**
 * Fetches release options from backend
 */
export const fetchAppDetails = async (jwtToken) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/releases`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Failed to fetch releases');
    }

    const releases = await response.json();
    return {
      release: releases.map(r => ({ value: r.id, label: r.value }))
    };
  } catch (error) {
    handleError(error);
    return {};
  }
};

/**
 * Fetches app data for editing (admin route)
 */
export const fetchAppForEdit = async (appId, jwtToken, basePath = 'admin') => {
  try {
    const url = appId === 0
      ? `${process.env.REACT_APP_BACKEND_URL}/${basePath}/apps/new`
      : `${process.env.REACT_APP_BACKEND_URL}/${basePath}/apps/${appId}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch app: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching app:', error);
    throw error;
  }
};

/**
 * Main function to submit app form
 * NOTE: Data should already be converted by convertAppData before calling this
 */
export const submitAppForm = async (formData, appId, jwtToken, basePath = 'admin') => {
  try {
    console.log('App form data to submit:', formData);
    console.log('App ID:', appId);

    const isCreate = appId === 0;
    const url = isCreate
      ? `${process.env.REACT_APP_BACKEND_URL}/${basePath}/apps`
      : `${process.env.REACT_APP_BACKEND_URL}/${basePath}/apps/${appId}`;

    const method = isCreate ? 'POST' : 'PUT';

    console.log(`Submitting to: ${method} ${url}`);

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      },
      credentials: 'include',
      body: JSON.stringify(formData)
    });
    if (process.env.NODE_ENV === 'development') {
      console.log('Response status:', response.status);
      if (response.headers) {
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      }
    }

    if (!response.ok) {
      let errorMessage = `Server error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
        console.error('Error response data:', errorData);
      } catch {
        const errorText = await response.text();
        errorMessage = `${errorMessage} - ${errorText}`;
        console.error('Error response text:', errorText);
      }

      if (response.status === 401) {
        throw new Error('SESSION_EXPIRED');
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('Success response:', result);
    return result;

  } catch (error) {
    console.error('Error submitting app form:', error);

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to server. Please check your connection.');
    }

    throw error;
  }
};

/**
 * Deletes an app
 */
export const deleteApp = async (appId, jwtToken, basePath = 'admin') => {
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${basePath}/apps/${appId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Delete failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting app:', error);
    throw error;
  }
};

/**
 * Uploads a file (logo, etc.) separately from app data
 */
export const uploadAppFile = async (file, appId, fieldName, jwtToken) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('app_id', appId);
    formData.append('field_name', fieldName);

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/admin/apps/${appId}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      },
      credentials: 'include',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`File upload failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Fetches a single app by ID (public route)
 */
export const fetchAppById = async (appId, jwtToken = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/apps/${appId}`, {
      headers: headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch app: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching app by ID:', error);
    throw error;
  }
};

/**
 * Fetches all apps (with optional authentication)
 */
export const fetchAllApps = async (jwtToken = null, basePath = 'apps') => {
  try {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (jwtToken) {
      headers['Authorization'] = `Bearer ${jwtToken}`;
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${basePath}`, {
      headers: headers,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch apps: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching all apps:', error);
    throw error;
  }
};