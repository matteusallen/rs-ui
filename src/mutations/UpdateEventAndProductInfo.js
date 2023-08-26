// @flow
import gql from 'graphql-tag';

export const UPDATE_EVENT_AND_PRODUCT_INFO = gql`
  mutation updateEventAndProductInfo($input: EventAndProductUpdateInput) {
    updateEventAndProductInfo(input: $input) {
      success
      error
    }
  }
`;
