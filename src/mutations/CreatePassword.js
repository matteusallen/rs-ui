//@flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type CreatePasswordInputType = {|
  password: string,
  token: string
|};

export type CreatePasswordReturnType = {|
  data: {|
    createPassword: {|
      error: ?string,
      success: boolean
    |}
  |}
|};

const CREATE_PASSWORD = gql`
  mutation CreatePassword($input: CreatePasswordInputType!) {
    createPassword(input: $input) {
      success
      error
    }
  }
`;

const withCreatePassword = graphql(CREATE_PASSWORD, {
  props: ({ mutate }) => ({
    createPassword: (input: CreatePasswordInputType): CreatePasswordReturnType =>
      mutate({
        variables: { input }
      })
  }),
  options: () => ({
    onCompleted: result => result,
    onError: error => error
  })
});

export default withCreatePassword;
