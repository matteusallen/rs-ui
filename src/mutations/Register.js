// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import { compose } from 'recompose';

export type RegisterUserInputType = {|
  email: string,
  password: string
|};

const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      userId
      error
    }
  }
`;

const withRegister = graphql(REGISTER, {
  props: ({ mutate }) => ({
    registerUser: (input: RegisterUserInputType) => {
      return mutate({
        variables: { input }
      });
    }
  }),
  options: () => ({
    onCompleted: async result => {
      if (!result.register.error) {
        /** @todo we need  to fire a toast success message */
        return result.register;
      }
      // eslint-disable-next-line
      console.error(result.register.error);
      /** @todo gracefully handle error */
      return result.register.error;
    },
    onError: error => {
      // eslint-disable-next-line
      console.error(error);
      /** @todo gracefully handle error */
      return error;
    }
  })
});

// eslint-disable-next-line prettier/prettier
export default compose(withRouter, withRegister);
