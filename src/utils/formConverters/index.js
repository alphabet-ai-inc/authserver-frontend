// Import from their respective files
import { BaseConverter } from './BaseConverter.js';
import { AppConverter, convertAppData } from './AppConverter.js';
import { UserConverter, convertUserData } from './UserConverter.js';
import { createConverter } from './CreateConverter.js';

// Re-export everything
export {
  BaseConverter,
  AppConverter,
  convertAppData,
  UserConverter,
  convertUserData,
  createConverter
};

// Create and export a default converter function
export const defaultConverter = createConverter();

// Alias for backward compatibility with your existing code
export const convertFormDataForAPI = defaultConverter;

// Optional: Create and export some common converters
export const productConverter = createConverter({
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