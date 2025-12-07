// src/utils/formConverters/createConverter.js
import { BaseConverter } from './BaseConverter';

/**
 * Create a new converter for a specific entity type
 * @param {Object} config - Converter configuration
 * @returns {Function} - Converter function
 * @throws {Error} If config is not an object
 */
export const createConverter = (config = {}) => {
  // Validate config parameter
  if (config !== undefined && config !== null && typeof config !== 'object') {
    throw new TypeError('createConverter: config must be an object');
  }

  // Ensure config is always an object (handle null case)
  const safeConfig = config || {};

  const converter = new BaseConverter(safeConfig);

  return (formData, isCreate = false) => {
    return converter.convert(formData, isCreate);
  };
};

/**
 * Create a product-specific converter with predefined configuration
 * @returns {Function} - Product converter function
 */
export const createProductConverter = () => {
  return createConverter({
    numberFields: ['id', 'price', 'quantity', 'weight', 'rating'],
    booleanFields: ['in_stock', 'featured', 'active'],
    arrayFields: ['categories', 'tags', 'images', 'colors', 'sizes'],
    fileFields: ['main_image', 'gallery_images'],
    fieldTransformations: {
      price: (value) => {
        const num = Number(value);
        return isNaN(num) ? 0 : Math.round(num * 100) / 100;
      }
    }
  });
};

/**
 * Validate if a value can be used as converter configuration
 * @param {any} config - Configuration to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidConverterConfig = (config) => {
  return config === undefined || config === null || typeof config === 'object';
};

// Alternative: Graceful version that never throws
export const createConverterSafe = (config = {}) => {
  try {
    return createConverter(config);
  } catch (error) {
    // Log error for debugging but return a no-op converter
    console.warn('createConverterSafe: Invalid config, using empty converter', error);

    // Return a converter that passes data through unchanged
    return (formData, isCreate = false) => formData;
  }
};