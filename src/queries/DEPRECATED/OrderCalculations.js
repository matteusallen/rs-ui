import gql from 'graphql-tag';

export const ORDER_CALCULATIONS = gql`
  query orderCalculations($input: OrderCalculationsInputType) {
    orderCalculations(input: $input) {
      error
      success
      costs {
        orderItemsTotals {
          id
          eventAddOnId
          name
          price
          priceType
          quantity
          unitName
        }
        stripeFee
        subtotal
        total
      }
    }
  }
`;
