import gql from 'graphql-tag';

export const STALLS_FOR_OPS_TABLE = gql`
  query StallsForOpsTable($venueId: ID, $orderBy: [String], $filterBy: StallInputFilter, $limit: Int, $offset: Int) {
    venue(id: $venueId) {
      buildings {
        id
        name
      }
      stalls(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
        id
        name
        status
        building {
          id
          name
        }
        currentOrder(filterBy: $filterBy) {
          id
          lastDepartureDate
        }
        nextOrder(filterBy: $filterBy) {
          id
          orderItems {
            reservation {
              id
              startDate
            }
          }
          nextReservationDate
        }
      }
    }
    allVenueStalls: venue(id: $venueId) {
      stalls(orderBy: $orderBy, filterBy: $filterBy) {
        id
      }
    }
  }
`;
