import gql from 'graphql-tag';

export const RV_SPOT_AVAILABILITY = gql`
  query RvSpotAvailability($input: RVSpotAvailabilityInput) {
    rvSpotAvailability(input: $input) {
      rvLot {
        id
        name
      }
      availableSpaces {
        id
        name
      }
    }
  }
`;
