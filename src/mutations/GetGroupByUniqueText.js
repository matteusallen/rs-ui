// @flow
import gql from 'graphql-tag';

export const GROUP_BY_UNIQUE_TEXT = gql`
  mutation validateCode($input: GroupByUniqueTextInput) {
    group: groupUniqueText(input: $input) {
      id
      name
      code
    }
  }
`;
