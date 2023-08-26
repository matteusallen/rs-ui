// @flow
import gql from 'graphql-tag';

export const RESERVATION_ASSIGNMENT_COUNTS_SMS = gql`
  query ReservationAssignmentCountsSMS($input: SMSCountInput) {
    reservationAssignmentSMSCounts(input: $input) {
      productTypeNotPurchased
      noSpacesAssigned
      assignmentsAlreadySent
      ordersToBeSentAssignment
    }
  }
`;
