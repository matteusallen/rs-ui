//@flow
import type Moment from 'moment';

export type StallFormType = {|
  end: Moment | null,
  quantity?: number | string,
  start: Moment | null,
  status?: string
|};

export type RvFormType = {|
  end: Moment | null,
  quantity?: number | string,
  start: Moment | null,
  status?: string
|};

export type ProductFormType = {|
  addOns: {} | null,
  addOnsQuantities: Array<number>,
  rvProductId: string | number | null,
  rv_spot: RvFormType,
  stallProductId: string | number | null,
  stalls: StallFormType
|};
