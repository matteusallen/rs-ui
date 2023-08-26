// @flow
import gql from 'graphql-tag';

export const VALIDATE_CODE = gql`
  mutation validateCode($input: GroupCodeValidationInput) {
    group: validateCode(input: $input) {
      id
      name
    }
  }
`;
