export const validateUserForm = (formData, fieldGroups) => {
  const errors = {};

  // Validate required fields
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

  // Password validation for new users
  if (formData.password && formData.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (formData.password && formData.password !== formData.password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }

  return Object.keys(errors).length > 0 ? errors : null;
};