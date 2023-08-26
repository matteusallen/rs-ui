// @flow
import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';

import type { RouteComponentProps } from 'react-router-dom';

import { withUserContext } from '../../../store/UserContext';
import { ADMIN_FULL_ACCESS, ADMIN_HOME_ACCESS } from '../../../constants/authRules';

import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import AdminNavigation from '../../Navigation/AdminNavigation';
import AdminOrders from '../../../pages/Admin/Orders';
import AdminUsers from '../../../pages/Admin/Users';
import AdminReports from '../../../pages/Admin/Reports/index';
import AdminGroups from '../../Tables/Admin/Groups/index';
import AdminEvents from '../../../pages/Admin/Events';
import AdminCreateEvent from '../../../pages/Admin/CreateEvent';
import AdminEditEvent from '../../../pages/Admin/EditEvent';
import AdminCreateOrder from '../../../pages/Admin/CreateOrder';
import AdminEditOrder from '../../../pages/Admin/EditOrder';
import Can from '../../../components/Can';
import OpsOperations from '../../../pages/Ops/OpsOperations';
import RVs from '../../../pages/Ops/RVs';

const AdminHome = (props: RouteComponentProps) => {
  useEffect(() => {
    if (props.location.pathname === ROUTES.ADMIN) {
      props.history.push(SUB_ROUTES.ADMIN.ORDERS);
    }
  });
  return (
    <Can
      perform={ADMIN_HOME_ACCESS}
      yes={() => (
        <section className="root-admin">
          <AdminNavigation>
            <Switch>
              <Route exact path={SUB_ROUTES.ADMIN.ORDERS} component={AdminOrders} />
              <Route exact path={SUB_ROUTES.ADMIN.CREATE_ORDER} component={AdminCreateOrder} />
              <Route exact path={SUB_ROUTES.ADMIN.EDIT_ORDER} component={AdminEditOrder} />
              <Can
                perform={ADMIN_FULL_ACCESS}
                yes={() => (
                  <>
                    <Route exact path={SUB_ROUTES.ADMIN.EVENTS} component={AdminEvents} />
                    <Route exact path={SUB_ROUTES.ADMIN.CREATE_EVENT} component={AdminCreateEvent} />
                    <Route exact path={SUB_ROUTES.ADMIN.EDIT_EVENT} component={AdminEditEvent} />
                    <Route exact path={SUB_ROUTES.ADMIN.USERS} component={AdminUsers} />
                    <Route exact path={SUB_ROUTES.ADMIN.GROUPS} component={AdminGroups} />
                    <Route exact path={SUB_ROUTES.ADMIN.REPORTS} component={AdminReports} />
                  </>
                )}
                no={() => <Redirect to={SUB_ROUTES.ADMIN.ORDERS} />}
              />
              <Route exact path={SUB_ROUTES.OPS.STALLS} component={OpsOperations} />
              <Route exact path={SUB_ROUTES.OPS.RVS} component={RVs} />
            </Switch>
          </AdminNavigation>
        </section>
      )}
      no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
    />
  );
};

// prettier-ignore
export default compose(withRouter, withUserContext)(AdminHome)
