import { reportGraphqlError } from '../graphqlResponseUtil';

describe('graphqlResponseUtil tests', () => {
  describe('reportGraphqlError tests', () => {
    let consoleErrorSpy = null;
    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    afterAll(() => {
      jest.restoreAllMocks();
    });

    it('Should display a snackbar and log to console', () => {
      const showSnackbar = jest.fn();
      const sampleMessage = 'Something went wrong';

      reportGraphqlError(showSnackbar, sampleMessage, 'Specific error message');
      expect(showSnackbar).toHaveBeenCalledWith('Something went wrong', {
        error: true,
        duration: 6000,
        action: null
      });
      expect(consoleErrorSpy).toHaveBeenCalledWith('Something went wrong: Specific error message');
    });

    it('Should display a snackbar, but not log to console if no error message passed', () => {
      const showSnackbar = jest.fn();
      const sampleMessage = 'Something else went wrong';

      reportGraphqlError(showSnackbar, sampleMessage);
      expect(showSnackbar).toHaveBeenCalledWith('Something else went wrong', {
        error: true,
        duration: 6000,
        action: null
      });

      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('Should display a snackbar, and log error if it is an object', () => {
      const showSnackbar = jest.fn();
      const sampleMessage = 'Something else went wrong';

      reportGraphqlError(showSnackbar, sampleMessage, new Error('I am an Error object instance'));
      expect(showSnackbar).toHaveBeenCalledWith('Something else went wrong', {
        error: true,
        duration: 6000,
        action: null
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Something else went wrong: Error: I am an Error object instance');
    });

    it('Should display a snackbar, and have an action and longer duration, if role is renter', () => {
      const showSnackbar = jest.fn();
      const sampleMessage = 'Something else went wrong';

      reportGraphqlError(showSnackbar, sampleMessage, new Error('I am an Error object instance'), 'renter');
      expect(showSnackbar).toHaveBeenCalledWith('Something else went wrong', {
        error: true,
        duration: 1000 * 60 * 5,
        action: 'Close'
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('Something else went wrong: Error: I am an Error object instance');
    });
  });
});
