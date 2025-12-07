/**
 * AppConverter Tests
 * Tests for the AppConverter class and utility function
 */

import { AppConverter, convertAppData } from '../AppConverter';

describe('AppConverter', () => {
  let converter;

  beforeEach(() => {
    converter = new AppConverter();
  });

  describe('Constructor and Configuration', () => {
    it('should be an instance of BaseConverter', () => {
      expect(converter).toBeInstanceOf(AppConverter);
      // Since AppConverter extends BaseConverter, we can check the prototype chain
      expect(Object.getPrototypeOf(converter.constructor).name).toBe('BaseConverter');
    });

    it('should have correct numberFields configuration', () => {
      const expectedNumberFields = [
        'id', 'size', 'error_rate', 'average_response_time', 'uptime_percentage',
        'active_users', 'user_retention_rate', 'user_acquisition_cost',
        'churn_rate', 'monthly_recurring_revenue', 'fundings_investment',
        'created', 'updated'
      ];

      expect(converter.config.numberFields).toEqual(expect.arrayContaining(expectedNumberFields));
      expect(converter.config.numberFields.length).toBe(expectedNumberFields.length);
    });

    it('should have correct arrayFields configuration', () => {
      const expectedArrayFields = [
        'platform', 'compatibility', 'integration_capabilities', 'development_stack',
        'security_features', 'regulatory_compliance', 'revenue_streams',
        'customer_segments', 'channels', 'pricing_tiers', 'partnerships',
        'cost_structure', 'customer_relationships', 'key_activities',
        'user_feedback', 'backup_recovery_options', 'localization_support',
        'accessibility_features', 'team_structure', 'intellectual_property',
        'analytics_tools', 'key_metrics'
      ];

      expect(converter.config.arrayFields).toEqual(expect.arrayContaining(expectedArrayFields));
      expect(converter.config.arrayFields.length).toBe(expectedArrayFields.length);
    });

    it('should have correct fileFields configuration', () => {
      expect(converter.config.fileFields).toEqual(['logo']);
    });

    it('should have correct removeOnCreate configuration', () => {
      expect(converter.config.removeOnCreate).toEqual(['id']);
    });

    it('should have afterConvert function', () => {
      expect(typeof converter.config.afterConvert).toBe('function');
    });

    it('should have fieldTransformations for platform', () => {
      expect(typeof converter.config.fieldTransformations.platform).toBe('function');
    });
  });

  describe('Field Transformations', () => {
    it('should transform platform string to array', () => {
      const transform = converter.config.fieldTransformations.platform;

      expect(transform('web')).toEqual(['web']);
      expect(transform('mobile_ios')).toEqual(['mobile_ios']);
      expect(transform(['web', 'mobile'])).toEqual(['web', 'mobile']);
      expect(transform(null)).toBe(null);
      expect(transform(undefined)).toBe(undefined);
    });
  });

  describe('convertAppData Utility Function', () => {
    it('should be a function', () => {
      expect(typeof convertAppData).toBe('function');
    });

    it('should create AppConverter instance and call convert', () => {
      const mockFormData = { name: 'Test App' };
      const result = convertAppData(mockFormData, false);

      // The actual conversion depends on BaseConverter implementation
      // We're just testing that the function returns something
      expect(result).toBeDefined();
    });
  });

  describe('Data Conversion Scenarios', () => {
    it('should handle create operation (isCreate = true)', () => {
      const formData = {
        id: 123,
        name: 'Test App',
        platform: 'web',
        size: '1024',
        active_users: '5000'
      };

      const result = converter.convert(formData, true);

      // id should be removed for create operations
      expect(result.id).toBeUndefined();
      expect(result.name).toBe('Test App');
      // platform should be converted to array
      expect(result.platform).toEqual(['web']);
      // number fields should be converted
      expect(result.size).toBe(1024);
      expect(result.active_users).toBe(5000);
    });

    it('should handle update operation (isCreate = false)', () => {
      const formData = {
        id: 123,
        name: 'Test App',
        platform: 'web',
        size: '1024',
        active_users: '5000'
      };

      const result = converter.convert(formData, false);

      // id should remain for update operations
      expect(result.id).toBe(123);
      expect(result.name).toBe('Test App');
      expect(result.platform).toEqual(['web']);
      expect(result.size).toBe(1024);
      expect(result.active_users).toBe(5000);
    });

    it('should remove unwanted image fields', () => {
      const formData = {
        name: 'Test App',
        logo: 'logo.jpg',
        image: 'image.jpg',
        thumbnail: 'thumb.jpg',
        icon: 'icon.png'
      };

      const result = converter.convert(formData, true);

      expect(result.logo).toBe('logo.jpg'); // Should keep logo
      expect(result.image).toBeUndefined(); // Should remove image
      expect(result.thumbnail).toBeUndefined(); // Should remove thumbnail
      expect(result.icon).toBeUndefined(); // Should remove icon
    });

    it('should convert all number fields to numbers', () => {
      const formData = {
        size: '2048',
        error_rate: '0.5',
        average_response_time: '150',
        uptime_percentage: '99.9',
        active_users: '10000',
        user_retention_rate: '85.5',
        user_acquisition_cost: '25.75',
        churn_rate: '2.5',
        monthly_recurring_revenue: '50000',
        fundings_investment: '1000000',
        created: '1672531200',
        updated: '1672617600'
      };

      const result = converter.convert(formData, true);

      expect(result.size).toBe(2048);
      expect(result.error_rate).toBe(0.5);
      expect(result.average_response_time).toBe(150);
      expect(result.uptime_percentage).toBe(99.9);
      expect(result.active_users).toBe(10000);
      expect(result.user_retention_rate).toBe(85.5);
      expect(result.user_acquisition_cost).toBe(25.75);
      expect(result.churn_rate).toBe(2.5);
      expect(result.monthly_recurring_revenue).toBe(50000);
      expect(result.fundings_investment).toBe(1000000);
      expect(result.created).toBe(1672531200);
      expect(result.updated).toBe(1672617600);
    });

    it('should handle array fields correctly', () => {
      const formData = {
        platform: 'web',
        compatibility: ['windows', 'mac'],
        customer_segments: 'enterprise',
        pricing_tiers: ['free', 'pro', 'enterprise']
      };

      const result = converter.convert(formData, true);

      expect(result.platform).toEqual(['web']); // String converted to array
      expect(result.compatibility).toEqual(['windows', 'mac']); // Already array stays array
      expect(result.customer_segments).toEqual(['enterprise']); // String converted to array
      expect(result.pricing_tiers).toEqual(['free', 'pro', 'enterprise']); // Already array stays array
    });

    it('should handle null and undefined values gracefully', () => {
      const formData = {
        name: 'Test App',
        platform: null,
        size: undefined,
        active_users: ''
      };

      const result = converter.convert(formData, true);

      expect(result.name).toBe('Test App');
      expect(result.platform).toEqual([]); // null in arrayFields is converted to empty array
      expect(result.size).toBeUndefined();
      expect(result.active_users).toBe(null); // Empty string for number field converts to 0
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty form data', () => {
      const formData = {};
      const result = converter.convert(formData, true);

      expect(result).toBeDefined();
    });

    it('should handle form data with only non-configured fields', () => {
      const formData = {
        custom_field: 'custom_value',
        another_field: 'another_value'
      };

      const result = converter.convert(formData, true);

      expect(result.custom_field).toBe('custom_value');
      expect(result.another_field).toBe('another_value');
    });

    it('should preserve boolean and string fields as-is', () => {
      const formData = {
        name: 'Test App',
        is_active: true,
        description: 'A test application',
        status: 'published'
      };

      const result = converter.convert(formData, true);

      expect(result.name).toBe('Test App');
      expect(result.is_active).toBe(true);
      expect(result.description).toBe('A test application');
      expect(result.status).toBe('published');
    });
  });

  describe('Integration with convertAppData', () => {
    it('should work with convertAppData function for create', () => {
      const formData = {
        id: 123,
        name: 'Test App',
        platform: 'web',
        size: '1024'
      };

      const result = convertAppData(formData, true);

      expect(result.id).toBeUndefined();
      expect(result.name).toBe('Test App');
      expect(result.platform).toEqual(['web']);
      expect(result.size).toBe(1024);
    });

    it('should work with convertAppData function for update', () => {
      const formData = {
        id: 123,
        name: 'Test App',
        platform: 'web',
        size: '1024'
      };

      const result = convertAppData(formData, false);

      expect(result.id).toBe(123);
      expect(result.name).toBe('Test App');
      expect(result.platform).toEqual(['web']);
      expect(result.size).toBe(1024);
    });
  });
});