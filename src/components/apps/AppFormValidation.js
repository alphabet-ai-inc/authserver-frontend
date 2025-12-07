const REQUIRED_FIELDS = [
  'name',
  'release',
  'description',
  'title',
];

const validateForm = (formData = {}) => {
  const errors = {};

  // Handle null/undefined formData
  if (!formData) {
    REQUIRED_FIELDS.forEach(fieldName => {
      errors[fieldName] = "This field is required";
    });
    return errors;
  }

  REQUIRED_FIELDS.forEach(fieldName => {
    const value = formData[fieldName];

    // Check if value is null/undefined/empty string/whitespace-only
    if (!value || (typeof value === 'string' && value.trim().length === 0)) {
      errors[fieldName] = "This field is required";
    }
  });

  // Add specific field validations
  if (formData.web && !isValidUrl(formData.web)) {
    errors.web = "Please enter a valid URL";
  }

  if (formData.size !== undefined && formData.size !== null && formData.size !== '') {
    // Convert to number and check if it's NaN
    const numValue = Number(formData.size);
    if (isNaN(numValue) || !isFinite(numValue)) {
      errors.size = "Must be a valid number";
    }
  }

  return errors;
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export { validateForm };