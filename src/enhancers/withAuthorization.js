// @flow
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import { compose } from 'recompose';
import _get from 'lodash.get';
import styled from 'styled-components';

import IndeterminateLoading from '../components/Loading/IndeterminateLoading';
import { LOCAL_USER_FROM_TOKEN } from '../queries/LocalUserFromToken';

import USER_ROLES from '../constants/userRoles';

import ROUTES, { subRouteCodes as SUBROUTES } from '../constants/routes';

import Auth from '../lib/auth';
import { withUserContext } from '../store/UserContext';
import { withLogout } from '../mutations/Logout';

type UserType = {|
  email: string,
  id: number,
  role: {
    id: string,
    name: string
  }
|};

type WithAuthorizationPropsType = {|
  client: {
    query: (options: { query: string, variables: { token: string } }) => null
  },
  history: {|
    push: (path: string) => null
  |},
  location: {|
    pathname: string
  |},
  logoutUser: () => null,
  onLogin: (user: UserType) => null,
  rejectRoute: (route: string) => void,
  user: ?UserType
|};

export const withAuthorization = (ComposedComponent: React$AbstractComponent<{}, {}>) => {
  class WithAuthorization extends Component<WithAuthorizationPropsType, { proceed: boolean }> {
    state = {
      proceed: false
    };

    componentDidMount() {
      this.isAuthenticated();
    }

    shouldComponentUpdate(nextProps: WithAuthorizationPropsType): boolean {
      if (!this.props.user && nextProps.user) {
        this.isAuthenticated();
        return true;
      }
      if (this.props.user && !nextProps.user) {
        this.isAuthenticated();
        return true;
      }
      if (this.props.user && nextProps.user && this.props.user.role !== nextProps.user.role) {
        this.isAuthenticated();
        return true;
      }
      return true;
    }

    checkIfRenterRoute = () => {
      const { location } = this.props;
      let matches = false;
      Object.keys(SUBROUTES.RENTER).forEach(key => {
        if (location.pathname === SUBROUTES.RENTER[key]) matches = true;
      });
      return matches;
    };

    isAuthenticated = () => {
      const token = Auth.getToken();
      const { history, user, location } = this.props;
      if (!token && (location.pathname.startsWith(ROUTES.OPS) || location.pathname.startsWith(ROUTES.ADMIN) || this.checkIfRenterRoute())) {
        this.props.rejectRoute(location.pathname);
        history.push(ROUTES.LOGIN);
        return this.proceed();
      }
      if (!token) {
        return this.proceed();
      }
      if (!user) return this.getUserWithToken(token);
      return this.isAuthorized();
    };

    getUserWithToken = async (token: string) => {
      const { client, onLogin } = this.props;
      const queryPayload = {
        query: LOCAL_USER_FROM_TOKEN,
        variables: { token }
      };
      // $FlowIgnore
      await client.query(queryPayload).then(async ({ data }) => {
        return onLogin(data.user.payload);
      });
      return this.isAuthorized();
    };
    isAuthorized = async () => {
      const { location, history, user } = this.props;
      const userRoleName = _get(user, 'role.name', '').toLowerCase();
      // remove token and redirect to login if no user
      if (!user) {
        Auth.clearToken();
        this.props.rejectRoute(location.pathname);
        history.push(ROUTES.ROOT);
        return this.proceed();
      }
      // redirect to / if user.role === renter && location begins with /ops || /admin
      if (userRoleName === USER_ROLES.RENTER && (location.pathname.startsWith(ROUTES.OPS) || location.pathname.startsWith(ROUTES.ADMIN))) {
        history.push(ROUTES.ROOT);
        return this.proceed();
      }
      // redirect to /ops if user.role === ops && location does not begin with /ops
      if (userRoleName === USER_ROLES.OPS && !location.pathname.startsWith(ROUTES.OPS)) {
        history.push(ROUTES.OPS);
        return this.proceed();
      }

      if (userRoleName === USER_ROLES.GROUP_LEADER && !location.pathname.startsWith(ROUTES.GROUP_LEADER)) {
        history.push(ROUTES.GROUP_LEADER);
        return this.proceed();
      }

      // redirect to /admin if user.role === venue admin OR reservation admin
      // && location does not begin with /admin
      if ((userRoleName === USER_ROLES.VENUE_ADMIN || userRoleName === USER_ROLES.RESERVATION_ADMIN) && !location.pathname.startsWith(ROUTES.ADMIN)) {
        history.push(ROUTES.ADMIN);
        return this.proceed();
      }
      if (userRoleName === USER_ROLES.SUPER_ADMIN && !location.pathname.startsWith(ROUTES.SUPER_ADMIN)) {
        history.push(ROUTES.SUPER_ADMIN);
        return this.proceed();
      }
      return this.proceed();
    };
    proceed = () => this.setState({ proceed: true });

    onError = async () => {
      await this.props.logoutUser();
      return this.isAuthenticated();
    };

    render() {
      const { proceed } = this.state;
      const Component = proceed ? (
        <ComposedComponent onError={this.onError} {...this.props} />
      ) : (
        <FlexWrapper>
          <IndeterminateLoading />
        </FlexWrapper>
      );
      return <>{Component}</>;
    }
  }

  return WithAuthorization;
};

const FlexWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default compose(withApollo, withRouter, withUserContext, withAuthorization, withLogout);
