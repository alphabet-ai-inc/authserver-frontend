/**
 * validateUserForm.test.js
 * -------------------------
 * Tests for validateUserForm utility function
 */

import { validateUserForm } from '../UserFormValidation.jsx';

describe('validateUserForm', () => {
  const mockFieldGroups = {}; // Not used in current implementation

  describe('Required field validation', () => {
    it('should return error when first_name is missing', () => {
      const formData = {
        last_name: 'Doe',
        email: 'test@example.com',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.first_name).toBe('First name is required');
    });

    it('should return error when last_name is missing', () => {
      const formData = {
        first_name: 'John',
        email: 'test@example.com',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.last_name).toBe('Last name is required');
    });

    it('should return error when email is missing', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.email).toBe('Email is required');
    });

    it('should return error when email is invalid', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'invalid-email',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.email).toBe('Email is invalid');
    });

    it('should not return errors when all required fields are valid', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).toBeNull();
    });
  });

  describe('Empty string validation', () => {
    it('should return error when first_name is empty string', () => {
      const formData = {
        first_name: '   ',
        last_name: 'Doe',
        email: 'test@example.com',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.first_name).toBe('First name is required');
    });

    it('should return error when last_name is empty string', () => {
      const formData = {
        first_name: 'John',
        last_name: '   ',
        email: 'test@example.com',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.last_name).toBe('Last name is required');
    });

    it('should return error when email is empty string', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: '   ',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.email).toBe('Email is required');
    });
  });

  describe('Password validation', () => {
    it('should return error when password is too short', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: '123',
        password_confirm: '123',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.password).toBe('Password must be at least 6 characters');
    });

    it('should return error when passwords do not match', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        password_confirm: 'different123',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.password_confirm).toBe('Passwords do not match');
    });

    it('should not validate password when password is not provided', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        // No password fields
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).toBeNull();
    });

    it('should accept valid password when provided', () => {
      const formData = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'test@example.com',
        password: 'password123',
        password_confirm: 'password123',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined fields gracefully', () => {
      const formData = {
        // Missing all fields
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.first_name).toBe('First name is required');
      expect(errors.last_name).toBe('Last name is required');
      expect(errors.email).toBe('Email is required');
    });

    it('should handle null fields gracefully', () => {
      const formData = {
        first_name: null,
        last_name: null,
        email: null,
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.first_name).toBe('First name is required');
      expect(errors.last_name).toBe('Last name is required');
      expect(errors.email).toBe('Email is required');
    });

    it('should combine multiple errors', () => {
      const formData = {
        // All fields missing
        password: '123',
        password_confirm: '456',
      };

      const errors = validateUserForm(formData, mockFieldGroups);

      expect(errors).not.toBeNull();
      expect(errors.first_name).toBe('First name is required');
      expect(errors.last_name).toBe('Last name is required');
      expect(errors.email).toBe('Email is required');
      expect(errors.password).toBe('Password must be at least 6 characters');
      expect(errors.password_confirm).toBe('Passwords do not match');
    });
  });

  describe('Valid email formats', () => {
    const validEmails = [
      'test@example.com',
      'user.name@domain.co',
      'user+tag@domain.org',
      'user@sub.domain.com',
      'user@domain.io',
    ];

    validEmails.forEach(email => {
      it(`should accept valid email: ${email}`, () => {
        const formData = {
          first_name: 'John',
          last_name: 'Doe',
          email,
        };

        const errors = validateUserForm(formData, mockFieldGroups);

        expect(errors).toBeNull();
      });
    });
  });

  describe('Invalid email formats', () => {
    const invalidEmails = [
      'invalid-email',
      'user@',
      '@domain.com',
      'user@domain.',
      'user@.com',
    ];

    invalidEmails.forEach(email => {
      it(`should reject invalid email: ${email}`, () => {
        const formData = {
          first_name: 'John',
          last_name: 'Doe',
          email,
        };

        const errors = validateUserForm(formData, mockFieldGroups);

        expect(errors).not.toBeNull();
        expect(errors.email).toBe('Email is invalid');
      });
    });
  });
});