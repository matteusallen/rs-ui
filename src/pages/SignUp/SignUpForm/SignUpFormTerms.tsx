import React, { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@material-ui/core';

interface ISignUpTermsProps {
  setTermsAndConditionsChecked: Function;
}

const SignUpFormTerms: React.FC<ISignUpTermsProps> = ({ setTermsAndConditionsChecked }) => {
  const checkboxOnChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTermsAndConditionsChecked(e.target.checked);
  };

  return (
    <p className="terms-text">
      <span>
        <Checkbox
          color="primary"
          inputProps={{ 'aria-label': 'terms and conditions checkbox' }}
          data-testid="terms-and-conditions-checkbox"
          onChange={checkboxOnChangeHandler}
        />
      </span>
      <span>
        {' I have read and accept the'}
        <Link to="/terms" target="_blank">
          {' Terms of Use'}
        </Link>
        ,
        <Link to="/privacy" target={'_blank'}>
          {' Privacy Policy '}
        </Link>
        and
        <Link to="/end-user-agreement" target={'_blank'}>
          {' End User Agreement'}
        </Link>
      </span>
    </p>
  );
};

export default SignUpFormTerms;
