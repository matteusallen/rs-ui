import { makeObservable, observable, computed, action, toJS } from 'mobx';
import validator from 'validator';
import { PHONE_NORMALIZE_RE, NAME_RE, ONE_NUMBER, ONE_UPPERCASE, ONE_LOWERCASE } from 'Constants/regExes';

export type SignUpStorePropNameType = 'firstName' | 'lastName' | 'phone' | 'email' | 'password';

export interface ISignUpErrors {
  firstName: boolean;
  lastName: boolean;
  phone: boolean;
  email: boolean;
  password: boolean;
  passwordDetails: {
    hasOneNumber: boolean;
    hasOneUppercase: boolean;
    hasOneLowercase: boolean;
    hasEightCharacters: boolean;
  };
}

export interface ISignUpJSON {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}

export class SignUpStore {
  firstName: string = '';
  lastName: string = '';
  phone: string = '';
  email: string = '';
  password: string = '';

  constructor() {
    makeObservable(this, {
      firstName: observable,
      lastName: observable,
      phone: observable,
      email: observable,
      password: observable,
      setProp: action,
      errors: computed,
      toJSON: computed,
      reset: action
    });
  }

  setProp(prop: SignUpStorePropNameType, value: string): void {
    this[prop] = value;
  }

  get errors(): ISignUpErrors {
    const hasOneNumber: boolean = !!this.password.match(ONE_NUMBER);
    const hasOneUppercase: boolean = !!this.password.match(ONE_UPPERCASE);
    const hasOneLowercase: boolean = !!this.password.match(ONE_LOWERCASE);
    const hasEightCharacters: boolean = this.password.length >= 8;

    return {
      firstName: !this.firstName.match(NAME_RE),
      lastName: !this.lastName.match(NAME_RE),
      phone: !validator.isMobilePhone(this.phone, 'en-US', { strictMode: false }),
      email: !validator.isEmail(this.email),
      password: !(hasOneNumber && hasOneUppercase && hasOneLowercase && hasEightCharacters),
      passwordDetails: {
        hasOneNumber,
        hasOneUppercase,
        hasOneLowercase,
        hasEightCharacters
      }
    };
  }

  get toJSON(): ISignUpJSON {
    const thisJSON = toJS(this);

    return {
      firstName: thisJSON.firstName.trim(),
      lastName: thisJSON.lastName.trim(),
      phone: thisJSON.phone.replace(PHONE_NORMALIZE_RE, ''),
      email: this.email.trim().toLowerCase(),
      password: thisJSON.password
    };
  }

  reset(): void {
    this.firstName = '';
    this.lastName = '';
    this.phone = '';
    this.email = '';
    this.password = '';
  }
}

const instance: SignUpStore = new SignUpStore();

export default instance;
