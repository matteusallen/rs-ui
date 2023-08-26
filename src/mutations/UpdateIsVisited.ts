import gql from 'graphql-tag';

export type UpdateIsVisitedReturnType = {
  success: boolean;
};

const UPDATE_ISVISITED = gql`
  mutation setIsVisited($id: ID!) {
    setIsVisited(id: $id)
  }
`;

export default UPDATE_ISVISITED;
