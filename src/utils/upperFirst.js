//@flow
/**
 * Set first char in string to upper case
 *
 * @private
 * @param {string} value The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
const _upperFirst = (value: string) => {
  if (!value) {
    return '';
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export default _upperFirst;
