import gql from 'graphql-tag';

export const VENUES = gql`
  query Venues {
    venues {
      description
      name
      id
      events {
        startDate
        endDate
        description
        name
        id
      }
    }
  }
`;
