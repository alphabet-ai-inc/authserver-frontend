// src/utils/formSubmitHandler.js

/**
 * Generic form submission handler for any entity
 * @param {Object} options - Configuration options
 * @param {Event} options.event - Form submit event
 * @param {string} options.formId - ID of the form element
 * @param {Object} options.existingData - Existing data (for updates)
 * @param {number} options.entityId - Entity ID (0 for create, >0 for update)
 * @param {Function} options.validateFn - Validation function
 * @param {Function} options.convertFn - Data conversion function
 * @param {Function} options.submitFn - API submission function
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onError - Error callback
 * @param {Array} options.fileFields - List of file field names
 * @param {Array} options.ignoreFields - Fields to ignore
 * @returns {Promise<Object>} - Result of submission
 */
export const handleGenericFormSubmit = async ({
  event,
  formId,
  existingData = {},
  entityId = 0,
  validateFn,
  convertFn,
  submitFn,
  onSuccess,
  onError,
  fileFields = ['logo', 'image', 'thumbnail', 'icon', 'avatar', 'photo', 'picture'],
  ignoreFields = ['csrf_token', '_method', 'submit']
}) => {
  if (event) event.preventDefault();

  try {
    // 1. Get form values
    const formElement = document.getElementById(formId);
    if (!formElement) {
      throw new Error(`Form with id "${formId}" not found`);
    }

    const formValues = extractFormValues(formElement, fileFields, ignoreFields, existingData);

    // 2. Merge with existing data
    const submissionData = {
      ...existingData,
      ...formValues
    };

    // 3. Clean data (handle empty objects, etc.)
    const cleanedData = cleanSubmissionData(submissionData, fileFields);

    // 4. Add entity ID for updates
    if (entityId !== 0) {
      cleanedData.id = entityId;
    }

    console.log(`Submitting ${formId} data:`, cleanedData);

    // 5. Validate (if validation function provided)
    let validationErrors = {};
    if (validateFn && typeof validateFn === 'function') {
      validationErrors = validateFn(cleanedData);

      if (Object.keys(validationErrors).length > 0) {
      const error = new Error('Form validation failed');
      error.name = 'ValidationError';
      error.errors = validationErrors;
      throw error;
        }
    }

    // 6. Convert data for API (if conversion function provided)
    let apiData = cleanedData;
    if (convertFn && typeof convertFn === 'function') {
      apiData = convertFn(cleanedData, entityId === 0);
    }

    // 7. Submit to API
    const result = await submitFn(apiData, entityId);

    // 8. Handle success
    if (onSuccess && typeof onSuccess === 'function') {
      await onSuccess(result, cleanedData);
    }

    return {
      success: true,
      data: result,
      submittedData: cleanedData
    };

  } catch (error) {
    console.error('Form submission error:', error);

    // Handle validation errors specially
    if (error.name === 'ValidationError') {
      if (onError && typeof onError === 'function') {
        await onError(error.message, error.errors);
      }
      return {
        success: false,
        error: error.message,
        validationErrors: error.errors
      };
    }

    // Handle other errors
    if (onError && typeof onError === 'function') {
      await onError(error.message || 'An error occurred');
    }

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Extract values from form, handling files specially
 */
const extractFormValues = (formElement, fileFields, ignoreFields, existingData) => {
  const formValues = {};
  const formDataObj = new FormData(formElement);

  // First, handle non-file, non-ignored fields
  for (let [key, value] of formDataObj.entries()) {
    if (ignoreFields.includes(key)) continue;
    if (fileFields.includes(key)) continue;
    formValues[key] = value;
  }

  // Handle file fields
  const fileInputs = formElement.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    if (fileFields.includes(input.name)) {
      if (input.files.length > 0) {
        // New file selected
        formValues[input.name] = input.files[0];
      } else if (existingData[input.name] && typeof existingData[input.name] === 'string') {
        // Keep existing file URL
        formValues[input.name] = existingData[input.name];
      } else {
        // No file
        formValues[input.name] = null;
      }
    }
  });

  return formValues;
};

/**
 * Clean submission data (remove empty objects, etc.)
 */
const cleanSubmissionData = (data, fileFields) => {
  const cleaned = { ...data };

  // Clean file fields
  fileFields.forEach(field => {
    if (cleaned[field] &&
        typeof cleaned[field] === 'object' &&
        !(cleaned[field] instanceof File) &&
        !(cleaned[field] instanceof Blob) &&
        Object.keys(cleaned[field]).length === 0) {
      cleaned[field] = null;
    }
  });

  // Clean empty strings (optional)
  Object.keys(cleaned).forEach(key => {
    if (cleaned[key] === '') {
      cleaned[key] = null;
    }
  });

  return cleaned;
};

/**
 * Helper to handle file uploads separately
 */
export const uploadFile = async (file, endpoint, token, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.status}`);
  }

  return await response.json();
};

/**
 * Convert File to Base64 (for small files in JSON)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

/**
 * Scroll to first validation error
 */
export const scrollToFirstError = (errors) => {
  const firstErrorField = Object.keys(errors)[0];
  if (firstErrorField) {
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  }
};