import gql from 'graphql-tag';

export const EVENTS_LIST_BY_USER_ORDERS = gql`
  query EventsListByOrderByUser($id: ID) {
    user(id: $id) {
      payload {
        id
        orders {
          id
          canceled
          event {
            id
            name
            startDate
            endDate
            venue {
              id
              city
              state
            }
          }
        }
      }
      error
    }
  }
`;
