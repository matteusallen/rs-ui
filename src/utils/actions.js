// @flow
import { useContext } from 'react';
import type { UserContextType } from '../store/UserContextType';
import { UserContext } from '../store/UserContext';

export const ACTION_NOT_ALLOWED = false;
export const ACTION_ALLOWED = true;

export const useValidateAction = (path, action) => {
  const { user } = useContext<UserContextType>(UserContext);

  if (!user.unallowedActions[path]) {
    return ACTION_ALLOWED;
  }

  if (!user.unallowedActions) throw Error('Unauthorized user!');

  if (user.unallowedActions[path].includes(action)) {
    return ACTION_NOT_ALLOWED;
  }

  return ACTION_ALLOWED;
};
