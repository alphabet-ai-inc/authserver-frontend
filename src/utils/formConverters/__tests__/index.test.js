// __tests__/utils/formConverters/index.test.js

describe('Form Converters Index Exports', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    jest.resetModules();

    // Mock dependencies first
    jest.mock('../BaseConverter', () => ({
      BaseConverter: jest.fn(() => ({ convert: jest.fn() }))
    }));

    jest.mock('../AppConverter', () => ({
      AppConverter: jest.fn(() => ({ convert: jest.fn() })),
      convertAppData: jest.fn()
    }));

    jest.mock('../UserConverter', () => ({
      UserConverter: jest.fn(() => ({ convert: jest.fn() })),
      convertUserData: jest.fn()
    }));

    jest.mock('../CreateConverter', () => ({
      createConverter: jest.fn(() => ({ convert: jest.fn() }))
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('Basic Exports', () => {
    test('should export all expected components', () => {
      // Require the module after mocking
      const {
        BaseConverter,
        AppConverter,
        convertAppData,
        UserConverter,
        convertUserData,
        createConverter,
        defaultConverter,
        convertFormDataForAPI,
        productConverter
      } = require('../index');

      expect(BaseConverter).toBeDefined();
      expect(typeof BaseConverter).toBe('function');

      expect(AppConverter).toBeDefined();
      expect(typeof AppConverter).toBe('function');

      expect(convertAppData).toBeDefined();
      expect(typeof convertAppData).toBe('function');

      expect(UserConverter).toBeDefined();
      expect(typeof UserConverter).toBe('function');

      expect(convertUserData).toBeDefined();
      expect(typeof convertUserData).toBe('function');

      expect(createConverter).toBeDefined();
      expect(typeof createConverter).toBe('function');

      expect(defaultConverter).toBeDefined();
      expect(typeof defaultConverter).toBe('object');

      expect(convertFormDataForAPI).toBeDefined();
      expect(typeof convertFormDataForAPI).toBe('object');

      expect(productConverter).toBeDefined();
      expect(typeof productConverter).toBe('object');
    });

    test('should have convertFormDataForAPI as alias for defaultConverter', () => {
      const { defaultConverter, convertFormDataForAPI } = require('../index');

      expect(convertFormDataForAPI).toBe(defaultConverter);
    });
  });

  describe('Default Converter', () => {
    test('should call createConverter without arguments for defaultConverter', () => {
      // Mock createConverter to track calls
      const mockCreateConverter = jest.fn(() => ({ convert: jest.fn() }));
      jest.mock('../CreateConverter', () => ({
        createConverter: mockCreateConverter
      }));

      jest.resetModules();

      const { defaultConverter } = require('../index');

      expect(mockCreateConverter).toHaveBeenCalledTimes(2);
      expect(mockCreateConverter).toHaveBeenCalledWith();
      expect(defaultConverter).toBeDefined();
    });
  });

  describe('Product Converter', () => {
    test('should create productConverter with correct configuration', () => {
      const mockCreateConverter = jest.fn();

      mockCreateConverter.mockImplementation((config) => {
        return { convert: jest.fn() };
      });

      jest.mock('../CreateConverter', () => ({
        createConverter: mockCreateConverter
      }));

      jest.resetModules();

      // Import will trigger the calls
      const { productConverter } = require('../index');

      // createConverter is called twice (for defaultConverter and productConverter)
      expect(mockCreateConverter).toHaveBeenCalledTimes(2);

      // Get the second call arguments (for productConverter)
      const secondCallArgs = mockCreateConverter.mock.calls[1];
      expect(secondCallArgs[0]).toEqual({
        numberFields: ['id', 'price', 'quantity', 'weight', 'rating'],
        booleanFields: ['in_stock', 'featured', 'active'],
        arrayFields: ['categories', 'tags', 'images', 'colors', 'sizes'],
        fileFields: ['main_image', 'gallery_images'],
        fieldTransformations: {
          price: expect.any(Function)
        }
      });

      expect(productConverter).toBeDefined();
    });

    test('should have price transformation function that works correctly', () => {
      const mockCreateConverter = jest.fn();
      let productConfig;

      mockCreateConverter.mockImplementation((config) => {
        // Store the config when called for productConverter
        if (config?.numberFields?.includes('price')) {
          productConfig = config;
        }
        return { convert: jest.fn() };
      });

      jest.mock('../CreateConverter', () => ({
        createConverter: mockCreateConverter
      }));

      jest.resetModules();

      // Trigger the import
      require('../index');

      // Verify the price transformation function
      const priceTransform = productConfig.fieldTransformations.price;
      expect(priceTransform('19.99')).toBe(19.99);
      expect(priceTransform('19.999')).toBe(20);
      expect(priceTransform('invalid')).toBe(0);
      expect(priceTransform('')).toBe(0);
      expect(priceTransform(null)).toBe(0);
    });
  });

  describe('Export Structure', () => {
    test('should have all 9 expected exports', () => {
      const moduleExports = require('../index');
      const exportKeys = Object.keys(moduleExports);

      expect(exportKeys).toHaveLength(9);
      expect(exportKeys).toEqual(expect.arrayContaining([
        'BaseConverter',
        'AppConverter',
        'convertAppData',
        'UserConverter',
        'convertUserData',
        'createConverter',
        'defaultConverter',
        'convertFormDataForAPI',
        'productConverter'
      ]));
    });
  });
});