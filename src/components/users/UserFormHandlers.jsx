import { convertUserData, convertApiToFormData } from '../../utils/formConverters/UserConverter';

export const fetchUserForEdit = async (userId, jwtToken) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  });

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/${userId}`, {
    method: 'GET',
    headers
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  const apiData = await response.json();
  return convertApiToFormData(apiData); // Convert API response to form-ready data
};

export const fetchUserDetails = async (jwtToken) => {
  try {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwtToken}`
    });

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/users/details`, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      return { roles: [], profiles: [], groups: [], companies: [] };
    }

    return await response.json();
  } catch (error) {
    // Handle network errors or other fetch exceptions
    return { roles: [], profiles: [], groups: [], companies: [] };
  }
};

export const submitUserForm = async (formData, userId, jwtToken) => {
  const isNewUser = userId === 0;
  const apiData = convertUserData(formData, isNewUser);

  const method = isNewUser ? 'POST' : 'PUT';
  const url = isNewUser
    ? `${process.env.REACT_APP_BACKEND_URL}/users`
    : `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`;

  const headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  });

  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(apiData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to ${method === 'POST' ? 'create' : 'update'} user`);
  }

  return await response.json();
};