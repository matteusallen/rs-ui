import React, { createContext, useState, useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';

import IndeterminateLoading from '../components/Loading/IndeterminateLoading';
import { USER_ROLES_FOR_LOCAL_CONTEXT } from '../queries/UserRolesForLocalContext';

const UserRoleContext = createContext();
const { Provider, Consumer } = UserRoleContext;

const UserRoleProvider = props => {
  const [userRoles, setUserRoles] = useState();
  const { data, loading } = useQuery(USER_ROLES_FOR_LOCAL_CONTEXT);

  useEffect(() => {
    if (data && data.userRoles) {
      const filteredRoles = data.userRoles.filter(role => {
        return Number(role.id) !== 5;
      });
      setUserRoles({ userRoles: filteredRoles });
      return;
    }
    setUserRoles([]);
  }, [data]);

  if (loading) {
    return (
      <FlexWrapper>
        <IndeterminateLoading />
      </FlexWrapper>
    );
  }

  return <Provider value={{ userRoles }}>{props.children}</Provider>;
};

function withUserRoleContext(ComposedComponent) {
  return function WithUserRoleContext(props) {
    return <Consumer>{contextValues => <ComposedComponent {...props} {...contextValues} />}</Consumer>;
  };
}

const FlexWrapper = styled.div`
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { UserRoleProvider, Consumer as UserRoleConsumer, UserRoleContext, withUserRoleContext };
