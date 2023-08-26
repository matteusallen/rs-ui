import gql from 'graphql-tag';

export const GET_DEFERRABLE_GROUPS = gql`
  query GetDeferrableGroups {
    groups(allowDeferred: true) {
      id
      name
    }
  }
`;
