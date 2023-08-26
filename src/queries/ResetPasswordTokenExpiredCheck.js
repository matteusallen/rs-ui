import gql from 'graphql-tag';

export const RESET_PASSWORD_TOKEN_EXPIRED_CHECK = gql`
  query($token: String) {
    checkResetPasswordTokenExpired(token: $token) {
      error
      expired
    }
  }
`;
