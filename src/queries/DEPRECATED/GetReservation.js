import gql from 'graphql-tag';

export const GET_RESERVATION = gql`
  query GetReservation($reservationId: ID) {
    reservation(id: $reservationId) {
      id
      status {
        id
        name
      }
      type
      startDate
      endDate
      renter {
        id
        firstName
        lastName
        email
        phone
      }
      event {
        id
        name
        pricePerNight
        pricePerEvent
        addOns {
          id
          addOnId
          name
          description
          priceType
          price
          unitName
        }
        buildings {
          id
          name
        }
      }
      stalls {
        id
        name
        building {
          id
          name
        }
      }
      stallQuantity
      reservationAddOns {
        id
        quantity
        addOn {
          id
        }
      }
      notes
      payments {
        id
        ssRefundId
        cardPayment
        cardBrand
        createdAt
        amount
        last4
        ssChargeId
        notes
        success
      }
    }
  }
`;
