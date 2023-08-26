import gql from 'graphql-tag';

import { ReservationFragments } from '../../fragments/Reservation';

export const VENUE_RESERVATIONS = gql`
  query VenueReservations($orderBy: [String], $filterBy: ReservationFilterType, $limit: Float, $offset: Float) {
    allReservations: reservations(filterBy: $filterBy) {
      id
    }
    reservations(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
      id
      status {
        id
        name
      }
      renter {
        id
        fullName
      }
      ...formattedDateDetails
      event {
        id
        name
      }
      reservationAddOns {
        id
        quantity
        addOn {
          id
          name
          unitName
        }
      }
      notes
      stalls {
        id
        name
        building {
          id
          name
        }
      }
      payments {
        id
        success
        amount
        cardPayment
        cardBrand
      }
    }
    reservationStatuses {
      id
      name
    }
  }
  ${ReservationFragments.dateDetails}
`;
