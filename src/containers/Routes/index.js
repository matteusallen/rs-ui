import React from 'react';
import { Route, Switch } from 'react-router-dom';

import ROUTES from 'Constants/routes';
import App from '../App';
import Login from 'Pages/Login';
import SignUp from 'Pages/SignUp/SignUp';
import ForgotPassword from 'Pages/ForgotPassword';
import ResetPassword from 'Pages/ResetPassword';
import Terms from 'Pages/Terms';
import Privacy from 'Pages/Privacy';
import EndUser from 'Pages/EndUser';
import RenterHome from '../Home/Renter';
import AdminHome from '../Home/Admin';
import SuperAdminHome from '../Home/SuperAdmin';
import OpsHome from '../Home/Ops';
import GroupLeaderHome from '../Home/GroupLeader';
import CreatePassword from 'Pages/CreatePassword';
import { LandingPage } from 'Pages/LandingPage';

//The order of the routes is important as Renter is only on the base route
const Routes = () => (
  <App>
    <Switch>
      <Route exact path={ROUTES.ROOT} component={LandingPage} />
      <Route exact path={ROUTES.LOGIN} component={Login} />
      <Route exact path={ROUTES.CREATE_ACCOUNT} component={SignUp} />
      <Route exact path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} />
      <Route exact path={ROUTES.RESET_PASSWORD} component={ResetPassword} />
      <Route exact path={ROUTES.CREATE_PASSWORD} component={CreatePassword} />
      <Route exact path={ROUTES.TERMS} component={Terms} />
      <Route exact path={ROUTES.PRIVACY} component={Privacy} />
      <Route exact path={ROUTES.ENDUSER} component={EndUser} />
      <Route path={`${ROUTES.ADMIN}`} component={AdminHome} />
      <Route path={`${ROUTES.SUPER_ADMIN}`} component={SuperAdminHome} />
      <Route path={`${ROUTES.OPS}`} component={OpsHome} />
      <Route path={`${ROUTES.GROUP_LEADER}`} component={GroupLeaderHome} />
      <Route path={`${ROUTES.ROOT}`} component={RenterHome} />
    </Switch>
  </App>
);

export default Routes;
