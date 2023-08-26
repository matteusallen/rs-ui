// @flow
import gql from 'graphql-tag';

export type EventSearchInput = {
  name: string | null
};

export const RENTABLE_EVENTS_BY_NAME_OR_CITY = gql`
  query RentableEventsByNameOrCity($input: EventSearchInput) {
    searchEvents(input: $input) {
      id
      name
      startDate
      endDate
      closeDate
      openDate
      venue {
        id
        name
        city
        state
        phone
        timeZone
      }
      rvProducts {
        id
        price
        nightly
        description
        name
        endDate
        startDate
      }
      stallProducts {
        id
        price
        nightly
        description
        name
        endDate
        startDate
      }
      rvSoldOut
      stallSoldOut
    }
  }
`;
