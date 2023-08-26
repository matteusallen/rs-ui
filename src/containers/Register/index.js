import React from 'react';
import styled from 'styled-components';

import SignUpHero from 'Pages/SignUp/SignUpHero/SignUpHero';
import SignUpForm from 'Pages/SignUp/SignUpForm/SignUpForm';
// import RegisterForm from './RegisterForm';
import { displayFlex, BIG_TABLET_WIDTH } from 'Styles/Mixins';

const RegisterFormCard = props => (
  <FormWrapper className={`${props.className}__login-card`}>
    <SignUpHero />
    <SignUpForm />
    {/*<RegisterForm />*/}
  </FormWrapper>
);

const FormWrapper = styled.div`
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
    height: 100vh;
    left: 50%;
    top: 50%;
    position: absolute;
    -webkit-transform: translate3d(-50%, -50%, 0);
    -moz-transform: translate3d(-50%, -50%, 0);
    transform: translate3d(-50%, -50%, 0);
  }
`;

export default RegisterFormCard;
