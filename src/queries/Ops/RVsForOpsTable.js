import gql from 'graphql-tag';

export const RVS_FOR_OPS_TABLE = gql`
  query RVsForOpsTable($venueId: ID, $orderBy: [String], $filterBy: RVInputFilter, $limit: Int, $offset: Int) {
    venue(id: $venueId) {
      rvLots {
        id
        name
      }
      rvs(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
        id
        name
        rvLot {
          id
          name
        }
        disabled
        nextOrder(filterBy: $filterBy) {
          id
          orderItems {
            id
            reservation {
              id
              startDate
              stalls {
                id
              }
            }
          }
          nextReservationDate
        }
      }
    }
    allVenueRVs: venue(id: $venueId) {
      rvs(orderBy: $orderBy, filterBy: $filterBy) {
        id
      }
    }
  }
`;
