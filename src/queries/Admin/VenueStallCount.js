import gql from 'graphql-tag';

export const VENUE_STALL_COUNT = gql`
  query VenueStallCount($eventId: ID) {
    venue {
      buildings {
        id
        name
        stallCount(eventId: $eventId) {
          all
          events
        }
        stalls(eventId: $eventId) {
          id
          name
          isActive
        }
      }
    }
  }
`;
