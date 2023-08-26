/**
 * Return a new array with unwanted "values", maintains order or source. see _.difference()
 *
 * @param {Array} source
 * @param {Array} valueList - a list of values, "primitives" by value and others by reference
 * @returns {Array}
 */
export function difference(source, valueList) {
  const result = [];
  const excluded = new Set(valueList);
  source.forEach(value => {
    if (!excluded.has(value)) result.push(value);
  });
  return result;
}

/**
 * Index value of first element satisfying the predicate callback. see _.findIndex()
 *
 * @param {Array} source
 * @param {Function} predicateCallback - has one argument. see _.identity()
 * @param {Number} fromIndex - index value to start from
 * @returns {Number} first index that satisfies predicate or -1 if no satisfactory match
 */
export function findIndex(source, predicateCallback, fromIndex = 0) {
  for (let i = fromIndex; i < source.length; i++) {
    if (predicateCallback(source[i])) return i;
  }

  return -1;
}

/**
 * Returns new array with objects sorted by value param
 *
 * @param {Array} source
 * @param {String} value - value for comparison to sort by
 * @returns {Array}
 */
export function sortArrayOfObj(arr, value) {
  if (!arr || arr.length === 0) return [];
  return arr.sort((a, b) => (!!a && !!b ? a[value].localeCompare(b[value], 'en', { numeric: true }) : 0));
}
