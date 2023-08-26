// @flow
import gql from 'graphql-tag';
import { graphql, withApollo } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import ROUTES from '../constants/routes';

import { withUserContext } from '../store/UserContext';
import { FAKE_TOKEN } from './__mocks__/LOGOUT_MOCK';

import Auth from '../lib/auth';
import { isTestEnv } from '../lib/testing-tools';

export const LOGOUT = gql`
  mutation LogOut($input: LogoutInput) {
    logOut(input: $input) {
      error
      success
    }
  }
`;

export const withLogout = graphql(LOGOUT, {
  props: ({ mutate }) => ({
    logoutUser: () => {
      const token = isTestEnv() ? FAKE_TOKEN : Auth.getToken();
      return mutate({
        variables: { input: { token } }
      });
    }
  }),
  options: props => ({
    onCompleted: async () => {
      try {
        props.history.push(ROUTES.ROOT);
        await Auth.clearToken();
        await props.onLogout();
        props.client.clearStore();
        props.history.push(ROUTES.ROOT);
      } catch (e) {
        props.history.push(ROUTES.ROOT);
        await Auth.clearToken();
        props.history.push(ROUTES.ROOT);
      }
    }
  })
});

// prettier-ignore
export default compose(withApollo, withRouter, withUserContext, withLogout)
