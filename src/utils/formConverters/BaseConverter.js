// src/utils/formConverters/BaseConverter.js

/**
 * Base converter with generic type transformations
 */
export class BaseConverter {
  constructor(config = {}) {
    this.config = {
      // Field type mappings
      numberFields: config.numberFields || [],
      booleanFields: config.booleanFields || [],
      arrayFields: config.arrayFields || [],
      dateFields: config.dateFields || [],
      fileFields: config.fileFields || [],
      stringFields: config.stringFields || [],

      // Behavior options
      removeOnCreate: config.removeOnCreate || ['id', 'created'],
      setTimestamps: config.setTimestamps !== false, // Default true
      cleanEmptyStrings: config.cleanEmptyStrings !== false, // Default true

      // Custom transformations
      beforeConvert: config.beforeConvert || ((data) => data),
      afterConvert: config.afterConvert || ((data) => data),
      fieldTransformations: config.fieldTransformations || {}
    };
  }

  /**
   * Convert form data for API submission
   * @param {Object} formData - Raw form data
   * @param {boolean} isCreate - True for create operations
   * @returns {Object} - Converted data
   */
  convert(formData, isCreate = false) {
    let converted = { ...formData };

    // Apply pre-conversion transformations
    converted = this.config.beforeConvert(converted, isCreate);

    // Remove fields for create operations
    if (isCreate) {
      this.config.removeOnCreate.forEach(field => {
        delete converted[field];
      });
    }

    // Apply type conversions
    converted = this.convertTypes(converted);

    // Set timestamps
    if (this.config.setTimestamps) {
      converted = this.setTimestamps(converted, isCreate);
    }

    // Clean empty strings
    if (this.config.cleanEmptyStrings) {
      converted = this.cleanEmptyStrings(converted);
    }

    // Apply custom field transformations
    Object.keys(this.config.fieldTransformations).forEach(field => {
      const transformFn = this.config.fieldTransformations[field];
      if (typeof transformFn === 'function') {
        converted[field] = transformFn(converted[field], converted, isCreate);
      }
    });

    // Apply post-conversion transformations
    converted = this.config.afterConvert(converted, isCreate);

    return converted;
  }

  /**
   * Convert field values based on their types
   */
  convertTypes(data) {
    const result = { ...data };

    // Convert number fields
    this.config.numberFields.forEach(field => {
      if (result[field] !== undefined && result[field] !== null && result[field] !== '') {
        if (typeof result[field] === 'string') {
          const num = Number(result[field]);
          result[field] = isNaN(num) ? null : num;
        }
      } else if (result[field] === '') {
        result[field] = null;
      }
    });

    // Convert boolean fields
    this.config.booleanFields.forEach(field => {
      if (result[field] !== undefined && result[field] !== null) {
        result[field] = Boolean(result[field]);
      }
    });

    // Convert array fields
    this.config.arrayFields.forEach(field => {
      if (result[field] !== undefined && result[field] !== null) {
        if (typeof result[field] === 'string') {
          result[field] = this.parseArrayString(result[field]);
        } else if (!Array.isArray(result[field])) {
          result[field] = [];
        }
      } else {
        result[field] = [];
      }
    });

    // Handle file fields
    this.config.fileFields.forEach(field => {
      if (result[field] instanceof File) {
        result[field] = null; // Files need separate handling
      } else if (result[field] && typeof result[field] === 'object' && Object.keys(result[field]).length === 0) {
        result[field] = null;
      }
    });

    return result;
  }

  /**
   * Parse array from string (supports JSON, comma-separated, newline-separated)
   */
  parseArrayString(str) {
    if (!str || str.trim() === '') return [];

    // Try JSON first
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // Try comma or newline separated
      if (str.includes(',') || str.includes('\n')) {
        return str
          .split(/[,\n]/)
          .map(item => item.trim())
          .filter(item => item.length > 0);
      }
      // Single value
      return [str.trim()];
    }
  }

  /**
   * Set created and updated timestamps
   */
  setTimestamps(data, isCreate) {
    const result = { ...data };
    const now = Math.floor(Date.now() / 1000);

    if (isCreate && !result.created) {
      result.created = now;
    }

    if (!result.updated) {
      result.updated = now;
    }

    return result;
  }

  /**
   * Convert empty strings to null
   */
  cleanEmptyStrings(data) {
    const result = { ...data };
    Object.keys(result).forEach(key => {
      if (result[key] === '') {
        result[key] = null;
      }
    });
    return result;
  }
}