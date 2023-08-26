//@flow
import type { RvLotType } from '../../../../queries/Admin/CreateEvent/VenueRvLots';

export type StepsType = 'details' | 'stalls' | 'rvs' | 'review';

export type DateRageType = {|
  endDate: string | null,
  startDate: string | null
|};

export type StallProductType = {|
  dateRange: DateRageType,
  entireEvent: boolean,
  name: string,
  price: string,
  pricing: string,
  stallsForThisRate: string[]
|};

export type RvFormType = {|
  dateRange: DateRageType,
  price: number | string,
  pricing: string,
  rvLot?: RvLotType,
  rvLotId: string,
  spots: string[]
|};

export type AddOnsFormType = {|
  id: string,
  name: string,
  price: number | string,
  disabled: boolean
|};

export type EventFormType = {|
  addOns: AddOnsFormType[],
  agreements: DocumentType[],
  bookingWindow: DateRageType,
  closeTime: string | null,
  openTime: string | null,
  checkInTime: string,
  checkOutTime: string,
  eventDates: DateRageType,
  eventDescription: string,
  eventName: string,
  hasRvs: boolean,
  hasStalls: boolean,
  isLoading: boolean,
  rvs: RvFormType[],
  rvQuestions: [],
  stallQuestions: [],
  stalls: StallProductType[],
  stallFlip: boolean,
  rvFlip: boolean,
  step: StepsType,
  validSections: string | null,
  venueAgreement: string,
  venueMap: string | null,
  renterGroupCodeMode: string,
  hasOrders: number
|};
