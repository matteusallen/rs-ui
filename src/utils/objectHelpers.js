/**
 * Return a new object with properties not present in keys param.
 *
 * @param {Object} source
 * @param {Array|String} keys - an array of property names or a string
 * @returns {Object}
 */
export function omit(source, keys) {
  const originalKeys = Object.keys(source);
  const keysToOmit = keys instanceof Array ? new Set(keys.map(key => `${key}`)) : new Set([`${keys}`]);

  return originalKeys.reduce((acc, key) => {
    if (!keysToOmit.has(key)) acc[key] = source[key];
    return acc;
  }, {});
}

/**
 * Similar to _.get() function.
 *
 * @param {Object} source
 * @param {String} keyPath - dot separated for props and indices for arrays
 * @param {*} defaultValue
 * @returns {*} any type found or default value if not found
 */
export function getValueByPropPath(source, keyPath, defaultValue) {
  if (!source) return defaultValue;

  const keyPathArr = keyPath.split('.');
  let returnValue = defaultValue;

  const arrayIndexRE = /(\[\d+])$/;
  try {
    // start drilling props at source object root
    returnValue = source;
    for (let i = 0; i < keyPathArr.length; i++) {
      const key = keyPathArr[i];
      const keyArrayREMatch = key.match(arrayIndexRE);

      // handle array indices in key properties
      if (keyArrayREMatch) {
        const propertyName = key.replace(/\[\d+]/, '');
        const propArrayIndex = parseInt(keyArrayREMatch[0].replace(/[[\]]/g, ''), 10);

        const tempRef = propertyName ? returnValue[propertyName] : returnValue;
        // eslint-disable-next-line no-prototype-builtins
        if (propertyName && !returnValue.hasOwnProperty(propertyName)) {
          returnValue = defaultValue;
          break;
        }
        returnValue = tempRef[propArrayIndex];
      } else {
        // handle regular keys
        // eslint-disable-next-line no-prototype-builtins
        if (!returnValue.hasOwnProperty(key)) {
          returnValue = defaultValue;
          break;
        }
        returnValue = returnValue[key];
      }

      if (returnValue === undefined) {
        returnValue = defaultValue;
        break;
      }
    }
  } catch (e) {
    // we likely have a bad keyPath, use the defaultValue for now
    returnValue = defaultValue;
  }

  return returnValue;
}
