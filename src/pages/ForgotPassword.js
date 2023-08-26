// @flow
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Grid, Card, CardContent, TextField, CardActions } from '@material-ui/core';
import styled from 'styled-components';
import { compose } from 'recompose';
import { isEmail, isEmpty } from 'validator';
import { useMutation } from 'react-apollo';
import type { RouteComponentProps } from 'react-router-dom';
import Error from '../components/Alerts/Error';
import Button from '../components/Button';
import RodeoLogo from '../assets/img/rodeo-logistics-logo-dark.png';
import OpenStallsLogo from '../assets/img/open-stalls-black.png';
import { displayFlex } from '../styles/Mixins';
import { headingTwo, paragraphReg } from '../styles/Typography';
import colors from '../styles/Colors';
import { FORGOT_PASSWORD } from '../mutations/ForgotPassword';
import type { ForgotPasswordInputType, ForgotPasswordReturnType } from '../mutations/ForgotPassword';

const ForgotPassword = (props: RouteComponentProps) => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [submitButtonTouched, setSubmitButtonTouched] = useState(false);
  const [forgotPassword, { data, loading, error }] = useMutation<ForgotPasswordReturnType, ForgotPasswordInputType>(FORGOT_PASSWORD);

  if (loading) {
    if (!isBusy) setIsBusy(true);
  }

  useEffect(() => {
    if (error) {
      // API will not return failures, but something else may have gone wrong.
      setIsBusy(false);
      setSuccess(false);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setIsBusy(false);
      setSuccess(true);
    }
  }, [data]);

  const trimmedEmail = email ? email.trim() : '';
  const validEmail = isEmail(trimmedEmail);
  let errorLegend = null;
  if (!validEmail) {
    errorLegend = 'PLEASE ENTER A VALID EMAIL ADDRESS';
  }
  if (isEmpty(trimmedEmail)) {
    errorLegend = 'PLEASE ENTER AN EMAIL ADDRESS';
  }

  const handleSubmit = useCallback(async () => {
    if (validEmail) {
      const input: ForgotPasswordInputType = { email };
      forgotPassword({ variables: { input } });
    } else {
      setSubmitButtonTouched(true);
    }
  });

  const expiredMessage = useMemo(() => {
    return <Error className="forgot-password" label="The link you clicked has expired. You can request a new reset password below." />;
  });

  const successMessage = useMemo(() => (
    <SuccessCard>
      <Card>
        <div className={'wrapper'}>
          <h2>REQUEST SUBMITTED</h2>
          <p>If there is an account matching this email address, you will receive a password link via email. Please check your email inbox.</p>
        </div>
      </Card>
    </SuccessCard>
  ));

  const failureMessage = useMemo(() => (
    <StyledLoginCard>
      <h2>UNEXPECTED ERROR</h2>
      <p>Something went wrong. Please try again</p>
    </StyledLoginCard>
  ));

  return (
    <GridBase container>
      <Grid className="card--container" item xs={12} md={2} />
      <Grid className="card--container" item xs={12} md={8}>
        <ForgotPasswordOutter>
          <img className="open-stalls-logo" src={OpenStallsLogo} alt={'Open Stalls Logo'} />
          <img className="rodeo-logistics-logo" src={RodeoLogo} alt="Rodeo Logistics Logo" />
          {!success && !error && props.location.search.match(/expired=true/g) && expiredMessage}
          {!isBusy && error && failureMessage}
          {success ? (
            successMessage
          ) : (
            <LoginCardWrapper>
              <StyledLoginCard>
                <h2>FORGOT PASSWORD</h2>
                <p>Enter the email address associated with your account and we’ll send you a link to reset your password.</p>
                <Field
                  data-testid="emailInput"
                  label="Email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  variant="filled"
                  value={email || ''}
                  onChange={event => setEmail(event.target.value)}
                  helperText={submitButtonTouched && !validEmail && errorLegend}
                  error={submitButtonTouched && !validEmail}
                />
                <StyledLoginActions>
                  <SubmitButton primary variant="contained" size="large" onClick={handleSubmit} disabled={isBusy}>
                    SUBMIT
                  </SubmitButton>
                </StyledLoginActions>
              </StyledLoginCard>
            </LoginCardWrapper>
          )}
          <StyledLink to="/login">BACK TO SIGN IN</StyledLink>
        </ForgotPasswordOutter>
      </Grid>
      <Grid className="card--container" item xs={12} md={2} />
    </GridBase>
  );
};

const GridBase = styled(Grid)`
  &&& {
    max-width: 100%;
    overflow-x: hidden;
  }
`;

const ForgotPasswordOutter = styled.div`
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
  margin-bottom: 24px;
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
  align-items: flex-start;
  max-width: 375px;
  h2 {
    ${headingTwo}
    margin: 0;
  }
  p {
    ${paragraphReg}
    text-align: left;
  }
`;

const Field = styled(TextField)`
  &&& {
    width: 100%;

    .MuiFormHelperText-root {
      font-size: 0.6875rem;
    }
  }
`;

const StyledLoginActions = styled(CardActions)`
  ${displayFlex}
  flex-direction: column;
  align-self: center;
  width: 100%;
  &&& {
    padding: 8px 0px;
  }
`;

const SubmitButton = styled(Button)`
  &&& {
    width: 100%;
    margin: 20px auto 25px;
    height: auto;
  }
`;

const StyledLink = styled(Link)`
  ${paragraphReg}
  color: ${colors.text.link};
  font-size: 0.9375rem;
  line-height: 17px;
  letter-spacing: 1px;
  text-decoration: none;
`;

const SuccessCard = styled.div`
  width: 100%;
  max-width: 385px;
  margin-bottom: 25px;

  h2 {
    color: ${colors.text.primary};
    font-family: 'IBMPlexSans-SemiBold';
    font-size: 30px;
    letter-spacing: 0.91px;
    line-height: 50px;
    margin: 0;
  }

  .wrapper {
    margin: 15px 25px 25px;
  }

  p {
    color: ${colors.text.primary};
    font-family: 'IBMPlexSans-Regular';
    font-size: 16px;
    letter-spacing: 0;
    line-height: 25px;
  }
`;

// eslint-disable-next-line prettier/prettier
export default compose(withRouter)(ForgotPassword);
