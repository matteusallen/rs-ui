//@flow
import gql from 'graphql-tag';

export type StallProductAvailabilityType = {|
  available: number,
  productId: string
|};

export type StallProductAvailabilityReturnType = {|
  stallProductAvailability: StallProductAvailabilityType[]
|};

export const STALL_PRODUCT_AVAILABILITY = gql`
  query StallProductAvailability($input: StallProductAvailabilityInputType) {
    stallProductAvailability(input: $input) {
      productId
      available
    }
  }
`;
