import gql from 'graphql-tag';

export const USERS_BY_EMAIL_FOR_CREATE_ORDER = gql`
  query UsersByEmailForCreateOrder($orderBy: [String], $filterBy: UserFilterInput, $limit: Int) {
    users(orderBy: $orderBy, filterBy: $filterBy, limit: $limit) {
      id
      email
      firstName
      lastName
      phone
      savedCreditCards {
        id
        last4
        fingerprint
        brand
        name
        country
      }
    }
  }
`;
