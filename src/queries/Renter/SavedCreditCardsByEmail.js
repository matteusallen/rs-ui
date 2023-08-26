import gql from 'graphql-tag';

export const SAVED_CREDIT_CARDS_FROM_EMAIL = gql`
  query LocalUserFromToken($email: String, $venueId: String) {
    user(email: $email, venueId: $venueId) {
      payload {
        savedCreditCards {
          id
          last4
          fingerprint
          name
          country
        }
      }
      error
    }
  }
`;
