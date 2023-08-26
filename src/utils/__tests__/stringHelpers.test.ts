import { formatPhoneNumber } from 'Utils/stringHelpers';

describe('stringHelpers', () => {
  describe('formatPhoneNumber()', () => {
    it('should return three or less digits as they are', () => {
      expect(formatPhoneNumber('1')).toEqual('1');
      expect(formatPhoneNumber('12')).toEqual('12');
      expect(formatPhoneNumber('123')).toEqual('123');
    });

    it('should add bracket wrapped area code and space for inputs with six or less digits', () => {
      expect(formatPhoneNumber('1234')).toEqual('(123) 4');
      expect(formatPhoneNumber('12345')).toEqual('(123) 45');
      expect(formatPhoneNumber('123456')).toEqual('(123) 456');
    });

    it('should fully format inputs with seven or more digits', () => {
      expect(formatPhoneNumber('1234567')).toEqual('(123) 456-7');
      expect(formatPhoneNumber('12345678')).toEqual('(123) 456-78');
      expect(formatPhoneNumber('123456789')).toEqual('(123) 456-789');
    });

    it('should strip out non digit characters from the input', () => {
      expect(formatPhoneNumber('123456789         ')).toEqual('(123) 456-789');
      expect(formatPhoneNumber('        123456789')).toEqual('(123) 456-789');
      expect(formatPhoneNumber('acb!@#$%^&*()_+ 123456789')).toEqual('(123) 456-789');
    });
  });
});
