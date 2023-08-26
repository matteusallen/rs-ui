// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SMSInputType = {|
  body?: string,
  reservationIds: string | number[]
|};

const ORDER_DETAILS_SMS = gql`
  mutation ReservationDetailsSMS($input: SMSInput) {
    reservationDetailsSMS(input: $input) {
      success
      error
    }
  }
`;

export const withOrderDetailsSMS = graphql(ORDER_DETAILS_SMS, {
  props: ({ mutate }) => ({
    reservationDetailsSMS: (input: SMSInputType) => mutate({ variables: { input } })
  })
});

export default withOrderDetailsSMS;
