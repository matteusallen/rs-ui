import gql from 'graphql-tag';

export const ORDER_FOR_ORDER_HISTORY_DETAILS = gql`
  query OrderForOrderHistoryDetails($id: ID) {
    orderHistory(id: $id) {
      productName
      productType
      noRefundReason
      prevEndDate
      prevStartDate
      prevProductId
      nightly
      startDate
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
      user {
        firstName
        lastName
      }
      prevQuantity
      isNoRefund
      productId
    }
  }
`;
