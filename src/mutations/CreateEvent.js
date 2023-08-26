// @flow
import gql from 'graphql-tag';

export type StallProductInputType = {|
  description: string,
  endDate: string,
  name: string,
  nightly: boolean,
  price: number,
  stalls: string[],
  startDate: string
|};
export type CreateRVProductInputType = {|
  description: string,
  endDate: string,
  name: string,
  price: number,
  rvLotId: string,
  rvSpots: string[],
  startDate: string,
  nightly: boolean
|};

export type CreateAddOnProductInputType = {|
  addOnId: string,
  price: number
|};

export type CreateEventInputType = {|
  addOnProducts?: CreateAddOnProductInputType[],
  checkInTime: string,
  checkOutTime: string,
  closeDate: string,
  description: string,
  endDate: string,
  id?: string,
  name: string,
  openDate: string,
  rvProducts?: CreateRVProductInputType[],
  stallProducts?: StallProductInputType[],
  startDate: string,
  venueAgreementDocumentId: string,
  venueMapDocumentId?: string | null
|};

export type CreateEventReturnType = {|
  error: string,
  event: { id: string },
  success: boolean
|};

export const CREATE_EVENT = gql`
  mutation createEvent($input: EventUpsertInput) {
    createEvent(input: $input) {
      event {
        id
      }
      success
      error
    }
  }
`;
