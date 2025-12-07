/**
 * Config SelectOptions Tests
 * Tests for the configuration select options constants
 */

import {
  CUSTOMER_SEGMENTS,
  PLATFORMS,
  LICENSE_TYPES
} from '../selectOptions';

describe('Config SelectOptions', () => {
  describe('CUSTOMER_SEGMENTS', () => {
    it('should be an array', () => {
      expect(Array.isArray(CUSTOMER_SEGMENTS)).toBe(true);
    });

    it('should have 8 customer segments', () => {
      expect(CUSTOMER_SEGMENTS).toHaveLength(8);
    });

    it('should contain specific customer segments', () => {
      const expectedSegments = [
        'enterprise',
        'smb',
        'startups',
        'developers',
        'consumers',
        'education',
        'government',
        'non_profit'
      ];

      expectedSegments.forEach(segment => {
        expect(CUSTOMER_SEGMENTS.some(item => item.value === segment)).toBe(true);
      });
    });

    it('should have proper label for each segment', () => {
      CUSTOMER_SEGMENTS.forEach(segment => {
        expect(segment).toHaveProperty('value');
        expect(segment).toHaveProperty('label');
        expect(typeof segment.value).toBe('string');
        expect(typeof segment.label).toBe('string');
      });
    });

    it('should have enterprise as first segment', () => {
      expect(CUSTOMER_SEGMENTS[0].value).toBe('enterprise');
      expect(CUSTOMER_SEGMENTS[0].label).toBe('Enterprise Businesses');
    });
  });

  describe('PLATFORMS', () => {
    it('should be an array', () => {
      expect(Array.isArray(PLATFORMS)).toBe(true);
    });

    it('should have 9 platforms', () => {
      expect(PLATFORMS).toHaveLength(9);
    });

    it('should contain specific platforms', () => {
      const expectedPlatforms = [
        'web',
        'mobile_ios',
        'mobile_android',
        'desktop_windows',
        'desktop_mac',
        'desktop_linux',
        'cloud',
        'saas',
        'on_premise'
      ];

      expectedPlatforms.forEach(platform => {
        expect(PLATFORMS.some(item => item.value === platform)).toBe(true);
      });
    });

    it('should have web as first platform', () => {
      expect(PLATFORMS[0].value).toBe('web');
      expect(PLATFORMS[0].label).toBe('Web');
    });

    it('should have consistent value-label pairs', () => {
      PLATFORMS.forEach(platform => {
        expect(platform.value).toBeDefined();
        expect(platform.label).toBeDefined();
        expect(platform.label.length).toBeGreaterThan(0);
      });
    });
  });

  describe('LICENSE_TYPES', () => {
    it('should be an array', () => {
      expect(Array.isArray(LICENSE_TYPES)).toBe(true);
    });

    it('should have 6 license types', () => {
      expect(LICENSE_TYPES).toHaveLength(6);
    });

    it('should contain specific license types', () => {
      const expectedLicenses = [
        'proprietary',
        'open_source',
        'freeware',
        'shareware',
        'subscription',
        'freemium'
      ];

      expectedLicenses.forEach(license => {
        expect(LICENSE_TYPES.some(item => item.value === license)).toBe(true);
      });
    });

    it('should have proprietary as first license type', () => {
      expect(LICENSE_TYPES[0].value).toBe('proprietary');
      expect(LICENSE_TYPES[0].label).toBe('Proprietary');
    });

    it('should have no duplicate values', () => {
      const values = LICENSE_TYPES.map(item => item.value);
      const uniqueValues = new Set(values);
      expect(values.length).toBe(uniqueValues.size);
    });
  });

  describe('Data Structure Consistency', () => {
    it('all arrays should have objects with value and label properties', () => {
      const allOptions = [...CUSTOMER_SEGMENTS, ...PLATFORMS, ...LICENSE_TYPES];

      allOptions.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
        expect(option.value.trim().length).toBeGreaterThan(0);
        expect(option.label.trim().length).toBeGreaterThan(0);
      });
    });

    it('should have no overlapping values between different option sets', () => {
      const customerValues = CUSTOMER_SEGMENTS.map(item => item.value);
      const platformValues = PLATFORMS.map(item => item.value);
      const licenseValues = LICENSE_TYPES.map(item => item.value);

      // Check for intersections
      const customerPlatformIntersection = customerValues.filter(value =>
        platformValues.includes(value)
      );
      const customerLicenseIntersection = customerValues.filter(value =>
        licenseValues.includes(value)
      );
      const platformLicenseIntersection = platformValues.filter(value =>
        licenseValues.includes(value)
      );

      expect(customerPlatformIntersection).toHaveLength(0);
      expect(customerLicenseIntersection).toHaveLength(0);
      expect(platformLicenseIntersection).toHaveLength(0);
    });

    it('all values should use snake_case format', () => {
      const allOptions = [...CUSTOMER_SEGMENTS, ...PLATFORMS, ...LICENSE_TYPES];

      allOptions.forEach(option => {
        // Check if value follows snake_case pattern (lowercase letters, numbers, underscores)
        expect(option.value).toMatch(/^[a-z0-9_]+$/);

        // Should not start or end with underscore
        expect(option.value).not.toMatch(/^_|_$/);

        // Should not have consecutive underscores
        expect(option.value).not.toMatch(/__/);
      });
    });
  });
});