// @flow
import React from 'react';
import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { paragraphReg } from '../../styles/Typography';
import { displayFlex } from '../../styles/Mixins';
import colors from '../../styles/Colors';

const LoginFormTerms = () => {
  return (
    <StyledTerms>
      <p>
        By signing in, I agree to the
        <StyledLink to="/terms" target={'_blank'} id="">
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

  p {
    text-align: left;
  }

  span {
    padding: 0 8px 0 0;
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

export default LoginFormTerms;
