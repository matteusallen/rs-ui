import gql from 'graphql-tag';

export const FILTERED_VENUE_EVENTS = gql`
  query FilteredVenueEvents($orderBy: [String], $filterBy: EventFilterInput, $limit: Int, $offset: Int) {
    venue {
      name
      events(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
        id
        name
        checkInTime
        checkOutTime
        startDate
        endDate
        openDate
        closeDate
        stallProducts {
          id
          stalls {
            id
          }
        }
        rvProducts {
          id
          rvSpots {
            id
          }
        }
        venue {
          id
        }
      }
    }
    allVenueEvents: venue {
      events(filterBy: $filterBy) {
        id
      }
    }
  }
`;
