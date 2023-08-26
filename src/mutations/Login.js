// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { withUserContext } from 'Store/UserContext';
import Auth from '../lib/auth';

import { subRouteCodes as SUB_ROUTES } from 'Constants/routes';

export type LoginUserInputType = {|
  email: string,
  password: string
|};

export const LOGIN = gql`
  mutation Login($input: LoginInput) {
    logIn(input: $input) {
      user {
        id
        email
        role {
          id
          name
        }
        unallowedActions {
          groups
          orders
        }
      }
      auth {
        token
        error
        success
      }
    }
  }
`;

export const withLogin = graphql(LOGIN, {
  props: ({ mutate }) => ({
    loginUser: (input: LoginUserInputType) => {
      return mutate({
        variables: { input }
      });
    }
  }),
  options: props => ({
    onCompleted: async ({ logIn: result }) => {
      sessionStorage.removeItem('filters');
      sessionStorage.removeItem('reservationsOrder');
      if (result.auth.token) {
        Auth.setToken(result.auth.token);
        await props.onLogin(result.user);
        props.getLastRejectedUrl(
          route => props.history.push(route),
          () => {
            if (Number(result.user.role.id) === 3) {
              props.history.push(SUB_ROUTES.RENTER.EVENTS);
            }
          }
        );
      }
    }
  })
});

// prettier-ignore
export default compose(withRouter, withUserContext, withLogin)
