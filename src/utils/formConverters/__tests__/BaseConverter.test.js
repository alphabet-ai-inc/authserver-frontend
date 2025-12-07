// __tests__/utils/formConverters/BaseConverter.test.js

import { BaseConverter } from '../BaseConverter';

describe('BaseConverter', () => {
  let converter;

  beforeEach(() => {
    converter = new BaseConverter();
  });

  describe('constructor', () => {
    test('should initialize with default configuration', () => {
      expect(converter.config.numberFields).toEqual([]);
      expect(converter.config.booleanFields).toEqual([]);
      expect(converter.config.arrayFields).toEqual([]);
      expect(converter.config.dateFields).toEqual([]);
      expect(converter.config.fileFields).toEqual([]);
      expect(converter.config.stringFields).toEqual([]);
      expect(converter.config.removeOnCreate).toEqual(['id', 'created']);
      expect(converter.config.setTimestamps).toBe(true);
      expect(converter.config.cleanEmptyStrings).toBe(true);
      expect(typeof converter.config.beforeConvert).toBe('function');
      expect(typeof converter.config.afterConvert).toBe('function');
      expect(converter.config.fieldTransformations).toEqual({});
    });

    test('should initialize with custom configuration', () => {
      const customConfig = {
        numberFields: ['age', 'score'],
        booleanFields: ['active'],
        removeOnCreate: ['_id'],
        setTimestamps: false,
        cleanEmptyStrings: false
      };

      const customConverter = new BaseConverter(customConfig);

      expect(customConverter.config.numberFields).toEqual(['age', 'score']);
      expect(customConverter.config.booleanFields).toEqual(['active']);
      expect(customConverter.config.removeOnCreate).toEqual(['_id']);
      expect(customConverter.config.setTimestamps).toBe(false);
      expect(customConverter.config.cleanEmptyStrings).toBe(false);
    });
  });

  describe('convert method', () => {
    test('should apply beforeConvert hook', () => {
      const beforeConvert = jest.fn(data => ({ ...data, processed: true }));
      converter = new BaseConverter({ beforeConvert });

      const formData = { name: 'John' };
      const result = converter.convert(formData);

      expect(beforeConvert).toHaveBeenCalledWith(formData, false);
      expect(result.processed).toBe(true);
    });

    test('should remove fields for create operations', () => {
      converter = new BaseConverter({ setTimestamps: false });
      const formData = { id: 123, name: 'John', created: 1609459200 };
      const result = converter.convert(formData, true);

      expect(result.id).toBeUndefined();
      expect(result.created).toBeUndefined();
      expect(result.name).toBe('John');
    });

    test('should not remove fields for update operations', () => {
      const formData = { id: 123, name: 'John', created: 1609459200 };
      const result = converter.convert(formData, false);

      expect(result.id).toBe(123);
      expect(result.created).toBe(1609459200);
      expect(result.name).toBe('John');
    });
  });

  describe('convertTypes method', () => {
    test('should convert number fields from string to number', () => {
      converter = new BaseConverter({ numberFields: ['age', 'score'] });

      const formData = { age: '25', score: '95.5', name: 'John' };
      const result = converter.convertTypes(formData);

      expect(result.age).toBe(25);
      expect(result.score).toBe(95.5);
      expect(result.name).toBe('John');
    });

    test('should convert empty number strings to null', () => {
      converter = new BaseConverter({ numberFields: ['age'] });

      const formData = { age: '', score: '95.5' };
      const result = converter.convertTypes(formData);

      expect(result.age).toBeNull();
      expect(result.score).toBe('95.5');
    });

    test('should handle non-numeric string in number fields', () => {
      converter = new BaseConverter({ numberFields: ['age'] });

      const formData = { age: 'not-a-number' };
      const result = converter.convertTypes(formData);

      expect(result.age).toBeNull();
    });

    test('should convert boolean fields', () => {
      converter = new BaseConverter({ booleanFields: ['active', 'verified'] });

      const formData = { active: 1, verified: true, name: 'John' };
      const result = converter.convertTypes(formData);

      expect(result.active).toBe(true);
      expect(result.verified).toBe(true);
      expect(result.name).toBe('John');
    });

    test('should convert array fields from string to array', () => {
      converter = new BaseConverter({ arrayFields: ['tags', 'categories'] });

      const formData = { tags: 'tech,js,react', categories: '["cat1", "cat2"]', name: 'John' };
      const result = converter.convertTypes(formData);

      expect(result.tags).toEqual(['tech', 'js', 'react']);
      expect(result.categories).toEqual(['cat1', 'cat2']);
      expect(result.name).toBe('John');
    });

    test('should set empty array for null array fields', () => {
      converter = new BaseConverter({ arrayFields: ['tags'] });

      const formData = { tags: null };
      const result = converter.convertTypes(formData);

      expect(result.tags).toEqual([]);
    });

    test('should keep existing arrays in array fields', () => {
      converter = new BaseConverter({ arrayFields: ['tags'] });

      const formData = { tags: ['tech', 'js'] };
      const result = converter.convertTypes(formData);

      expect(result.tags).toEqual(['tech', 'js']);
    });
  });

  describe('parseArrayString method', () => {
    test('should parse JSON array string', () => {
      const result = converter.parseArrayString('["a", "b", "c"]');

      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('should parse comma-separated string', () => {
      const result = converter.parseArrayString('a,b,c');

      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('should parse newline-separated string', () => {
      const result = converter.parseArrayString('a\nb\nc');

      expect(result).toEqual(['a', 'b', 'c']);
    });

    test('should parse single value string', () => {
      const result = converter.parseArrayString('single');

      expect(result).toEqual(['single']);
    });

    test('should return empty array for empty string', () => {
      const result = converter.parseArrayString('');

      expect(result).toEqual([]);
    });

    test('should trim whitespace from items', () => {
      const result = converter.parseArrayString('  a , b  ,  c  ');

      expect(result).toEqual(['a', 'b', 'c']);
    });
  });

  describe('setTimestamps method', () => {
    test('should set created and updated timestamps for create operation', () => {
      const formData = { name: 'John' };
      const result = converter.setTimestamps(formData, true);

      expect(result.created).toBeDefined();
      expect(result.updated).toBeDefined();
      expect(typeof result.created).toBe('number');
      expect(typeof result.updated).toBe('number');
    });

    test('should set only updated timestamp for update operation', () => {
      const formData = { name: 'John', created: 1609459200 };
      const result = converter.setTimestamps(formData, false);

      expect(result.created).toBe(1609459200);
      expect(result.updated).toBeDefined();
      expect(typeof result.updated).toBe('number');
    });

    test('should preserve existing created timestamp', () => {
      const formData = { name: 'John', created: 1609459200 };
      const result = converter.setTimestamps(formData, true);

      expect(result.created).toBe(1609459200);
      expect(result.updated).toBeDefined();
    });
  });

  describe('cleanEmptyStrings method', () => {
    test('should convert empty strings to null', () => {
      const formData = { name: 'John', email: '', age: null, score: 0 };
      const result = converter.cleanEmptyStrings(formData);

      expect(result.name).toBe('John');
      expect(result.email).toBeNull();
      expect(result.age).toBeNull();
      expect(result.score).toBe(0);
    });

    test('should handle object with no empty strings', () => {
      const formData = { name: 'John', age: 25, active: true };
      const result = converter.cleanEmptyStrings(formData);

      expect(result.name).toBe('John');
      expect(result.age).toBe(25);
      expect(result.active).toBe(true);
    });
  });

  describe('fieldTransformations', () => {
    test('should apply custom field transformations', () => {
      const fieldTransformations = {
        name: (value) => value.toUpperCase(),
        age: (value, data) => value + 1
      };

      converter = new BaseConverter({ fieldTransformations });

      const formData = { name: 'john', age: 25 };
      const result = converter.convert(formData);

      expect(result.name).toBe('JOHN');
      expect(result.age).toBe(26);
    });

    test('should pass isCreate flag to transformation functions', () => {
      const fieldTransformations = {
        name: jest.fn((value, data, isCreate) => isCreate ? `${value}_new` : value)
      };

      converter = new BaseConverter({ fieldTransformations });

      const formData = { name: 'john' };
      converter.convert(formData, true);

      expect(fieldTransformations.name).toHaveBeenCalledWith('john', expect.any(Object), true);
    });
  });

  describe('fileFields handling', () => {
    test('should convert File objects to null', () => {
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      converter = new BaseConverter({ fileFields: ['document'] });

      const formData = { document: mockFile, name: 'John' };
      const result = converter.convertTypes(formData);

      expect(result.document).toBeNull();
      expect(result.name).toBe('John');
    });

    test('should convert empty file objects to null', () => {
      converter = new BaseConverter({ fileFields: ['document'] });

      const formData = { document: {}, name: 'John' };
      const result = converter.convertTypes(formData);

      expect(result.document).toBeNull();
      expect(result.name).toBe('John');
    });
  });

  describe('integration tests', () => {
    test('should handle complete conversion pipeline', () => {
      converter = new BaseConverter({
        numberFields: ['age', 'score'],
        booleanFields: ['active'],
        arrayFields: ['tags'],
        removeOnCreate: ['id'],
        beforeConvert: (data) => ({ ...data, preprocessed: true }),
        afterConvert: (data) => ({ ...data, postprocessed: true })
      });

      const formData = {
        id: 123,
        name: 'John',
        age: '25',
        active: 'true',
        tags: 'js,react',
        emptyField: ''
      };

      const result = converter.convert(formData, true);

      expect(result.id).toBeUndefined();
      expect(result.name).toBe('John');
      expect(result.age).toBe(25);
      expect(result.active).toBe(true);
      expect(result.tags).toEqual(['js', 'react']);
      expect(result.emptyField).toBeNull();
      expect(result.preprocessed).toBe(true);
      expect(result.postprocessed).toBe(true);
      expect(result.created).toBeDefined();
      expect(result.updated).toBeDefined();
    });

    test('should work with disabled features', () => {
      converter = new BaseConverter({
        setTimestamps: false,
        cleanEmptyStrings: false
      });

      const formData = { name: 'John', emptyField: '' };
      const result = converter.convert(formData);

      expect(result.created).toBeUndefined();
      expect(result.updated).toBeUndefined();
      expect(result.emptyField).toBe('');
    });
  });
});