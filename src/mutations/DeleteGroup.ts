import gql from 'graphql-tag';

export type DeleteGroupReturnType = {
  success: boolean;
};

const DELETE_GROUP = gql`
  mutation DeleteGroup($id: ID!) {
    deleteGroup(id: $id)
  }
`;

export default DELETE_GROUP;
