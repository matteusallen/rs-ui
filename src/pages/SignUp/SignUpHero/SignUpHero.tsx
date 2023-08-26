import React from 'react';
import OpenStallsLogo from 'Assets/img/open-stalls-white.png';
import RodeoLogo from 'Assets/img/rodeo-logistics-logo-white.png';
import { LOGIN_REGISTER_DESCRIPTION } from 'Constants/names';
import './SignUpHero.scss';

/**
 * NOTE: The original shared FormHero.js component is used in CreatePassword and Login "containers" as well.
 * TODO: Check with Stephanie if this component will be reused.
 */
const SignUpHero: React.FC<any> = () => {
  return (
    <div className="sign-up-hero">
      <img className="open-stalls-logo" src={OpenStallsLogo} alt="Open Stalls Logo" />
      <img className="rodeo-logo" src={RodeoLogo} alt="Rodeo Logistics Logo" />
      <p>{LOGIN_REGISTER_DESCRIPTION}</p>
    </div>
  );
};

export default SignUpHero;
