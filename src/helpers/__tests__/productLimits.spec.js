import { hasProductQuantityError, isMaximumAddOnAllowedExceeded, isMaximumAllowedExceeded } from '../productLimits';

describe('Product Limit Helper tests', () => {
  describe('isMaximumAllowedExceeded tests (stalls)', () => {
    test('Should return true if number requested is greater than limit for stalls', () => {
      // arrange
      const arg = 51;

      // act
      const result = isMaximumAllowedExceeded(arg, 'stalls');

      // assert
      expect(result).toEqual(true);
    });

    test('Should return true if string(number) requested is greater than limit for stalls', () => {
      // arrange
      const arg = '51';

      // act
      const result = isMaximumAllowedExceeded(arg, 'stalls');

      // assert
      expect(result).toEqual(true);
    });

    test('Should return false for stalls if bad argument sent', () => {
      // arrange
      const arg = null;

      // act
      const result = isMaximumAllowedExceeded(arg, 'stalls');

      // assert
      expect(result).toEqual(false);
    });
  });

  describe('isMaximumAllowedExceeded tests (rvs)', () => {
    test('Should return true if number requested is greater than limit for rvs', () => {
      // arrange
      const arg = 51;

      // act
      const result = isMaximumAllowedExceeded(arg, 'rvs');

      // assert
      expect(result).toEqual(true);
    });

    test('Should return true if string(number) requested is greater than limit for rvs', () => {
      // arrange
      const arg = '51';

      // act
      const result = isMaximumAllowedExceeded(arg, 'rvs');

      // assert
      expect(result).toEqual(true);
    });

    test('Should return false for stalls if bad argument sent', () => {
      // arrange
      const arg = null;

      // act
      const result = isMaximumAllowedExceeded(arg, 'rvs');

      // assert
      expect(result).toEqual(false);
    });
  });

  describe('isMaximumAddOnAllowedExceeded tests', () => {
    test('Should return true if number requested is greater than limit', () => {
      // arrange
      const arg = 151;

      // act
      const result = isMaximumAddOnAllowedExceeded(arg);

      // assert
      expect(result).toEqual(true);
    });

    test('Should return false if bad argument sent', () => {
      // arrange
      const arg = null;

      // act
      const result = isMaximumAddOnAllowedExceeded(arg);

      // assert
      expect(result).toEqual(false);
    });
  });

  describe('hasProductQuantityError tests', () => {
    test('Should return true if number requested is greater than limit for rvs', () => {
      // arrange
      const arg = {
        rv_spot: {
          quantity: 'Maximum exceeded'
        }
      };
      // act
      const result = hasProductQuantityError(true, arg);

      // assert
      expect(result).toEqual(true);
    });

    test('Should return true if number requested is greater than limit for stalls', () => {
      // arrange
      const arg = {
        stalls: {
          quantity: 'Maximum exceeded'
        }
      };
      // act
      const result = hasProductQuantityError(false, arg);

      // assert
      expect(result).toEqual(true);
    });

    test('Should return false if no matching error', () => {
      // arrange
      const arg = {
        stalls: {
          some_other_property: 'Some other error message'
        }
      };

      // act
      const result = hasProductQuantityError(false, arg);

      // assert
      expect(result).toEqual(false);
    });

    test('Should return false if bad argument sent', () => {
      // arrange
      const arg = null;

      // act
      const result = hasProductQuantityError(true, arg);

      // assert
      expect(result).toEqual(false);
    });
  });
});
