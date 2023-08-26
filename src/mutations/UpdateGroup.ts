import gql from 'graphql-tag';

export type UpdateGroupReturnType = {
  id: string | number;
  success: boolean;
  error: string;
};

const UPDATE_GROUP = gql`
  mutation UpdateGroup($input: UpdateGroupInput!) {
    updateGroup(input: $input) {
      group {
        id
      }
    }
  }
`;

export default UPDATE_GROUP;
