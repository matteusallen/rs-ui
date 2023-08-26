// @flow
import React, { useState } from 'react';
import { compose } from 'recompose';

import RegisterFormTerms from './RegisterFormTerms';

import withRegister, { type RegisterUserInputType } from 'Mutations/Register';
import withLogin, { type LoginUserInputType } from 'Mutations/Login';
import AuthForm from 'Components/Forms/AuthForm';
import { TERMS_CONDITIONS_ERROR } from 'Constants/errors';

type RegisterUserReturnType = {|
  data: {
    register: {
      error?: string,
      userId?: string
    }
  }
|};

type RegisterFormPropsType = {|
  loginUser: (input: LoginUserInputType) => void,
  registerUser: (input: RegisterUserInputType) => RegisterUserReturnType
|};

const RegisterForm = (props: RegisterFormPropsType) => {
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const registerForm = true;

  const handleChange = e => {
    setChecked(e.currentTarget.checked);
  };
  const verify = () => checked;

  const submitRegistration = async () => {
    if (!checked) {
      setError(TERMS_CONDITIONS_ERROR);
      return;
    } else {
      setError(null);
    }

    const registerResult: RegisterUserReturnType = await props.registerUser({
      email: email.toLowerCase(),
      password
    });
    const data = (registerResult && registerResult.data) || null;
    if (!data) {
      // Most likely a network error - no valid graphql response
      setError('There has been an unexpected error. Please try again.');
      return;
    }

    if (data.register.error) {
      setError(data.register.error);
      return;
    }

    setError(null);
    await props.loginUser({ email, password });
    return data;
  };

  const passwordError = 'PASSWORD DOES NOT MEET REQUIREMENTS';
  const emailError = 'PLEASE ENTER A VALID EMAIL ADDRESS';

  const formProps = {
    email,
    emailError,
    error,
    updateEmail,
    password,
    passwordError,
    updatePassword,
    onSubmit: submitRegistration,
    registerForm,
    type: 'register',
    heading: 'CREATE ACCOUNT',
    verify
  };

  return (
    <AuthForm {...formProps}>
      <RegisterFormTerms checked={checked} onChange={handleChange} />
    </AuthForm>
  );
};

// eslint-disable-next-line prettier/prettier
export default compose(withRegister, withLogin)(RegisterForm);
