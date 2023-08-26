import { FocusedInputShape } from 'react-dates';
import { Moment } from 'moment';

export type FocusedInputType = FocusedInputShape | null;
export type DateType = Moment | null;
export type DateRangeType = {
  startDate: DateType;
  endDate: DateType;
};
