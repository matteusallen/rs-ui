import gql from 'graphql-tag';

export type CreateGroupReturnType = {
  id: string | number;
  success: boolean;
  error: string;
};

const CREATE_GROUP = gql`
  mutation CreateGroup($input: GroupUpsertInput!) {
    createGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default CREATE_GROUP;
