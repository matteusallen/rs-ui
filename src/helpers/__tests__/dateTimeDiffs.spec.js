import { isEndDateEqualToStartDate, isStartTimeAfterEndTime, isEndDateEqualOrAfterStartDate } from '../dateTimeDiffs';

describe('dateTimeDiffs tests', () => {
  describe('isEndDateEqualToStartDate Tests', () => {
    test('return true if equivalent date strings passed in', () => {
      expect(isEndDateEqualToStartDate('01/01/2020', '01/01/2020')).toEqual(true);
    });

    test('return false if empty strings are passed as args', () => {
      expect(isEndDateEqualToStartDate('', '')).toEqual(false);
    });

    test('return false if earlier start date passed in', () => {
      expect(isEndDateEqualToStartDate('12/31/2019', '01/01/2020')).toEqual(false);
    });

    test('return false if earlier end date passed in', () => {
      expect(isEndDateEqualToStartDate('01/01/2020', '12/31/2019')).toEqual(false);
    });
  });

  describe('isStartTimeAfterEndTime tests', () => {
    test('return true if start time is after end time', () => {
      expect(isStartTimeAfterEndTime('00:00:15', '00:00:00')).toEqual(true);
    });

    test('return false if start time is after end time', () => {
      expect(isStartTimeAfterEndTime('00:00:00', '00:00:15')).toEqual(true);
    });

    test('return false if empty strings are passed as args', () => {
      expect(isStartTimeAfterEndTime('', '')).toEqual(false);
    });
  });

  describe('isEndDateEqualOrAfterStartDate tests', () => {
    test('return true if dates are the same', () => {
      expect(isEndDateEqualOrAfterStartDate('01/01/2020', '01/01/2020')).toEqual(true);
    });

    test('return true if end date is after start date', () => {
      expect(isEndDateEqualOrAfterStartDate('01/01/2020', '01/02/2020')).toEqual(true);
    });

    test('return false if end date is before start date', () => {
      expect(isEndDateEqualOrAfterStartDate('01/02/2020', '01/01/2020')).toEqual(false);
    });
    test('return false if empty strings are passed as args', () => {
      expect(isEndDateEqualOrAfterStartDate('', '')).toEqual(false);
    });
  });
});
