import gql from 'graphql-tag';

export const CURRENT_RENTABLE_EVENTS_HOMEPAGE = gql`
  query CurrentRentableEvents($orderBy: [String], $filterBy: EventFilterInput, $limit: Int, $offset: Int) {
    events(orderBy: $orderBy, filterBy: $filterBy, limit: $limit, offset: $offset) {
      id
      name
      checkInTime
      checkOutTime
      startDate
      endDate
      openDate
      closeDate
      venue {
        id
        name
        city
        state
        phone
        timeZone
      }
      stallProducts {
        nightly
        startDate
        endDate
        name
        description
        price
      }
      rvProducts {
        startDate
        nightly
        endDate
        price
      }
    }
  }
`;
