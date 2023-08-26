/**
 * Log error and display user feedback snackbar on failure
 */
const reportGraphqlError = (showSnackbar, message, error = null, role) => {
  const renter = role === 'renter';
  const duration = renter ? 1000 * 60 * 5 : 6000;
  const action = renter ? 'Close' : null;

  // eslint-disable-next-line
  if (error) console.error(`${message}: ${error}`);
  if (showSnackbar && typeof showSnackbar === 'function')
    showSnackbar(message, {
      error: true,
      duration,
      action
    });
};

export { reportGraphqlError };
