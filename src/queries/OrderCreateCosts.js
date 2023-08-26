// @flow
import gql from 'graphql-tag';

export const ORDER_CREATE_COSTS = gql`
  query OrderCreateCosts($input: OrderCostsInput) {
    orderCosts(input: $input) {
      orderItemsCostsWithDetails {
        xProductId
        xRefTypeId
        quantity
        orderItemCost
        startDate
        endDate
        discount
        discountStartDate
        discountEndDate
      }
      serviceFee
      stripeFee
      subtotal
      total
      discount
    }
  }
`;
