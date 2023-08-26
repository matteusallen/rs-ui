//@flow
import gql from 'graphql-tag';

export const ORDER_FOR_VIEW_DETAILS = gql`
  query orderForViewDetails($id: ID) {
    order(id: $id) {
      id
      createdAt
      updatedAt
      total
      fee
      platformFee
      group {
        id
        name
      }
      canceled
      event {
        id
        endDate
        checkInTime
        checkOutTime
        name
        rvProducts {
          id
          price
          nightly
          rvLot {
            id
            power
            sewer
            water
          }
        }
        startDate
        venue {
          id
          name
          city
          street
          street2
          state
          phone
          description
        }
        addOnProducts {
          id
          price
          addOn {
            id
            name
            description
            unitName
          }
        }
      }
      orderItems {
        id
        addOnProduct {
          id
          price
          addOn {
            id
            name
            unitName
          }
        }
        reservation {
          id
          endDate
          rvProduct {
            id
            price
            nightly
          }
          stallProduct {
            id
            nightly
            price
          }
          startDate
        }
        quantity
      }
      payments {
        id
        amount
        cardBrand
        cardPayment
        last4
      }
    }
  }
`;
