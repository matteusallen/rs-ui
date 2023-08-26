import gql from 'graphql-tag';

export const FILTERED_VENUE_RENTERS = gql`
  query FilteredVenueRenters($orderBy: [String], $filterBy: UserFilterInput, $limit: Int, $offset: Int) {
    venue {
      users(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
        id
        role {
          id
          name
        }
        email
        firstName
        lastName
        phone
      }
    }
    allVenueUsers: venue {
      users(filterBy: $filterBy) {
        id
      }
    }
  }
`;
