//@flow
import gql from 'graphql-tag';

export type VenueRVLotsInputType = {|
  id: string
|};

export type RVSpotType = {|
  description: string,
  id: string,
  name: string
|};

export type RvLotType = {|
  availableRVSpots: RVSpotType[],
  description: string,
  id: string,
  name: string,
  power: string,
  sewer: boolean,
  water: boolean
|};

export type VenueRVLotsReturnType = {|
  venue: {
    rvLots: RvLotType[]
  }
|};

export const VENUE_RV_LOTS = gql`
  query venue($id: ID) {
    venue(id: $id) {
      rvLots {
        id
        name
        description
        sewer
        water
        power
        availableRVSpots {
          id
          name
          description
        }
      }
    }
  }
`;
