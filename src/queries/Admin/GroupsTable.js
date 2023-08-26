import gql from 'graphql-tag';

export const GROUPS_TABLE = gql`
  query GetAdminGroups {
    groups {
      id
      contactName
      name
    }
  }
`;
