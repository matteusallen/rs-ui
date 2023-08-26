import React from 'react';
import './SignUp.scss';

import SignUpHero from 'Pages/SignUp/SignUpHero/SignUpHero';
import SignUpForm from 'Pages/SignUp/SignUpForm/SignUpForm';

const SignUp: React.FC<any> = () => (
  <div className="sign-up-page">
    <SignUpHero />
    <SignUpForm />
  </div>
);

export default SignUp;
