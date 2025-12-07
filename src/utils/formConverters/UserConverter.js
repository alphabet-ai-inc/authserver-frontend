/**
 * UserConverter.js
 * ---------------
 * Converts form data to API-ready user data and vice versa.
 * Handles user-specific data transformations and validation.
 */

export const convertUserData = (formData, isNewUser = false) => {
  // Create a copy to avoid mutating the original
  const userData = { ...formData };

  // Remove confirmation fields
  delete userData.password_confirm;

  // Handle password - only include if provided (for updates)
  if (userData.password === '') {
    delete userData.password;
  }

  // Convert string numbers to actual numbers
  const numberFields = [
    'profile_id', 'group_id', 'company_id', 'dbsauth_id',
    'last_app', 'last_db', 'tries'
  ];

  numberFields.forEach(field => {
    if (userData[field] !== undefined && userData[field] !== null && userData[field] !== '') {
      userData[field] = parseInt(userData[field], 10);
    } else {
      userData[field] = null;
    }
  });

  // Convert boolean fields
  userData.active = Boolean(userData.active);
  userData.blocked = Boolean(userData.blocked);

  // Set timestamps
  const now = Math.floor(Date.now() / 1000);

  if (isNewUser) {
    userData.created = now;
    userData.updated = now;
    userData.activation_time = now;
    userData.last_login = 0;
    userData.last_try = 0;
  } else {
    userData.updated = now;
    // Don't modify existing timestamps unless explicitly changed
  }

  // Ensure default values
  if (!userData.lan) userData.lan = 'en';
  if (!userData.company_id) userData.company_id = 1;
  if (userData.tries === undefined || userData.tries === null) userData.tries = 0;

  return userData;
};

/**
 * Converts API user data to form-ready data
 */
export const convertApiToFormData = (apiData) => {
  const formData = { ...apiData };

  // Convert null/undefined to empty strings for form inputs
  const stringFields = ['first_name', 'last_name', 'email', 'code', 'role', 'lan'];
  stringFields.forEach(field => {
    if (formData[field] === null || formData[field] === undefined) {
      formData[field] = '';
    }
  });

  // Ensure boolean fields are booleans
  formData.active = Boolean(formData.active);
  formData.blocked = Boolean(formData.blocked);

  // Convert numbers to strings for form inputs (React expects strings for inputs)
  const numberFields = [
    'profile_id', 'group_id', 'company_id', 'dbsauth_id',
    'last_app', 'last_db', 'tries'
  ];

  numberFields.forEach(field => {
    if (formData[field] === null || formData[field] === undefined) {
      formData[field] = '';
    } else {
      formData[field] = String(formData[field]);
    }
  });

  // Add empty password fields for form
  formData.password = '';
  formData.password_confirm = '';

  return formData;
};

/**
 * Validates user data before conversion
 */
export const validateUserData = (formData, isNewUser = false) => {
  const errors = {};

  // Required fields
  if (!formData.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!formData.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = 'Email is invalid';
  }

  // Password validation
  if (isNewUser && !formData.password) {
    errors.password = 'Password is required for new users';
  } else if (formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password && formData.password !== formData.password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }

  // Numeric field validation
  const numberFields = ['profile_id', 'group_id', 'company_id', 'dbsauth_id'];
  numberFields.forEach(field => {
    if (formData[field] && isNaN(parseInt(formData[field], 10))) {
      errors[field] = 'Must be a valid number';
    }
  });

  return Object.keys(errors).length === 0 ? null : errors;
};

const UserConverter = {
  convertUserData,
  convertApiToFormData,
  validateUserData
};

export { UserConverter };