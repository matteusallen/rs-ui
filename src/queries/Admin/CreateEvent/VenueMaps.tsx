import gql from 'graphql-tag';

export type VenueMapInputType = {
  id: string;
};

export type VenueMapReturnType = {
  venue: {
    venueMaps: DocumentType[];
  };
};

export type DocumentType = {
  description: string;
  id: string;
  name: string;
  url: string;
  venue: string;
};

export const VENUE_MAP = gql`
  query venue($id: ID) {
    venue(id: $id) {
      venueMaps {
        id
        name
        description
        url
      }
    }
  }
`;
