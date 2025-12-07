// src/components/apps/__tests__/formValidation.test.js
import { validateForm } from '../AppFormValidation';

describe('validateForm', () => {
  const baseValidFormData = {
    name: 'Test App',
    release: '1.0',
    description: 'A test application',
    title: 'Test Application'
  };

  describe('Required Fields Validation', () => {
    it('should return no errors when all required fields are present', () => {
      const errors = validateForm(baseValidFormData);
      expect(errors).toEqual({});
    });

    it('should return error for missing name field', () => {
      const formData = { ...baseValidFormData, name: '' };
      const errors = validateForm(formData);
      expect(errors.name).toBe('This field is required');
    });

    it('should return error for missing release field', () => {
      const formData = { ...baseValidFormData, release: '' };
      const errors = validateForm(formData);
      expect(errors.release).toBe('This field is required');
    });

    it('should return error for missing description field', () => {
      const formData = { ...baseValidFormData, description: '' };
      const errors = validateForm(formData);
      expect(errors.description).toBe('This field is required');
    });

    it('should return error for missing title field', () => {
      const formData = { ...baseValidFormData, title: '' };
      const errors = validateForm(formData);
      expect(errors.title).toBe('This field is required');
    });

    it('should return multiple errors when multiple fields are missing', () => {
      const formData = {
        name: '',
        release: '',
        description: 'A test application',
        title: ''
      };
      const errors = validateForm(formData);

      expect(errors.name).toBe('This field is required');
      expect(errors.release).toBe('This field is required');
      expect(errors.title).toBe('This field is required');
      expect(errors.description).toBeUndefined();
    });

    it('should handle null values as missing', () => {
      const formData = { ...baseValidFormData, name: null };
      const errors = validateForm(formData);
      expect(errors.name).toBe('This field is required');
    });

    it('should handle undefined values as missing', () => {
      const formData = { release: '1.0', description: 'A test application', title: 'Test Application' };
      const errors = validateForm(formData);
      expect(errors.name).toBe('This field is required');
    });

    it('should handle whitespace-only strings as missing', () => {
      const formData = { ...baseValidFormData, name: '   ' };
      const errors = validateForm(formData);
      expect(errors.name).toBe('This field is required');
    });
  });

  describe('URL Validation', () => {
    it('should return no error for valid URL', () => {
      const formData = { ...baseValidFormData, web: 'https://example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should return error for invalid URL', () => {
      const formData = { ...baseValidFormData, web: 'not-a-valid-url' };
      const errors = validateForm(formData);
      expect(errors.web).toBe('Please enter a valid URL');
    });

    it('should not validate URL when web field is empty', () => {
      const formData = { ...baseValidFormData, web: '' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should accept http URLs', () => {
      const formData = { ...baseValidFormData, web: 'http://example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should accept https URLs', () => {
      const formData = { ...baseValidFormData, web: 'https://example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should accept URLs with subdomains and paths', () => {
      const formData = { ...baseValidFormData, web: 'https://sub.example.com/path' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should accept URLs with ports', () => {
      const formData = { ...baseValidFormData, web: 'https://example.com:8080' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should accept ftp URLs', () => {
      const formData = { ...baseValidFormData, web: 'ftp://example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBeUndefined();
    });

    it('should reject URLs without protocol', () => {
      const formData = { ...baseValidFormData, web: 'example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBe('Please enter a valid URL');
    });

    it('should reject URLs with only www', () => {
      const formData = { ...baseValidFormData, web: 'www.example.com' };
      const errors = validateForm(formData);
      expect(errors.web).toBe('Please enter a valid URL');
    });

    it('should reject plain text', () => {
      const formData = { ...baseValidFormData, web: 'just text' };
      const errors = validateForm(formData);
      expect(errors.web).toBe('Please enter a valid URL');
    });

    it('should reject incomplete URLs', () => {
      const formData = { ...baseValidFormData, web: 'https://' };
      const errors = validateForm(formData);
      expect(errors.web).toBe('Please enter a valid URL');
    });
  });

  describe('Number Validation', () => {
    it('should return no error for valid number', () => {
      const formData = { ...baseValidFormData, size: 100 };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should return no error for valid number string', () => {
      const formData = { ...baseValidFormData, size: '100' };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should return error for non-numeric string', () => {
      const formData = { ...baseValidFormData, size: 'not a number' };
      const errors = validateForm(formData);
      expect(errors.size).toBe('Must be a valid number');
    });

    it('should return error for NaN', () => {
      const formData = { ...baseValidFormData, size: NaN };
      const errors = validateForm(formData);
      expect(errors.size).toBe('Must be a valid number');
    });

    it('should not validate number when size field is empty', () => {
      const formData = { ...baseValidFormData, size: '' };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should not validate number when size field is null', () => {
      const formData = { ...baseValidFormData, size: null };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should not validate number when size field is undefined', () => {
      const formData = { ...baseValidFormData };
      delete formData.size;
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should accept decimal numbers', () => {
      const formData = { ...baseValidFormData, size: 123.45 };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should accept negative numbers', () => {
      const formData = { ...baseValidFormData, size: -100 };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });

    it('should accept zero', () => {
      const formData = { ...baseValidFormData, size: 0 };
      const errors = validateForm(formData);
      expect(errors.size).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty form data object', () => {
      const errors = validateForm({});

      expect(errors.name).toBe('This field is required');
      expect(errors.release).toBe('This field is required');
      expect(errors.description).toBe('This field is required');
      expect(errors.title).toBe('This field is required');
    });

    it('should handle null form data', () => {
      const errors = validateForm(null);

      expect(errors.name).toBe('This field is required');
      expect(errors.release).toBe('This field is required');
      expect(errors.description).toBe('This field is required');
      expect(errors.title).toBe('This field is required');
    });

    it('should handle undefined form data', () => {
      const errors = validateForm();

      expect(errors.name).toBe('This field is required');
      expect(errors.release).toBe('This field is required');
      expect(errors.description).toBe('This field is required');
      expect(errors.title).toBe('This field is required');
    });

    it('should ignore extra fields not in validation', () => {
      const formData = {
        ...baseValidFormData,
        extraField1: 'some value',
        extraField2: 123,
        extraField3: null
      };

      const errors = validateForm(formData);
      expect(errors).toEqual({});
    });

    it('should validate required fields before custom validations', () => {
      const formData = {
        name: '',
        release: '1.0',
        description: 'A test application',
        title: 'Test Application',
        web: 'invalid-url',
        size: 'not-a-number'
      };

      const errors = validateForm(formData);

      expect(errors.name).toBe('This field is required');
      expect(errors.web).toBe('Please enter a valid URL');
      expect(errors.size).toBe('Must be a valid number');
    });
  });
});