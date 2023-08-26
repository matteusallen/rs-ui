import React, { useState } from 'react';
import { withRouter } from 'react-router';
import { Link, Redirect } from 'react-router-dom';
import { Grid, Card, CardContent, CardActions, FormControl } from '@material-ui/core';
import styled from 'styled-components';
import { compose } from 'recompose';
import { useQuery } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import withResetPassword from '../mutations/ResetPassword';
import Button from 'Components/Button';
import RodeoLogo from 'Assets/img/rodeo-logistics-logo-dark.png';
import OpenStallsLogo from 'Assets/img/open-stalls-black.png';
import { displayFlex } from 'Styles/Mixins';
import { headingTwo, paragraphReg } from '../styles/Typography';
import colors from '../styles/Colors';
import { PasswordField } from 'Components/Fields';
import { RESET_PASSWORD_TOKEN_EXPIRED_CHECK } from 'Queries/ResetPasswordTokenExpiredCheck';

import PasswordRequirements from 'Components/Forms/PasswordRequirements';

import { ONE_NUMBER, ONE_UPPERCASE, ONE_LOWERCASE, EIGHT_CHARACTERS } from 'Constants/regExes';

const ResetPassword = props => {
  const [success, setSuccess] = useState(false);

  const { location } = props;
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get('token');

  const { data, loading } = useQuery(RESET_PASSWORD_TOKEN_EXPIRED_CHECK, {
    variables: { token }
  });

  const formik = useFormik({
    initialValues: {
      password: '',
      checkedTermsAndConditions: false
    },
    validationSchema: Yup.object().shape({
      password: Yup.string()
        .required()
        .min(8)
        .matches(ONE_NUMBER)
        .matches(ONE_UPPERCASE)
        .matches(ONE_LOWERCASE)
    }),
    onSubmit: async values => {
      const { password } = values;
      const response = await props.resetPassword({
        password,
        resetPasswordToken: props.location.search.slice(7)
      });
      const {
        data: {
          resetPassword: { success }
        }
      } = response;
      if (success) setSuccess(true);
    }
  });

  const { password } = formik.values;

  const hasOneNumber = password.match(ONE_NUMBER);
  const hasOneUppercase = password.match(ONE_UPPERCASE);
  const hasOneLowercase = password.match(ONE_LOWERCASE);
  const hasEightCharacters = password.match(EIGHT_CHARACTERS);

  if (!loading && data && data.checkResetPasswordTokenExpired.expired) {
    return <Redirect to="/forgot-password?expired=true" />;
  }

  return (
    <GridBase container spacing={10}>
      <Grid className="card--container" item xs={12} md={2} />
      <Grid className="card--container" item xs={12} md={8}>
        <ResetPasswordOutter>
          <img className="open-stalls-logo" src={OpenStallsLogo} alt={'Open Stalls Logo'} />
          <img className="rodeo-logistics-logo" src={RodeoLogo} alt="Rodeo Logistics Logo" />
          <LoginCardWrapper>
            <form onSubmit={formik.handleSubmit}>
              {!success && (
                <StyledLoginCard>
                  <h2>RESET PASSWORD</h2>
                  <p>Enter your new password.</p>
                  <FormControl>
                    <PasswordField label="Password" {...formik.getFieldProps('password')} />
                    <PasswordRequirements
                      hasOneNumber={hasOneNumber}
                      hasOneUppercase={hasOneUppercase}
                      hasOneLowercase={hasOneLowercase}
                      hasEightCharacters={hasEightCharacters}
                      passwordFieldBlurred={formik.touched.password}
                    />
                  </FormControl>
                  <StyledLoginActions>
                    <SubmitButton primary type="submit" variant="contained" size="large">
                      SUBMIT
                    </SubmitButton>
                  </StyledLoginActions>
                </StyledLoginCard>
              )}
              {success && (
                <StyledLoginCard>
                  <h2 className={'success-msg'}>SUCCESS!</h2>
                  <p>Your password has been successfully reset.</p>
                  <p>You can now sign in with your new password.</p>
                  <StyledLoginActions>
                    <StyledLink to="/login">GO TO SIGN IN</StyledLink>
                  </StyledLoginActions>
                </StyledLoginCard>
              )}
            </form>
          </LoginCardWrapper>
        </ResetPasswordOutter>
      </Grid>
      <Grid className="card--container" item xs={12} md={2} />
    </GridBase>
  );
};

const GridBase = styled(Grid)`
  &&& {
    max-width: 100%;
    overflow-x: hidden;
    margin: 0;
  }
`;

const ResetPasswordOutter = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .open-stalls-logo {
    width: 300px;
    margin-bottom: 10px;
  }
  .rodeo-logistics-logo {
    width: 300px;
    margin-bottom: 30px;
  }
  @media screen and (min-width: 960px) {
    left: 50%;
    top: 50%;
    position: absolute;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
  }
`;

const LoginCardWrapper = styled(Card)`
  ${displayFlex}
  flex-direction: column;
  height: auto;
  width: 100%;
  margin-bottom: 24px;

  & form {
    width: 100%;
  }

  &&& {
    box-shadow: 0 2px 5px 0 rgba(17, 24, 31, 0.3), 0 2px 10px 0 rgba(17, 24, 31, 0.1);
    border-radius: 0;
  }

  @media screen and (min-width: 960px) {
    ${displayFlex}
    flex-direction: row;
    width: 100vw;
    max-width: 385px;
    height: inherit;
    padding: 25px;
  }
`;

const StyledLoginCard = styled(CardContent)`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  height: inherit;
  align-items: center;
  width: 100%;

  &&& {
    padding: 0;
  }
  h2 {
    ${headingTwo}
    margin: 0;
  }
  h2.success-msg {
    margin-bottom: 20px;
  }
  p {
    ${paragraphReg}
    text-align: left;
    margin: 0;
  }
  .min-char {
    ${paragraphReg}
    font-size: 0.6875rem;
    margin: 4px 0 0;
  }

  div[class^='MuiFormControl-root'],
  div[class*='MuiFormControl-root'] {
    width: 100%;
  }
`;

const StyledLoginActions = styled(CardActions)`
  ${displayFlex}
  flex-direction: column;
  align-self: center;
  width: 100%;
  &&& {
    padding: 8px 0px 0px;
  }
`;

const SubmitButton = styled(Button)`
  &&& {
    width: 100%;
    margin: 20px auto 0px;
    height: auto;
  }
`;

const StyledLink = styled(Link)`
  ${paragraphReg}
  color: ${colors.white};
  background-color: ${colors.button.primary.active}
  box-shadow: 0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12);
  align-self: flex-end;
  font-size: 0.9375rem;
  line-height: 17px;
  letter-spacing: 1px;
  text-decoration: none;
  border-radius: 3px;
  width: 100%;
  margin: 20px 0 0;
  padding: 12px 0;
  transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    &&&:hover {
      box-shadow: 0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);
    }
`;

// eslint-disable-next-line prettier/prettier
export default compose(withRouter, withResetPassword)(ResetPassword);
