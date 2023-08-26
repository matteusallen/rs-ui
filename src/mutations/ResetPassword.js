// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type ResetPasswordInputType = {|
  password: string,
  resetPasswordToken: string
|};

type ResetPasswordPayloadType = {|
  data: {|
    resetPassword: {|
      error: ?string,
      success: boolean
    |}
  |}
|};

const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      error
    }
  }
`;

export const withResetPassword = graphql(RESET_PASSWORD, {
  props: ({ mutate }) => ({
    resetPassword: (input: ResetPasswordInputType): ResetPasswordPayloadType => mutate({ variables: { input } })
  }),
  options: () => ({
    onCompleted: async data => {
      return data;
    }
  })
});

export default withResetPassword;
