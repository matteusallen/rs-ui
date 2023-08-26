export const ONE_LOWERCASE: RegExp = /[a-z]/;

export const ONE_UPPERCASE: RegExp = /[A-Z]/;

export const ONE_NUMBER: RegExp = /\d/;

export const EIGHT_CHARACTERS: RegExp = /^[\w!@#$%^&*()_+\-={}[\]';:|,.<>]{8,}/;

export const EMAIL: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

export const LETTERS_ONLY: RegExp = /^[a-z]+$/i;

export const LETTERS_AND_SPACES: RegExp = /^[a-z\s\-'.]+$/i;

export const PHONE_NORMALIZE_RE: RegExp = /\D/g;

export const NAME_RE: RegExp = /^[a-z]/i;
