// @flow
import { useLocation } from 'react-router';

import authRules from '../../constants/authRules';

import { withUserContext } from '../../store/UserContext';
import type { UserType } from '../../pages/Admin/Users';

type CanPropsType = {|
  data: {},
  ignoreRoute: boolean,
  no: () => void,
  perform: string,
  rejectRoute: (route: string) => void,
  role: string | number,
  user: UserType,
  yes: () => void
|};

export const check = (role: string | number | null, action: string) => {
  const permissions = authRules[role];
  if (!permissions) {
    return false;
  }

  const staticPermissions = permissions.static;
  if (staticPermissions && staticPermissions.includes(action)) {
    return true;
  }

  return false;
};

const Can = (props: CanPropsType) => {
  const userId = props.user ? props.user.role.id : null;
  const { pathname } = useLocation();
  if (check(userId, props.perform)) {
    return props.yes();
  }
  if (!props.ignoreRoute) {
    props.rejectRoute(pathname);
  }
  return props.no();
};

Can.defaultProps = {
  yes: () => null,
  no: () => null,
  user: null,
  ignoreRoute: false
};

export default withUserContext(Can);
