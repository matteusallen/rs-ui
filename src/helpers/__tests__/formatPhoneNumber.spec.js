import { formatPhoneNumber } from '../formatPhoneNumber';

describe('formatPhoneNumber', () => {
  test('smoke test', () => {
    expect(formatPhoneNumber('1234598767')).toBe('(123) 459-8767');
    expect(formatPhoneNumber('9999999999')).toBe('(999) 999-9999');
  });
  test('invalid phone', () => {
    expect(() => formatPhoneNumber('1234598767999')).toThrowError();
  });
});
