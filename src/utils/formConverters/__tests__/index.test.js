// Simplified test - just check exports exist
import { describe, test, expect, vi } from 'vitest';

// Minimal mocks
vi.mock('./BaseConverter.js', () => ({ BaseConverter: vi.fn() }));
vi.mock('./AppConverter.js', () => ({ AppConverter: vi.fn(), convertAppData: vi.fn() }));
vi.mock('./UserConverter.js', () => ({ UserConverter: vi.fn(), convertUserData: vi.fn() }));
vi.mock('./createConverter.js', () => ({
  createConverter: vi.fn(() => ({ convert: vi.fn() }))
}));

// Import
import * as allExports from '../index.js';

describe('Form Converters Index Exports', () => {
  test('should export all 9 expected components', () => {
    const exportKeys = Object.keys(allExports).filter(key =>
      !['default', '__esModule'].includes(key)
    );

    expect(exportKeys).toHaveLength(9);

    // Check each export exists
    expect(allExports.BaseConverter).toBeDefined();
    expect(allExports.AppConverter).toBeDefined();
    expect(allExports.convertAppData).toBeDefined();
    expect(allExports.UserConverter).toBeDefined();
    expect(allExports.convertUserData).toBeDefined();
    expect(allExports.createConverter).toBeDefined();
    expect(allExports.defaultConverter).toBeDefined();
    expect(allExports.convertFormDataForAPI).toBeDefined();
    expect(allExports.productConverter).toBeDefined();
  });

  test('convertFormDataForAPI should be alias for defaultConverter', () => {
    expect(allExports.convertFormDataForAPI).toBe(allExports.defaultConverter);
  });
});