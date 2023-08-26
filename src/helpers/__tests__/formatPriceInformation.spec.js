import { formatPriceInformation } from '../formatPriceInformation';

describe('formatPriceInformation', () => {
  test('smoke test', () => {
    expect(formatPriceInformation(100.2)).toEqual('100.20');
  });
  test('smoke test', () => {
    expect(formatPriceInformation(99)).toEqual('99.00');
  });
});
