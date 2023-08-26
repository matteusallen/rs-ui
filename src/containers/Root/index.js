// @flow
import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';

import { MuiThemeProvider } from '@material-ui/core/styles';

import { UserProvider } from 'Store/UserContext';
import { SnackbarProvider } from 'Store/SnackbarContext';
import { UserRoleProvider } from 'Store/UserRoleContext';

import client from 'Lib/api';
import Routes from '../Routes';
// $FlowIgnore
import 'Assets/styles/app.scss';

import os_theme from 'Styles/Themes';

const Root = () => (
  <BrowserRouter>
    <ApolloProvider client={client}>
      <SnackbarProvider>
        <UserProvider>
          <UserRoleProvider>
            <MuiThemeProvider theme={os_theme}>
              <Routes />
            </MuiThemeProvider>
          </UserRoleProvider>
        </UserProvider>
      </SnackbarProvider>
    </ApolloProvider>
  </BrowserRouter>
);

export default Root;
