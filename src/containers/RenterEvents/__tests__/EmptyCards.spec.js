import EmptyCards from '../EmptyCards';
import { renderWithStyle } from '../../../lib/testing-tools';

jest.mock('../../assets/img/renters-light-gray.svg');

//[ itemsCount, emptyCardsExpectation]
const cases = [
  [1, 2],
  [2, 1],
  [3, 0],
  [4, 2],
  [5, 1],
  [6, 0],
  [7, 2],
  [8, 1],
  [9, 0]
];

describe('EmptyCards', () => {
  cases.forEach(([itemsCount, emptyCardsExpectation]) => {
    test(`itemsCount=${itemsCount} should render ${emptyCardsExpectation} empty boxes`, () => {
      const { getAllByText } = renderWithStyle(<EmptyCards className={'foo'} itemsCount={itemsCount} />);
      // empty cards are only visible when is there less than 3 events
      if (itemsCount >= 3) {
        expect(() => getAllByText('More events coming soon!')).toThrowError();
      } else {
        const allMatches = getAllByText('More events coming soon!');
        expect(allMatches.length).toBe(emptyCardsExpectation);
      }
    });
  });
});
