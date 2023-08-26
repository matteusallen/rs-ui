import gql from 'graphql-tag';

export const STALL_AVAILABILITY = gql`
  query StallAvailability($input: StallAvailabilityInput) {
    stallAvailability(input: $input) {
      rvLot {
        id
      }
      building {
        id
        name
      }
      availableSpaces {
        id
        name
        status
        building {
          id
          name
        }
      }
    }
  }
`;
