// @flow
import gql from 'graphql-tag';

export type RvProductAvailabilityType = {|
  available: number,
  productId: string
|};

export type RvProductAvailabilityReturnType = {|
  rvProductAvailability: RvProductAvailabilityType[]
|};

export const RV_PRODUCT_AVAILABILITY = gql`
  query RvProductAvailability($input: RVProductAvailabilityInputType) {
    rvProductAvailability(input: $input) {
      productId
      available
    }
  }
`;
