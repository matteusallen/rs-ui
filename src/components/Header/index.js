// @flow
import React from 'react';
// import { Link } from 'react-router-dom'
import { withRouter } from 'react-router';
import styled from 'styled-components';

import Logout from '../../containers/Logout';
import { displayFlex } from '../../styles/Mixins';

const Header = () => (
  <header data-testid="logged-in-header">
    {/* <Link to="/">Home</Link>
    <Link to="/about">About</Link> */}
    <StyledDiv>
      <Logout />
    </StyledDiv>
  </header>
);

const StyledDiv = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: center;
  align-self: center;
`;

export default withRouter(Header);
