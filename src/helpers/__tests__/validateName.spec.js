import validateName from '../validateName';

test('validateName', () => {
  const success = ['John St. Clair', 'Mary-jane', "Conan O'Brien"];
  const error = ['Jackson11', 99, '', 'adflkajsd@adflkjas', {}, null, undefined, NaN];

  for (const item of success) {
    expect(validateName(item)).toBeTruthy();
  }

  for (const item of error) {
    expect(validateName(item)).toBeFalsy();
  }
});
