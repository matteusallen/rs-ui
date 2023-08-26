import { LETTERS_AND_SPACES } from 'Constants/regExes';

// eslint-disable-next-line
export default function validateName(name) {
  const str = String(name || '');
  return !!str.trim().match(LETTERS_AND_SPACES);
}
