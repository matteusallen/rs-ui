//@flow
import gql from 'graphql-tag';

export const ORDER_FOR_PRINT_RECEIPT = gql`
  query orderForPrintReceipt($id: ID) {
    order(id: $id) {
      discount
      orderHistory {
        productName
        productType
        payments {
          id
          ssChargeId
          ssRefundId
          amount
          cardPayment
          cardBrand
          last4
          notes
        }
        noRefundReason
        nightly
        startDate
        prevStartDate
        prevProductId
        prevEndDate
        endDate
        createdAt
        quantity
        discount
        groupOrderBill {
          amount
          id
          isRefund
          note
        }
        payment {
          notes
          last4
          ssRefundId
          cardBrand
          ssChargeId
          amount
          id
        }
        user {
          firstName
          lastName
        }
        prevQuantity
        isNoRefund
        productId
      }
      id
      successorOrder {
        id
      }
      fee
      group {
        id
        name
      }
      platformFee
      canceled
      event {
        id
        closeDate
        endDate
        checkInTime
        checkOutTime
        openDate
        name
        rvProducts {
          id
          endDate
          name
          description
          price
          nightly
          rvLot {
            id
            description
            name
            power
            sewer
            water
          }
          startDate
        }
        stallProducts {
          id
          endDate
          name
          description
          nightly
          price
          startDate
        }
        startDate
        venue {
          id
          buildings {
            id
            name
          }
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
      notes
      adminNotes
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
            name
            description
            price
            nightly
            rvLot {
              id
              description
              name
              power
              sewer
              water
            }
          }
          rvSpots {
            id
            name
          }
          stallProduct {
            id
            name
            description
            nightly
            price
          }
          stalls {
            id
            building {
              id
              name
            }
            name
            description
            status
          }
          startDate
          status {
            id
            name
          }
        }
        quantity
      }
      payments {
        id
        admin {
          id
        }
        amount
        cardBrand
        cardPayment
        createdAt
        last4
        notes
        ssChargeId
        ssRefundId
        success
      }
      total
      user {
        id
        email
        firstName
        fullName
        lastName
        phone
      }
    }
  }
`;
