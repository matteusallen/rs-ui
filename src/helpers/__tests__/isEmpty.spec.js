import { isEmpty } from '../isEmpty';

describe('isEmpty', () => {
  test('empty', () => {
    expect(isEmpty({})).toBeTruthy();
  });
  test('not empty', () => {
    expect(isEmpty({ foo: true })).toBeFalsy();
  });
});
