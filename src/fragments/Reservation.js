import gql from 'graphql-tag';

export const ReservationFragments = {
  dateDetails: gql`
    fragment formattedDateDetails on Reservation {
      startDate
      endDate
    }
  `
};
