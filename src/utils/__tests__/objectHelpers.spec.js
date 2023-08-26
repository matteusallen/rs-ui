import { getValueByPropPath, omit } from '../objectHelpers';

describe('Utils > objectHelpers.js', () => {
  describe('getValueByPropPath()', () => {
    it('should prop drill based on dot separated key path', () => {
      const source = { a: { b: { c: 'c' } } };
      const keyPath = 'a.b.c';

      const result = getValueByPropPath(source, keyPath);
      expect(result).toBe('c');
    });

    it('should return default value for keys not found', () => {
      const source = { a: { b: { c: 'c' } } };
      const keyPath = 'a.b.c.d';

      const result = getValueByPropPath(source, keyPath, 'defaultD');
      expect(result).toBe('defaultD');
    });

    it('should return default value of undefined when not given for keys not found', () => {
      const source = { a: { b: { c: 'c' } } };
      const keyPath = 'a.b.c.d';

      const result = getValueByPropPath(source, keyPath);
      expect(result).toBe(undefined);
    });

    it('should return non-primitives for key path', () => {
      const source = { a: { b: { c: [1, 2, 3] } } };
      const keyPath1 = 'a.b';
      const keyPath2 = 'a.b.c';

      expect(getValueByPropPath(source, keyPath1)).toEqual({ c: [1, 2, 3] });
      expect(getValueByPropPath(source, keyPath2)).toEqual([1, 2, 3]);
    });

    it('should handle array index based property value references', () => {
      const source = { a: [{ b: { c: 'c' } }] };
      const keyPath = 'a[0].b.c';

      const result = getValueByPropPath(source, keyPath);
      expect(result).toBe('c');
    });

    it('should handle array index based property value references by value', () => {
      const source = { a: [0, { b: { c: 'c' } }, 2] };
      const keyPath = 'a[2]';

      const result = getValueByPropPath(source, keyPath);
      expect(result).toBe(2);
    });

    it('should handle array index based property value references with default value when supplied', () => {
      const source = { a: [0, { b: { c: 'c' } }, 2] };
      const keyPath = 'a[3]';

      const result = getValueByPropPath(source, keyPath, 3);
      expect(result).toBe(3);
    });

    it('should handle array index only as well', () => {
      const source = [0, { b: { c: 'c' } }, 2];
      const keyPath = '[0]';

      const result = getValueByPropPath(source, keyPath);
      expect(result).toBe(0);
    });

    it('should return default value for falsey source', () => {
      const source = undefined;
      const keyPath = 'whoCare';
      const defaultValue = 'come at me bro';

      const result = getValueByPropPath(source, keyPath, defaultValue);
      expect(result).toBe(defaultValue);
    });
  });

  describe('omit()', () => {
    it('should not include key if omit param is a string or number', () => {
      const source = {
        a: 'a',
        1: 'one'
      };
      const omittedKey1 = 'a';
      const omittedKey2 = 1;

      expect(omit(source, omittedKey1)).toEqual({ 1: 'one' });
      expect(omit(source, omittedKey2)).toEqual({ a: 'a' });
    });

    it('should only include keys not in omit param (array)', () => {
      const source = {
        a: 'a',
        b: 'b',
        c: 'c',
        1: 'one',
        2: 'two'
      };
      const omittedKeys = ['a', 'c', 1];

      expect(omit(source, omittedKeys)).toEqual({ b: 'b', 2: 'two' });
    });
  });
});
