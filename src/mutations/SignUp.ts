import gql from 'graphql-tag';

export type SignUpInputType = {
  email: string;
  password: string;
};

const SIGN_UP = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      userId
      error
    }
  }
`;

export default SIGN_UP;
