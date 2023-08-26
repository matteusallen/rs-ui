//@flow
import gql from 'graphql-tag';

export type GetRenterEventReturnType = {|
  event: EventType
|};

export type EventType = {|
  addOnProducts: AddOnProductType[],
  checkInTime: string,
  checkOutTime: string,
  closeDate: string,
  endDate: string,
  id: string,
  name: string,
  openDate: string,
  rvProducts: RVProductType[],
  rvSoldOut: boolean,
  stallProducts: StallProductType[],
  stallSoldOut: boolean,
  startDate: string,
  venue: VenueType,
  venueAgreement: VenueAgreementType,
  venueMap: VenueMapType
|};

export type VenueMapType = {|
  id: string,
  name: string,
  url: string
|};

export type VenueAgreementType = {|
  id: string,
  name: string,
  url: string
|};

export type VenueType = {|
  city: string,
  description: string,
  id: string,
  name: string,
  phone: string,
  state: string,
  street: string,
  street2: string,
  timeZone: string,
  zip: string
|};

export type StallProductType = {|
  addOn?: AddOnType,
  description: string,
  endDate: string,
  id: string,
  name: string,
  nightly: boolean,
  price: number,
  startDate: string
|};

export type AddOnProductType = {|
  addOn: AddOnType,
  id: string,
  price: number
|};

export type AddOnType = {|
  description: string,
  id: string,
  name: string,
  unitName: string
|};

export type RVProductType = {|
  addOn?: AddOnType,
  description: string,
  endDate: string,
  event: EventType,
  id: string,
  nightly: boolean,
  name: string,
  price: number,
  rvLot: RVLotType,
  rvSpots: RVSpotType[],
  startDate: string
|};

export type RVSpotType = {|
  description: string,
  id: string,
  name: string,
  rvLot: RVLotType
|};

type RVLotType = {|
  description: string,
  id: string,
  name: string,
  power: string,
  rvSpots: RVSpotType[],
  sewer: boolean,
  water: boolean
|};

export const EVENT_FOR_ORDER_CREATE = gql`
  query EventForOrderCreate($eventId: ID) {
    event(id: $eventId) {
      id
      name
      description
      startDate
      endDate
      checkInTime
      checkOutTime
      openDate
      closeDate
      stallQuestions {
        id
        question
        questionType
        answerOptions
        required
        minLength
        maxLength
      }
      rvQuestions {
        id
        question
        questionType
        answerOptions
        required
        minLength
        maxLength
      }
      venue {
        city
        description
        id
        name
        phone
        state
        street
        street2
        timeZone
        zip
      }
      stallProducts {
        description
        endDate
        id
        name
        nightly
        price
        startDate
        minNights
      }
      addOnProducts {
        id
        price
        disabled
        addOn {
          id
          name
          description
          unitName
        }
      }
      rvProducts {
        id
        name
        description
        startDate
        endDate
        price
        nightly
        minNights
        rvLot {
          id
          name
          description
          sewer
          water
          power
        }
      }
      venueAgreement {
        id
        name
        url
      }
      venueMap {
        id
        name
        url
      }
      isGroupCodeRequired
    }
  }
`;
