//@flow
import gql from 'graphql-tag';

export const ORDER_UPDATE_PRICING_DIFFS = gql`
  query orderUpdatePricingDiffs($input: OrderUpdateInput) {
    orderUpdatePricingDiffs(input: $input) {
      success
      error
      transactionFee
      addOns {
        id
        originalPrice
        newPrice
        quantityDelta
        priceDelta
        stripeFee
        name
        unitName
      }
      rvs {
        id
        originalPrice
        newPrice
        quantityDelta
        priceDelta
        stripeFee
        name
      }
      stalls {
        id
        originalPrice
        newPrice
        quantityDelta
        priceDelta
        stripeFee
        name
      }
    }
  }
`;
