/**
 * Converts string to standard '(512) 555-555' format.
 *
 * @param {string} input
 * @returns {string}
 */
export function formatPhoneNumber(input: string): string {
  const value: string = input.replace(/\D/g, '');

  if (!value || value.length <= 3) return value;
  if (value.length <= 6) return `(${value.slice(0, 3)}) ${value.slice(3)}`;
  return `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
}

export const isNullOrWhiteSpace = (str: string): boolean => {
  return str === null || str === undefined || str.match(/^ *$/) !== null;
};
