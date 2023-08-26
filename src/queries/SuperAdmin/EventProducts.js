//@flow
import gql from 'graphql-tag';

export const EVENT_PRODUCTS = gql`
  query eventProducts($id: ID) {
    event(id: $id) {
      addOnProducts {
        id
        price
        addOn {
          id
          name
          description
        }
      }
      stallProducts {
        id
        price
        name
        description
        startDate
        endDate
      }
      rvProducts {
        id
        price
        name
        description
        startDate
        endDate
      }
    }
  }
`;
