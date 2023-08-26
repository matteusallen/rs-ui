import { difference, findIndex } from '../arrayHelpers';

describe('Utils > arrayHelpers.js', () => {
  describe('difference()', () => {
    it('should return a new array with values / references not present in valueList', () => {
      const obj = {};
      const otherObj = {};
      const arr = [];
      const otherArr = [];
      const func = () => {};
      const otherFunc = () => {};
      const source = [0, 1, 2, 3, 4, 5, obj, arr, func];
      const valueList = [0, 3, 5, otherObj, otherArr, otherFunc];

      const result = difference(source, valueList);
      const expectedResultLikeArray = [1, 2, 4, obj, arr, func];
      expect(result).toEqual(expectedResultLikeArray);
      expect(result).not.toBe(expectedResultLikeArray);
    });
  });

  describe('findIndex()', () => {
    it('should return the first index for value satisfying the predicate', () => {
      const source1 = [1, 2, 3, 2];
      const predicate = v => v === 2;

      expect(findIndex(source1, predicate)).toBe(1);
    });

    it('should return the first index for value satisfying the predicate, starting at a given index', () => {
      const source1 = [1, 2, 3, 2, 2];
      const predicate = v => v === 2;

      expect(findIndex(source1, predicate, 2)).toBe(3);
    });

    it('should return the -1 if no value satisfies the predicate', () => {
      const source1 = [1, 2, 3];
      const predicate = v => v === 0;

      expect(findIndex(source1, predicate)).toBe(-1);
    });
  });
});
