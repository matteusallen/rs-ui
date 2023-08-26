import { LETTERS_AND_SPACES, LETTERS_ONLY } from '../regExes';

describe('validation', () => {
  test('LETTERS_AND_SPACES', () => {
    const testCases = ['Diego Jose', 'Diego Picasso jr', 'Pablo Diego Jose Francisco de Picasso', "conan o'brien", 'Mary-jane Watson', 'St. Clair'];
    for (const item of testCases) {
      expect(item.match(LETTERS_AND_SPACES)).toBeTruthy();
    }

    const badCases = ['Diego@Jose ', 'Diego13', 'Pablo Diego Jose 16', "10 conan o'brien11", '10Mary-jane Watson10', 'Ricardo 🤣', '🤣🤣John🤣🤣'];
    for (const item of badCases) {
      expect(item.match(LETTERS_AND_SPACES)).toBeFalsy();
    }
  });

  test('LETTERS_ONLY', () => {
    const testCases = ['Diego', 'John'];
    for (const item of testCases) {
      expect(item.match(LETTERS_ONLY)).toBeTruthy();
    }

    const badCases = ['Diego@Jose', 'Diego13', 'Pablo Diego Jose 16'];
    for (const item of badCases) {
      expect(item.match(LETTERS_ONLY)).toBeFalsy();
    }
  });
});
