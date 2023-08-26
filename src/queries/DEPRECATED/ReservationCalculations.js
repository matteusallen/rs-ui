import gql from 'graphql-tag';

// DEPRECATED
export const RESERVATION_CALCULATIONS = gql`
  query reservationCalculations($input: ReservationCalculationsInputType) {
    reservationCalculations(input: $input) {
      data {
        availability {
          date
          stallsAvailable
        }
        checkInAvailability
        checkOutAvailability
        costs {
          addOnsTotals {
            id
            eventAddOnId
            name
            unitName
            quantity
            price
            priceType
          }
          nightlyTotal
          reservationDuration
          stripeFee
          total
        }
      }
      success
      error
    }
  }
`;
