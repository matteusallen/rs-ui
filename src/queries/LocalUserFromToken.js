import gql from 'graphql-tag';

export const LOCAL_USER_FROM_TOKEN = gql`
  query LocalUserFromToken($token: String) {
    user(token: $token) {
      payload {
        id
        email
        role {
          id
          name
        }
        firstName
        lastName
        phone
        savedCreditCards {
          id
          last4
          fingerprint
          name
        }
        unallowedActions {
          groups
          orders
        }
        venues {
          id
        }
      }
      error
    }
  }
`;
