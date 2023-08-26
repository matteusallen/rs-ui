import { getPriceSubtext } from '../getPriceSubtext';

const testCases = [
  {
    input: {
      productType: 'rvs',
      nightly: true,
      reservationDuration: 0,
      quantity: 0,
      price: 5,
      availability: 100
    },
    expected: '$5 per night'
  },
  {
    input: {
      productType: 'rvs',
      nightly: false,
      reservationDuration: 0,
      price: 5,
      quantity: 0,
      availability: 100
    },
    expected: '$5 flat rate per spot'
  },
  {
    input: {
      productType: 'rvs',
      nightly: true,
      reservationDuration: 1,
      price: 5,
      quantity: 1,
      availability: 100
    },
    expected: 'for 1 spot, $5 per night'
  },
  {
    input: {
      productType: 'rvs',
      nightly: true,
      reservationDuration: 10,
      price: 5,
      quantity: 10,
      availability: 100
    },
    expected: 'for 10 spots, $5 per night'
  },
  {
    input: {
      productType: 'stalls',
      nightly: false,
      reservationDuration: 0,
      price: 5,
      quantity: 0,
      availability: 100
    },
    expected: '$5 flat rate per stall'
  },
  {
    input: {
      productType: 'stalls',
      nightly: false,
      reservationDuration: 1,
      price: 5,
      quantity: 1,
      availability: 100
    },
    expected: 'for 1 stall, $5 flat rate per stall'
  },
  {
    input: {
      productType: 'stalls',
      nightly: false,
      reservationDuration: 10,
      price: 5,
      quantity: 10,
      availability: 100
    },
    expected: 'for 10 stalls, $5 flat rate per stall'
  },
  {
    input: {
      productType: 'stalls',
      nightly: true,
      reservationDuration: 0,
      price: 5,
      quantity: 0,
      availability: 100
    },
    expected: '$5 per night'
  },
  {
    input: {
      productType: 'stalls',
      nightly: true,
      reservationDuration: 1,
      price: 5,
      quantity: 1,
      availability: 100
    },
    expected: 'for 1 stall, $5 per night'
  },
  {
    input: {
      productType: 'stalls',
      nightly: true,
      reservationDuration: 10,
      price: 5,
      quantity: 10,
      availability: 100
    },
    expected: 'for 10 stalls, $5 per night'
  },
  {
    input: {
      productType: 'stalls',
      nightly: true,
      reservationDuration: 10,
      price: 5,
      quantity: 10,
      availability: 1
    },
    expected: 'for 10 stalls, $5 per night'
  }
];

describe('getPriceSubtext', () => {
  testCases.forEach(({ input, expected }) => {
    const title = `${input.productType} ${input.nightly ? 'nightly' : 'not nightly'} nights:${input.reservationDuration} quantity: ${input.quantity}`;
    test(title, () => {
      const result = getPriceSubtext(input);
      expect(result).toBe(expected);
    });
  });
});
