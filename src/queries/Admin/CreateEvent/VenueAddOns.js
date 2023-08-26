//@flow
import gql from 'graphql-tag';

export type VenueAddOnsInputType = {|
  id: string
|};

export type AddOnType = {|
  description: string,
  id: string,
  name: string,
  unitName: string
|};

export type VenueAddOnsReturnType = {|
  venue: {
    addOns: AddOnType[]
  }
|};

export const VENUE_ADD_ONS = gql`
  query venue($id: ID) {
    venue(id: $id) {
      addOns {
        description
        id
        name
        unitName
        description
      }
    }
  }
`;
