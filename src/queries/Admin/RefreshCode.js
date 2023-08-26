import gql from 'graphql-tag';

export const REFRESH_CODE_BY_ID = gql`
  mutation refreshCodeById($id: ID) {
    refreshCode(id: $id)
  }
`;
