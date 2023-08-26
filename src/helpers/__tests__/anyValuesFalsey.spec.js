import { anyValuesFalsey } from '../anyValuesFalsey';

describe('anyValuesFalsey', () => {
  test('has falsy value', () => {
    const obj = {
      foo: true,
      bar: undefined
    };
    expect(anyValuesFalsey(obj)).toBeTruthy();
  });

  test('has no falsy value', () => {
    const obj = {
      foo: true,
      bar: true
    };
    expect(anyValuesFalsey(obj)).toBeFalsy();
  });
});
