import { getRefundableAmount } from '../getRefundableAmount';

describe('getRefundableAmount', () => {
  test('javascript decimals', () => {
    const total = 31.2 - 31.1;
    expect(total).not.toEqual(0.1);
    expect(total).toEqual(0.09999999999999787);
  });

  const testCases = [
    {
      payments: [
        { amount: 31.2, success: true },
        { amount: -31.1, success: true }
      ],
      total: 0.1
    },
    {
      payments: [
        { amount: 99.99, success: true },
        { amount: -9.44, success: true }
      ],
      total: 90.55
    },
    {
      payments: [
        { amount: 0.1, success: true },
        { amount: -0.01, success: false }
      ],
      total: 0.1
    }
  ];

  testCases.forEach(({ total, payments }) => {
    test(`refundable amount must be ${total}`, () => {
      expect(getRefundableAmount(payments)).toEqual(total);
    });
  });
});
