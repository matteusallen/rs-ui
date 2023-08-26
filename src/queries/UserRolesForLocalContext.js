import gql from 'graphql-tag';

export const USER_ROLES_FOR_LOCAL_CONTEXT = gql`
  query UserRolesForLocalContext {
    userRoles {
      id
      name
    }
  }
`;
