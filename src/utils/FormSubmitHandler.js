// src/utils/FormSubmitHandler.js

/**
 * Converts a file to base64 string
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Base64 encoded string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Uploads a file to the server
 * @param {File} file - The file to upload
 * @param {string} endpoint - API endpoint
 * @param {string} token - Authentication token
 * @param {string} fieldName - FormData field name (default: 'file')
 * @returns {Promise<Object>} - Server response
 */
export const uploadFile = async (file, endpoint, token, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || ''}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`File upload failed: ${response.status}`);
  }

  return await response.json();
};

/**
 * Scrolls to the first field with validation error
 * @param {Object} errors - Validation errors object
 */
export const scrollToFirstError = (errors) => {
  if (!errors || typeof errors !== 'object') {
    return;
  }

  const firstErrorField = Object.keys(errors)[0];
  if (!firstErrorField) {
    return;
  }

  const errorElement = document.getElementById(firstErrorField) ||
                       document.querySelector(`[name="${firstErrorField}"]`);

  if (errorElement) {
    errorElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
  }
};

/**
 * Handles generic form submission with validation, conversion, and error handling
 * @param {Object} options - Configuration options
 * @param {Event} options.event - Form submit event
 * @param {string} options.formId - Form element ID
 * @param {Function} options.submitFn - Function to submit data to API
 * @param {Function} [options.validateFn] - Function to validate form data
 * @param {Function} [options.convertFn] - Function to convert form data before submission
 * @param {Function} [options.onSuccess] - Callback on successful submission
 * @param {Function} [options.onError] - Callback on error
 * @param {string|number} [options.entityId] - Entity ID for update operations
 * @returns {Promise<Object>} - Result object {success, data, validationErrors, error}
 */
export const handleGenericFormSubmit = async ({
  event,
  formId,
  submitFn,
  validateFn,
  convertFn,
  onSuccess,
  onError,
  entityId = null,
}) => {
  try {
    // Prevent default form submission
    if (event?.preventDefault) {
      event.preventDefault();
    }

    // Get form element
    const formElement = document.getElementById(formId);
    if (!formElement) {
      throw new Error(`Form with ID "${formId}" not found`);
    }

    // Extract form data
    let formDataObj;
    try {
      const formData = new FormData(formElement);
      formDataObj = Object.fromEntries(formData.entries());
    } catch (error) {
      throw new Error(`Failed to extract form data: ${error.message}`);
    }

    // Call validation function if provided
    let validationErrors = {};
    if (validateFn && typeof validateFn === 'function') {
      validationErrors = validateFn(formDataObj) || {};
    }

    // If there are validation errors, return them
    if (validationErrors && Object.keys(validationErrors).length > 0) {
      const errorMessage = 'Form validation failed';
      if (onError && typeof onError === 'function') {
        onError(errorMessage, validationErrors);
      }
      scrollToFirstError(validationErrors);
      return {
        success: false,
        validationErrors,
        error: errorMessage,
      };
    }

    // Handle file fields if present
    const fileInputs = formElement.querySelectorAll('input[type="file"]');
    for (const input of fileInputs) {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        const base64 = await fileToBase64(file);
        formDataObj[input.name] = base64;
      } else if (formDataObj[input.name] === '' || formDataObj[input.name] === undefined) {
        // Remove empty file fields to avoid sending empty strings
        delete formDataObj[input.name];
      }
    }

    // Apply conversion function if provided
    let convertedData = formDataObj;
    if (convertFn && typeof convertFn === 'function') {
      convertedData = convertFn(formDataObj, !!entityId) || formDataObj;
    }

    // Add entity ID for update operations
    if (entityId) {
      convertedData = { ...convertedData, id: entityId };
    }

    // Call submit function
    if (!submitFn || typeof submitFn !== 'function') {
      throw new Error('Submit function is required');
    }

    const response = await submitFn(convertedData);

    // Call success callback
    if (onSuccess && typeof onSuccess === 'function') {
      onSuccess(response);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    // Handle errors
    const errorMessage = error.message || 'An unknown error occurred';

    if (onError && typeof onError === 'function') {
      onError(errorMessage);
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};