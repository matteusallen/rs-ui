import { calculateReservationNights, getStandardFormat } from '../dateTimeHelpers';

describe('calculateReservationNights()', () => {
  const reservation = {
    startDate: '2020/02/03',
    endDate: '2020/02/09'
  };
  const reservation2 = {
    startDate: '02/03/2020',
    endDate: '02/08/2020'
  };

  test('smoke test', () => {
    expect(calculateReservationNights(reservation)).toBe(6);
    expect(calculateReservationNights(reservation2)).toBe(5);
  });
});

describe('getStandardFormat()', () => {
  test('smoke test', () => {
    expect(getStandardFormat('2020-10-30')).toBe('10/30/20');
    expect(getStandardFormat('2020/10/31')).toBe('10/31/20');
  });
});
