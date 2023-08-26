// @flow
import React from 'react';
import Card from '@material-ui/core/Card';
import styled from 'styled-components';

import type { CardProps } from '@material-ui/core';

import FormHero from '../../components/Forms/FormHero';
import LoginForm from './LoginForm';
import { displayFlex, BIG_TABLET_WIDTH } from '../../styles/Mixins';
import { APP_NAME, LOGIN_REGISTER_DESCRIPTION } from '../../constants/names';

const LoginFormCard = (props: CardProps) => (
  <FormCardWrapper className={`${String(props.className)}__login-card`}>
    <FormHero headline={APP_NAME} description={LOGIN_REGISTER_DESCRIPTION} />
    <LoginForm />
  </FormCardWrapper>
);

const FormCardWrapper = styled(Card)`
  ${displayFlex}
  flex-direction: column;
  height: auto;
  &&& {
    box-shadow: 0 2px 5px 0 rgba(17, 24, 31, 0.3), 0 2px 10px 0 rgba(17, 24, 31, 0.1);
    border-radius: 0;
  }

  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    ${displayFlex}
    flex-direction: row;
    width: 100vw;
    max-width: 793px;
    height: 665px;
    left: 50%;
    top: 50%;
    position: absolute;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
  }
`;

export default LoginFormCard;
