// @flow
import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import type { RouteComponentProps } from 'react-router-dom';
import { withUserContext } from '../../../store/UserContext';
import { IS_SUPER_ADMIN } from '../../../constants/authRules';
import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import SuperAdminNavigation from '../../Navigation/SuperAdminNavigation';
import Can from '../../../components/Can';
import SuperAdminVenues from '../../../pages/SuperAdmin/SuperAdminVenues';
import CreateVenue from '../../../pages/SuperAdmin/CreateVenue/CreateVenue.tsx';

const AdminHome = (props: RouteComponentProps) => {
  useEffect(() => {
    if (props.location.pathname === ROUTES.SUPER_ADMIN) {
      props.history.push(SUB_ROUTES.SUPER_ADMIN.VENUES);
    }
  });
  return (
    <Can
      perform={IS_SUPER_ADMIN}
      yes={() => (
        <section className="root-admin">
          <SuperAdminNavigation>
            <Switch>
              <Route exact path={SUB_ROUTES.SUPER_ADMIN.VENUES} component={SuperAdminVenues} />
              <Route exact path={SUB_ROUTES.SUPER_ADMIN.CREATE_VENUE} component={CreateVenue} />
            </Switch>
          </SuperAdminNavigation>
        </section>
      )}
      no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
    />
  );
};

// prettier-ignore
export default compose(withRouter, withUserContext)(AdminHome)
