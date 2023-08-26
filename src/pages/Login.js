// @flow
import React from 'react';
import { withRouter } from 'react-router';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';

import LoginFormCard from '../containers/Login';

const Login = () => (
  <section>
    <GridBase container>
      <Grid className="card--container" item xs={12} md={2} />
      <Grid className="card--container" item xs={12} md={8}>
        <LoginFormCard />
      </Grid>
      <Grid className="card--container" item xs={12} md={2} />
    </GridBase>
  </section>
);

const GridBase = styled(Grid)`
  &&& {
    max-width: 100%;
    overflow-x: hidden;
  }
`;

export default withRouter(Login);
