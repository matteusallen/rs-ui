// @flow
import gql from 'graphql-tag';

export type ForgotPasswordReturnType = {|
  error?: string,
  success: boolean
|};

export type ForgotPasswordInputType = {|
  email: string
|};

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      error
    }
  }
`;
