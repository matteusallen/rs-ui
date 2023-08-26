// @flow
import React, { useEffect } from 'react';
import { compose } from 'recompose';
import { Redirect, Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import type { RouteComponentProps } from 'react-router-dom';

import { withUserContext } from '../../../store/UserContext';
import { OPS_HOME_ACCESS } from '../../../constants/authRules';

import ROUTES, { base, subRouteCodes as SUB_ROUTES } from '../../../constants/routes';
import OpsNavigation from '../../Navigation/OpsNavigation';
import OpsOperations from '../../../pages/Ops/OpsOperations';
import RVs from '../../../pages/Ops/RVs';
import Can from '../../../components/Can';

const OpsHome = (props: RouteComponentProps) => {
  useEffect(() => {
    if (props.location.pathname === ROUTES.OPS) {
      props.history.push(SUB_ROUTES.OPS.STALLS);
    }
  });
  return (
    <Can
      perform={OPS_HOME_ACCESS}
      yes={() => (
        <section>
          <OpsNavigation>
            <Switch>
              <Route exact path={SUB_ROUTES.OPS.STALLS} component={OpsOperations} />
              <Route exact path={SUB_ROUTES.OPS.RVS} component={RVs} />
            </Switch>
          </OpsNavigation>
        </section>
      )}
      no={() => <Redirect to={props.user ? base : ROUTES.LOGIN} />}
    />
  );
};

// prettier-ignore
export default compose(withRouter, withUserContext)(OpsHome)
