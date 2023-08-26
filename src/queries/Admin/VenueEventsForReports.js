import gql from 'graphql-tag';

export const FUZZY_VENUE_EVENTS_FOR_REPORTS = gql`
  query FuzzySearchVenueEvents($name: String!) {
    searchEventsWithOrderCheck(name: $name, limit: 200) {
      name
      startDate
      endDate
      id
      hasStallRes
      hasRVRes
    }
  }
`;

export const VENUE_EVENTS_FOR_REPORTS = gql`
  query VenueEvents($id: ID, $limit: Int, $orderBy: [String]) {
    venue(id: $id) {
      events(orderBy: $orderBy, limit: $limit) {
        id
        name
        startDate
        endDate
        hasStallRes
        hasRVRes
        hasOrder
        createdAt
        orders {
          createdAt
        }
      }
    }
  }
`;
