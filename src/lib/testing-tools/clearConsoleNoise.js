import { cleanup } from '@testing-library/react';

export default () => {
  // eslint-disable-next-line
  const originalError = console.error;
  // eslint-disable-next-line
  const originalWarn = console.warn;
  beforeAll(() => {
    // eslint-disable-next-line
    console.warn = (...args: any[]) => {
      if (/It looks like you've wrapped styled/.test(args[0])) {
        return;
      }
      originalWarn.call(console, ...args);
    };
    // eslint-disable-next-line
    console.error = (...args: any[]) => {
      if (/Warning.*not wrapped in act/.test(args[0])) {
        return;
      }
      originalError.call(console, ...args);
    };
  });

  afterAll(() => {
    // eslint-disable-next-line
    console.error = originalError;
    // eslint-disable-next-line
    console.warn = originalWarn;
    return cleanup();
  });
};
