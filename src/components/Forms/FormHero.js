import React, { Fragment } from 'react';
import styled from 'styled-components';

import Image from 'Assets/img/horse-in-stall.jpeg';
import OpenStallsLogo from 'Assets/img/open-stalls-white.png';
import RodeoLogo from 'Assets/img/rodeo-logistics-logo-white.png';
import { paragraphReg } from 'Styles/Typography';

const FormHero = props => {
  return (
    <Fragment>
      <StyledDiv className="login-header--background">
        <img className="open-stalls-logo" src={OpenStallsLogo} alt="Open Stalls Logo" />
        <img className="rodeo-logo" src={RodeoLogo} alt="Rodeo Logistics Logo" />
        <p>{props.description}</p>
      </StyledDiv>
    </Fragment>
  );
};

const StyledDiv = styled.div`
  background-image: url(${Image});
  background-color: gray;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: top center;
  box-shadow: inset 0 0 0 2000px rgba(0.07, 0.09, 0.12, 0.5);
  color: transparent;
  height: 250px;
  box-sizing: border-box;
  @include display-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1;

  .open-stalls-logo {
    display: block;
    width: 235px;
    padding: 25px 0 10px 0;
    height: 50px;
    margin: auto;
  }
  .rodeo-logo {
    width: 254px;
    height: 37px;
    margin-bottom: 8px;
  }
  p {
    ${paragraphReg}
    width: 40%;
    margin: 0 auto;
    color: #fff;
    margin-bottom: 25px;
  }

  @media screen and (min-width: 600px) {
    background-image: url(${Image});
    background-color: gray;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center 40%;
    box-shadow: inset 0 0 0 2000px rgba(0.07, 0.09, 0.12, 0.5);
  }

  @media screen and (min-width: 960px) {
    background-image: url(${Image});
    background-color: gray;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 60% center;
    color: transparent;
    height: 100%;
    box-sizing: border-box;
    @include display-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-top: 225px;

    .rodeo-logo {
      margin-bottom: 25px;
    }

    .open-stalls-logo {
      width: 280px;
      height: 65px;
    }

    p {
      width: 70%;
    }
  }
`;

export default FormHero;
