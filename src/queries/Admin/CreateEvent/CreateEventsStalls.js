//@flow
import gql from 'graphql-tag';

export type StallType = {|
  __typename: 'Stall',
  id: string,
  name: string,
  status: string
|};

export type BuildingType = {|
  __typename: 'Building',
  id: string,
  name: string,
  availableStalls: Array<StallType>
|};

export type VenueType = {|
  __typename: 'Venue',
  buildings: Array<BuildingType>
|};

export const STALLS_QUERY = gql`
  query VenueBuildingsAndStalls($id: ID) {
    venue(id: $id) {
      buildings {
        id
        name
        availableStalls {
          id
          name
          status
        }
      }
    }
  }
`;
