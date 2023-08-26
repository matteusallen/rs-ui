// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SMSByOrderIdsInputType = {|
  body: string,
  orderIds: string | number[]
|};

const RESERVATION_CUSTOM_SMS = gql`
  mutation OrderCustomSMS($input: SMSByOrderIdsInput) {
    customSMSWithOrders(input: $input) {
      success
      error
    }
  }
`;

export const withOrdersCustomSMS = graphql(RESERVATION_CUSTOM_SMS, {
  props: ({ mutate }) => ({
    customSMSWithOrders: (input: SMSByOrderIdsInputType) => mutate({ variables: { input } })
  })
});

export default withOrdersCustomSMS;
