import gql from 'graphql-tag';

export const GROUP_BY_ID = gql`
  query getGroupById($id: ID) {
    group(id: $id) {
      id
      contactName
      name
      phone
      email
      allowDeferred
      orders {
        orderId
      }
      groupLeaderId
      code
    }
  }
`;
