import { createDateRange, datesInRange } from '../momentRange';

describe('createDateRage', () => {
  const testCases = [
    {
      params: {
        eventStartDate: '2020-09-15',
        eventEndDate: '2020-09-18',
        selectedStartDate: ''
      },
      result: [['2020-09-15', '2020-09-16', '2020-09-17'], []]
    },
    {
      params: {
        eventStartDate: '2020-07-09',
        eventEndDate: '2020-07-12',
        selectedStartDate: '2020-07-10'
      },
      result: [
        ['2020-07-09', '2020-07-10', '2020-07-11'],
        ['2020-07-11', '2020-07-12', '2020-07-13']
      ]
    },
    {
      params: {
        eventStartDate: '2020-07-09',
        eventEndDate: '2020-07-12',
        selectedStartDate: '2020-07-10',
        isEdit: true
      },
      result: [
        ['2020-07-09', '2020-07-10', '2020-07-11'],
        ['2020-07-10', '2020-07-11', '2020-07-12', '2020-07-13']
      ]
    },
    {
      params: {
        eventStartDate: '2021-02-28',
        eventEndDate: '2021-03-1',
        selectedStartDate: ''
      },
      result: [['2021-02-28'], []]
    }
  ];

  testCases.forEach(({ params: { eventStartDate, eventEndDate, selectedStartDate, isEdit }, result }) => {
    const [fromExpect, toExpect] = result;
    test(`date range from: ${eventStartDate} to: ${eventEndDate}`, () => {
      const [from, to] = createDateRange({
        eventStartDate,
        eventEndDate,
        selectedStartDate,
        isEdit
      });
      expect(from).toEqual(fromExpect);
      expect(to).toEqual(toExpect);
    });
  });
});

describe('datesInRange', () => {
  test('dates in range', () => {
    const res = datesInRange({
      start: '2020-10-03',
      end: '2020-10-20',
      selected: {
        start: '2020-10-05',
        end: '2020-10-10'
      }
    });
    expect(res).toEqual(true);
  });

  test('dates out range', () => {
    const res = datesInRange({
      start: '2020-10-03',
      end: '2020-10-20',
      selected: {
        start: '2020-10-02',
        end: '2020-10-21'
      }
    });
    expect(res).toEqual(false);
  });
});
