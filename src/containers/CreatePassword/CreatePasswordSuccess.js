//@flow
import React from 'react';
import styled from 'styled-components';

import { NavLink } from 'react-router-dom';

import { BIG_TABLET_WIDTH } from '../../styles/Mixins';
import OpenStallsLogo from '../../assets/img/open-stalls-black.png';
import RodeoLogo from '../../assets/img/rodeo-logistics-logo-dark.png';
import colors from '../../styles/Colors';

type CreatePasswordSuccessPropsType = {|
  className: string
|};

const CreatePasswordSuccessBase = (props: CreatePasswordSuccessPropsType) => {
  const { className } = props;

  return (
    <div className={`${className}__password-success-container`}>
      <div className={`${className}__password-success-header`}>
        <img className={`${className}__open-stalls-logo`} src={OpenStallsLogo} alt={'Open Stalls'} />
        <img className={`${className}__rodeo-logo`} src={RodeoLogo} alt={'Rodeo Logistics'} />
      </div>
      <div className={`${className}__password-success-info`}>
        <h2>SUCCESS!</h2>
        <p>Your account has been succesfully set up.</p>
        <p>You can now sign in with your email and password that you created.</p>
        <NavLink className={`${className}__button`} to="/login">
          GO TO SIGN IN
        </NavLink>
      </div>
    </div>
  );
};

const CreatePasswordSuccess = styled(CreatePasswordSuccessBase)`
  &__password-success-container {
    width: 90%;
    margin: 25px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__password-success-header {
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__open-stalls-logo {
    width: 80%;
  }

  &__rodeo-logo {
    width: 80%;
  }

  &__button {
    align-self: center;
    width: 95%;
    margin: 25px 0 10px 0 !important;
    color: ${colors.white} !important;
    background-color: ${colors.button.primary.active} !important;
    padding: 10px;
    border-radius: 2px;
    box-shadow: 0 2px 5px 0 rgba(17, 24, 31, 0.3), 0 2px 10px 0 rgba(17, 24, 31, 0.1);
  }

  &__password-success-info {
    background-color: ${colors.white};
    box-shadow: 0 2px 5px 0 rgba(17, 24, 31, 0.3), 0 2px 10px 0 rgba(17, 24, 31, 0.1);
    border-radius: 0;
    font-family: 'IBMPlexSans-Regular';
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px;
    margin: 20px 0 0 0;

    h2 {
      margin: 0 0 15px 0;
      font-family: 'IBMPlexSans-SemiBold';
      letter-spacing: 1px;
      font-size: 1.875rem;
    }
    p {
      align-self: flex-start;
      text-align: left;
      font-size: 15px;
      letter-spacing: 1px;
      line-height: 1.5;
      margin: 0;
    }
  }

  @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    &__password-success-container {
      width: 600px;
      margin: 150px auto;
    }
    &__password-success-header {
      width: 500px;
    }
    &__open-stalls-logo {
      width: 275px;
      margin: 0 0 15px 0;
    }
    &__rodeo-logo {
      width: 300px;
    }
    &__password-success-info {
      margin: 25px 0 0 0;
      padding: 25px;
      width: 350px;
    }
  }
`;

export default CreatePasswordSuccess;
