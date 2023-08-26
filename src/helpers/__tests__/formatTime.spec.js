import { formatTime } from '../formatTime';

describe('formatTime', () => {
  const testCases = [
    {
      input: '13:00:00',
      output: '1:00pm'
    },
    {
      input: '11:00:00',
      output: '11:00am'
    },
    {
      input: '00:00:00',
      output: '12:00am'
    }
  ];
  testCases.forEach(({ input, output }) => {
    test(input, () => {
      expect(formatTime(input)).toBe(output);
    });
  });
});
