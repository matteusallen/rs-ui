import gql from 'graphql-tag';

export const VENUE_ORDERS = gql`
  query venueOrders($venueIds: [ID], $limit: Float, $offset: Float) {
    venue {
      allOrders: orders(venueIds: $venueIds) {
        id
      }
      orders(venueIds: $venueIds, limit: $limit, offset: $offset) {
        id
        event {
          id
          name
        }
        createdAt
        orderItems {
          id
          eventAddOn {
            id
            addOn {
              id
              name
              quantity
              unitName
            }
          }
          price
          productId
          quantity
        }
        fee
        notes
        successor
        total
        renter {
          id
          firstName
          lastName
          fullName
        }
      }
    }
  }
`;
