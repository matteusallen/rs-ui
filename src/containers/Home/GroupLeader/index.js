// @flow
import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import type { RouteComponentProps } from 'react-router-dom';

import { withUserContext } from '../../../store/UserContext';
import { IS_GROUP_LEADER } from '../../../constants/authRules';

import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import GroupLeaderNavigation from '../../Navigation/GroupLeaderNavigation';
import AdminOrders from '../../../pages/Admin/Orders';
import AdminGroups from '../../Tables/Admin/Groups/index';
import AdminCreateOrder from '../../../pages/Admin/CreateOrder';
import AdminEditOrder from '../../../pages/Admin/EditOrder';
import Can from '../../../components/Can';

const GroupLeaderHome = (props: RouteComponentProps) => {
  useEffect(() => {
    if (props.location.pathname === ROUTES.GROUP_LEADER) {
      props.history.push(SUB_ROUTES.GROUP_LEADER.ORDERS);
    }
  });
  return (
    <Can
      perform={IS_GROUP_LEADER}
      yes={() => (
        <section>
          <GroupLeaderNavigation>
            <Switch>
              <Route exact path={SUB_ROUTES.GROUP_LEADER.ORDERS} component={AdminOrders} />
              <Route exact path={SUB_ROUTES.GROUP_LEADER.GROUPS} component={AdminGroups} />
              <Route exact path={SUB_ROUTES.GROUP_LEADER.CREATE_ORDER} component={AdminCreateOrder} />
              <Route exact path={SUB_ROUTES.GROUP_LEADER.EDIT_ORDER} component={AdminEditOrder} />
            </Switch>
          </GroupLeaderNavigation>
        </section>
      )}
      no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
    />
  );
};

// prettier-ignore
export default compose(withRouter, withUserContext)(GroupLeaderHome)
