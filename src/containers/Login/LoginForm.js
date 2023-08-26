// @flow
import React, { useState } from 'react';
import { isEmail, isEmpty } from 'validator';
import { EMAIL_ERROR, PASSWORD_ERROR } from '../../constants/errors';
import LoginFormTerms from './LoginFormTerms';
import withLogin, { type LoginUserInputType } from '../../mutations/Login';
import AuthForm from '../../components/Forms/AuthForm';

type LoginFormPropsType = {|
  loginUser: (input: LoginUserInputType) => void,
  rejectedRoutes: Array<string>
|};

const LoginForm = (props: LoginFormPropsType) => {
  const [email, updateEmail] = useState('');
  const [password, updatePassword] = useState('');
  const [error, setError] = useState(false);
  const registerForm = false;

  const canSubmit = () => {
    const emailError = !isEmail(email) || isEmpty(email) ? EMAIL_ERROR : null;
    const passwordError = isEmpty(password) ? PASSWORD_ERROR : null;
    return [emailError || passwordError];
  };

  const submitLogin = async () => {
    const [emailError, passwordError] = canSubmit();
    if (!emailError && !passwordError) {
      // eslint-disable-next-line flowtype/no-weak-types
      const response: any = await props.loginUser({ email, password });
      const {
        // $FlowIgnore
        data: {
          logIn: { auth }
        }
      } = response;
      if (auth.error) {
        setError(auth.error);
      }
    }
  };

  // error messages for the AuthForm component, distinct from the variables in the above functions
  const passwordError = 'PLEASE ENTER A PASSWORD TO SIGN IN';
  const emailError = isEmpty(email) ? 'PLEASE ENTER AN EMAIL ADDRESS TO SIGN IN' : 'PLEASE ENTER A VALID EMAIL ADDRESS';

  const formProps = {
    email,
    emailError,
    error,
    updateEmail,
    password,
    passwordError,
    updatePassword,
    onSubmit: submitLogin,
    registerForm,
    type: 'login',
    heading: 'SIGN IN'
  };
  return (
    <AuthForm {...formProps}>
      <LoginFormTerms />
    </AuthForm>
  );
};

export default withLogin(LoginForm);
