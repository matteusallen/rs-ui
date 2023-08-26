// @flow
import gql from 'graphql-tag';

export const ORDER_EDIT_COSTS = gql`
  query orderCostsOnEdit($input: OrderCostsOnEditInput) {
    orderCostsFee(input: $input) {
      fee
    }
  }
`;
