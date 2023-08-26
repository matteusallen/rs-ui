// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@material-ui/core';
import styled from 'styled-components';
import { paragraphReg } from '../../styles/Typography';
import { displayFlex } from '../../styles/Mixins';
import colors from '../../styles/Colors';

type RegisterFormTermsPropsType = {|
  // eslint-disable-next-line
  checked?: string | boolean,
  onChange: (e: SyntheticEvent<HTMLInputElement>) => void
|};

const RegisterFormTerms = (props: RegisterFormTermsPropsType) => {
  return (
    <StyledTerms>
      <p>
        <CheckboxBase disableRipple onChange={props.onChange} data-testid="privacy-checkbox" />
      </p>
      <p>
        I have read and accept the
        <StyledLink to="/terms" target={'_blank'}>
          {`  Terms of Use`}
        </StyledLink>
        ,
        <StyledLink to="/privacy" target={'_blank'}>
          {` Privacy Policy `}
        </StyledLink>
        {` and`}
        <StyledLink to="/end-user-agreement" target={'_blank'}>
          {` End User Agreement`}
        </StyledLink>
      </p>
    </StyledTerms>
  );
};

const StyledTerms = styled.div`
  ${displayFlex}
  ${paragraphReg}
  align-items: center;
  span {
    padding: 0 8px 1px 0;
  }
  p:nth-child(2) {
    text-align: left;
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
`;

const CheckboxBase = styled(Checkbox)`
  &&& {
    color: ${colors.text.link};
  }
  &&&:active {
    background: none;
  }
  &&&:hover {
    background: none;
  }
`;

export default RegisterFormTerms;
