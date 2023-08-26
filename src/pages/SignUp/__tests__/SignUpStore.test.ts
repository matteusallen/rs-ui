import { SignUpStore } from 'Pages/SignUp/SignUpStore';

describe('SingUpStore', () => {
  let instance: SignUpStore;
  beforeEach(() => {
    instance = new SignUpStore();
  });

  const validFirstName = 'Bruce';
  const validLastName = 'Wayne';
  const validPhone = '(512) 555-5555';
  const validEmail = 'batman@batcave.com';
  const validPassword = 'Joker123';

  it('should initialize with "empty" values', () => {
    expect(instance.firstName).toEqual('');
    expect(instance.lastName).toEqual('');
    expect(instance.phone).toEqual('');
    expect(instance.email).toEqual('');
    expect(instance.password).toEqual('');
  });

  it('should have a setter for observable properties', () => {
    instance.setProp('firstName', validFirstName);
    instance.setProp('lastName', validLastName);
    instance.setProp('phone', validPhone);
    instance.setProp('email', validEmail);
    instance.setProp('password', validPassword);

    expect(instance).toHaveProperty('setProp');
    expect(typeof instance.setProp).toBe('function');
    expect(instance.firstName).toEqual(validFirstName);
    expect(instance.lastName).toEqual(validLastName);
    expect(instance.phone).toEqual(validPhone);
    expect(instance.email).toEqual(validEmail);
    expect(instance.password).toEqual(validPassword);
  });

  it('should compute errors for given inputs', () => {
    const invalidFirstName = '';
    const invalidLastName = '!';
    const invalidPhone = '(512) 555';
    const invalidEmail = 'batmanbatcave.com';
    const invalidPassword = '!#@$';

    instance.setProp('firstName', invalidFirstName);
    instance.setProp('lastName', invalidLastName);
    instance.setProp('phone', invalidPhone);
    instance.setProp('email', invalidEmail);
    instance.setProp('password', invalidPassword);

    const { errors } = instance;

    expect(errors.firstName).toBeTruthy();
    expect(errors.lastName).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.password).toBeTruthy();
    expect(errors.passwordDetails.hasEightCharacters).toBeFalsy();
    expect(errors.passwordDetails.hasOneLowercase).toBeFalsy();
    expect(errors.passwordDetails.hasOneUppercase).toBeFalsy();
    expect(errors.passwordDetails.hasOneNumber).toBeFalsy();
  });

  it('should should pass valid inputs', () => {
    instance.setProp('firstName', validFirstName);
    instance.setProp('lastName', validLastName);
    instance.setProp('phone', validPhone);
    instance.setProp('email', validEmail);
    instance.setProp('password', validPassword);

    const { errors } = instance;

    expect(errors.firstName).toBeFalsy();
    expect(errors.lastName).toBeFalsy();
    expect(errors.phone).toBeFalsy();
    expect(errors.email).toBeFalsy();
    expect(errors.password).toBeFalsy();
    expect(errors.passwordDetails.hasEightCharacters).toBeTruthy();
    expect(errors.passwordDetails.hasOneLowercase).toBeTruthy();
    expect(errors.passwordDetails.hasOneUppercase).toBeTruthy();
    expect(errors.passwordDetails.hasOneNumber).toBeTruthy();
  });

  it('should compute a formatted serialized object', () => {
    instance.setProp('firstName', ` ${validFirstName}`);
    instance.setProp('lastName', `${validLastName} `);
    instance.setProp('phone', validPhone);
    instance.setProp('email', validEmail.toUpperCase());
    instance.setProp('password', validPassword);

    const json = instance.toJSON;

    expect(json.firstName).toEqual(validFirstName);
    expect(json.lastName).toEqual(validLastName);
    expect(json.phone).toEqual('5125555555');
    expect(json.email).toEqual(validEmail.toLowerCase());
    expect(json.password).toEqual(validPassword);
  });
});
