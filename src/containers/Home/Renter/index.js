// @flow
import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import type { RouteComponentProps } from 'react-router-dom';

import { withUserContext } from '../../../store/UserContext';
import { RENTER_HOME_ACCESS } from '../../../constants/authRules';

import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import RenterNavigation from '../../Navigation/RenterNavigation';
import RenterEvents from '../../../pages/RenterEvents';
import RenterReservations from '../../../pages/RenterReservations/RenterReservations';
import RenterHelp from '../../../pages/RenterHelp/RenterHelp';
import RenterCreateReservation from '../../../pages/RenterCreateReservation';
import RenterConfirmReservation from '../../../pages/RenterConfirmReservation';
import ContextSnackbar from '../../../components/Snackbar';
import Can from '../../../components/Can';

const RenterHome = (props: RouteComponentProps) => {
  useEffect(() => {
    if (props.location.pathname === ROUTES.ROOT) {
      props.history.push(SUB_ROUTES.RENTER.EVENTS);
    }
  });
  return (
    <Can
      perform={RENTER_HOME_ACCESS}
      yes={() => (
        <section>
          <RenterNavigation>
            <Switch>
              <Route exact path={SUB_ROUTES.RENTER.EVENTS} component={RenterEvents} />
              <Route exact path={SUB_ROUTES.RENTER.RESERVATIONS} component={RenterReservations} />
              <Route exact path={SUB_ROUTES.RENTER.HELP} component={RenterHelp} />
              <Route exact path={SUB_ROUTES.RENTER.VIEW_RESERVATION} component={RenterConfirmReservation} />
              <Route exact path={SUB_ROUTES.RENTER.CREATE_ORDER} component={RenterCreateReservation} />
              <Route exact path={SUB_ROUTES.RENTER.CONFIRM_RESERVATION} component={RenterConfirmReservation} />
            </Switch>
          </RenterNavigation>
          <ContextSnackbar />
        </section>
      )}
      no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
    />
  );
};

// prettier-ignore
export default compose(withRouter, withUserContext)(RenterHome)
