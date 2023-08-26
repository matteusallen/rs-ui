// @flow
import gql from 'graphql-tag';

export const CREATE_VENUE = gql`
  mutation createVenue($input: CreateVenueType) {
    createVenue(input: $input) {
      id
    }
  }
`;
