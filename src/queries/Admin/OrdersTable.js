import gql from 'graphql-tag';

export const ORDERS_TABLE = gql`
  query GetAdminOrders($input: OrdersInput) {
    orders(input: $input) {
      error
      success
      count
      checkingInCount
      checkingOutCount
      orders {
        group {
          id
          name
        }
        id
        notes
        isVisited
        multipleOrders
        isGroupOrderPaymentSettled
        orderItems {
          id
          quantity
          reservation {
            id
            assignmentConfirmed
            stalls {
              id
            }
            rvSpots {
              id
            }
            status {
              id
              name
            }
          }
          addOnProduct {
            id
            addOn {
              id
              name
            }
          }
        }
        user {
          id
          firstName
          lastName
        }
        event {
          id
          name
        }
      }
    }
  }
`;
