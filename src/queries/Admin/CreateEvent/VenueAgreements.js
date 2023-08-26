//@flow
import gql from 'graphql-tag';

export type VenueAgreementInputType = {|
  id: string
|};

export type VenueAgreementReturnType = {|
  venue: {
    venueAgreements: DocumentType[]
  }
|};

export type DocumentType = {|
  description: string,
  id: string,
  name: string,
  url: string,
  venue: string
|};

export const VENUE_AGREEMENT = gql`
  query venue($id: ID) {
    venue(id: $id) {
      venueAgreements {
        id
        name
        description
        url
      }
    }
  }
`;
