import { parseDateAmPm } from '../parseDateAmPm';

describe('parseDateAmPm', () => {
  test('am', () => {
    const time = '8:30am';
    expect(parseDateAmPm(time)).toBe('8:30:00');
  });
  test('pm', () => {
    const time = '8:30pm';
    expect(parseDateAmPm(time)).toBe('20:30:00');
  });
  test('noon', () => {
    const time = '12:30pm';
    expect(parseDateAmPm(time)).toBe('12:30:00');
  });
  test('midnight', () => {
    const time = '00:30am';
    expect(parseDateAmPm(time)).toBe('00:30:00');
  });
});
