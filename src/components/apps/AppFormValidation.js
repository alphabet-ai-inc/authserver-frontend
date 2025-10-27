  const REQUIRED_FIELDS = [
    'name',
    'release',
    'description',
    'title',
  ];

  const validateForm = (formData = {}) => {
    const errors = {};

  REQUIRED_FIELDS.forEach(fieldName => {
    if (!formData[fieldName] ||
        ((typeof formData[fieldName]) === 'string' && (formData[fieldName].length === 0))) {
      errors[fieldName] = "This field is required";
    }
  });

  // Add specific field validations
  if (formData.web && !isValidUrl(formData.web)) {
    errors.web = "Please enter a valid URL";
  }

  if (formData.size && isNaN(formData.size)) {
    errors.size = "Must be a valid number";
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