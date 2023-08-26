// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type AssignmentsSMSInputType = {|
  orderIds: Array<number | string>,
  reservationType: string
|};

const RESERVATION_DETAILS_RVS = gql`
  mutation reservationDetailsSMS($input: AssignmentsSMSInput) {
    reservationDetailsSMS(input: $input) {
      success
    }
  }
`;

export const withReservationDetailsSMS = graphql(RESERVATION_DETAILS_RVS, {
  props: ({ mutate }) => ({
    reservationDetailsSMS: (input: AssignmentsSMSInputType) => mutate({ variables: { input } })
  })
});

export default withReservationDetailsSMS;
