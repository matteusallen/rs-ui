import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardContent, TextField, CardActions } from '@material-ui/core';
import { isEmpty } from 'validator';

import PasswordRequirements from './PasswordRequirements.tsx';
import { displayFlex } from 'Styles/Mixins';
import { headingTwo, paragraphReg } from 'Styles/Typography';
import colors from 'Styles/Colors';
import Button from '../Button';
import { PasswordField } from '../Fields';

import { EMAIL, ONE_NUMBER, ONE_UPPERCASE, ONE_LOWERCASE, EIGHT_CHARACTERS } from 'Constants/regExes';

// type AuthFormPropsType = {|
//   children: Array<Node>,
//   className: string,
//   email: string,
//   emailError: string,
//   error?: string,
//   heading: string,
//   onSubmit: () => void,
//   password: string,
//   passwordError: string,
//   registerForm: boolean,
//   type: string,
//   updateEmail: (email: string) => void,
//   updatePassword: (email: string) => void
// |};

const AuthFormBase = props => {
  const { className, email, emailError, error, password, passwordError, registerForm } = props;
  const [submitButtonTouched, setSubmitButtonTouched] = useState(false);
  const [passwordFieldBlurred, setPasswordFieldBlurred] = useState(false);

  const isLogin = props.type === 'login';
  const forgotPassword = isLogin && (
    <div style={{ textAlign: 'right' }}>
      <StyledLink to="/forgot-password">FORGOT PASSWORD?</StyledLink>
    </div>
  );

  const onEnter = event => {
    if (event.key === 'Enter') {
      return props.onSubmit();
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    if ((!validEmail || !validPassword) && registerForm) {
      setSubmitButtonTouched(true);
    } else if ((!validEmail || isEmpty(password)) && !registerForm) {
      setSubmitButtonTouched(true);
    } else {
      props.onSubmit();
    }
  };

  const hasOneNumber = password.match(ONE_NUMBER);
  const hasOneUppercase = password.match(ONE_UPPERCASE);
  const hasOneLowercase = password.match(ONE_LOWERCASE);
  const hasEightCharacters = password.match(EIGHT_CHARACTERS);

  const validEmail = email.match(EMAIL);
  const validPassword = hasOneNumber && hasOneUppercase && hasOneLowercase && hasEightCharacters;

  const createContainerStyles = {
    minHeight: '370px'
  };

  const signUpStyles = {
    width: '100%'
  };

  return (
    <CardContent className={className}>
      <form onSubmit={onSubmit}>
        <h2 className={`${className}__header`}>{props.heading}</h2>
        <div style={registerForm ? createContainerStyles : signUpStyles}>
          {error && (
            <p data-testid="e2e-auth-error" className={`${className}__error-banner e2e-auth-error`}>
              {error}
            </p>
          )}
          <Field
            id="email-field"
            label="Email"
            type="email"
            name="email"
            helperText={!validEmail && submitButtonTouched && emailError}
            error={submitButtonTouched && !validEmail}
            autoComplete="email"
            variant="filled"
            value={props.email}
            onChange={e => props.updateEmail(e.target.value)}
          />
          {forgotPassword}
          <PasswordField
            label="Password"
            name="password"
            // for helper text, we have different criteria for showing error messages depending on if we're logging in or signing up
            helperText={(submitButtonTouched && isEmpty(password) && passwordError) || (submitButtonTouched && !validPassword && registerForm && passwordError)}
            error={(submitButtonTouched && isEmpty(password)) || (submitButtonTouched && !validPassword && registerForm)}
            value={props.password}
            onChange={e => props.updatePassword(e.target.value)}
            onBlur={registerForm ? () => setPasswordFieldBlurred(true) : null}
            onKeyPress={onEnter}
          />
          {registerForm && (
            <PasswordRequirements
              hasOneNumber={hasOneNumber}
              hasOneUppercase={hasOneUppercase}
              hasOneLowercase={hasOneLowercase}
              hasEightCharacters={hasEightCharacters}
              passwordFieldBlurred={passwordFieldBlurred}
            />
          )}
        </div>
        {props.children}
        <StyledActions>
          <SubmitButton data-testid="auth-form-submit-button" primary variant="contained" size="large" className={`${className}__submit-button`} type="submit">
            {isLogin ? 'SIGN IN' : 'SIGN UP'}
          </SubmitButton>
          <Paragraph>
            {isLogin && `DON'T HAVE AN ACCOUNT? `}
            <StyledLink id={isLogin ? 'sign-up' : 'login'} to={isLogin ? '/create-account' : 'login'} className={isLogin ? 'e2e-signup' : 'e2e-back-to-signin'}>
              {isLogin ? 'SIGN UP' : 'BACK TO SIGN IN'}{' '}
            </StyledLink>
          </Paragraph>
        </StyledActions>
      </form>
    </CardContent>
  );
};

const SubmitButton = styled(Button)`
  &&& {
    width: 100%;
    margin: 20px auto 25px;
    height: auto;
  }
`;

const StyledActions = styled(CardActions)`
  ${displayFlex}
  flex-direction: column;
  align-self: center;
  width: 100%;
  &&& {
    padding: 8px 0;
  }
`;

const Field = styled(TextField)`
  &&& {
    font-size: 15px;
    margin-bottom: 20px;
    text-transform: uppercase;
    width: 100%;
    background-color: ${colors.background.primary};
    .MuiInputLabel-formControl {
      color: #242424;
      font-size: 15px;
    }
    .MuiInputLabel-shrink {
      color: #adadad;
    }
    .MuiFormLabel-root.Mui-error {
      color: ${colors.error.primary};
    }
    input,
    label {
      font-family: 'IBMPlexSans-Regular';
      background-color: ${colors.background.primary};
    }
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px ${colors.background.primary} inset !important;
    }
  }
  &.create-acct--pw {
    margin-top: 25px;
  }
`;

const StyledLink = styled(Link)`
  ${paragraphReg}
  color: ${colors.text.link};
  align-self: flex-end;
  font-size: 0.9375rem;
  line-height: 17px;
  letter-spacing: 1px;
  text-decoration: none;
  padding: 0 2px;
   &:focus {
    outline-style: ridge;
  }
`;

const AuthForm = styled(AuthFormBase)`
  ${displayFlex}
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;
  &&& {
    padding: 25px;
  }
  &__error-banner {
    background-color: ${colors.error.primary};
    border-radius: 3px;
    color: #ffffff;
    font-family: 'IBMPlexSans-Regular';
    font-size: 14px;
    line-height: 25px;
    margin-top: 0px;
    margin-bottom: 10px;
    text-align: left;
    padding: 12px 10px 11px 10px;
    width: 346px;
  }
  h2 {
    ${headingTwo}
  }
  &__header {
    &&& {
      margin-bottom: 7px;
    }
  }
  &__submit-button {
    &&& {
      margin-bottom: 0px;
      margin-top: 5px;
    }
  }
  form {
    ${displayFlex}
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    @media screen and (min-width: 960px) {
      padding-top: 20px;
    }
    p.Mui-error {
      color: ${colors.error.primary};
      font-family: 'IBMPlexSans-Regular'
      font-size: 11px;
      letter-spacing: 0.48px;
      line-height: 11px;
      margin-left: 0;
      padding-left: 12px;
      white-space: nowrap;
    }
  }
`;

const Paragraph = styled.p`
  ${paragraphReg}
  &&& {
    font-size: 15px;
    letter-spacing: 1.05px;
    line-height: 17px;
    color: ${colors.text.primary};
  }
`;

export default AuthForm;
