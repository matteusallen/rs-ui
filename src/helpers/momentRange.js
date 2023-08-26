//@flow
import Moment from 'moment';
import { extendMoment } from 'moment-range';

import { DATE_FORMAT } from './DATE_FORMAT';

const moment = extendMoment(Moment);

export const mapDates = (moments: Moment[]): string[] => moments.map(m => m.format(DATE_FORMAT));

export const momentRange = (from: string, to: string): Moment[] => Array.from(moment.range(from, to).by('day'));

type CreateDateRageParamsType = {|
  eventEndDate: string | null,
  eventStartDate: string | null,
  pristine?: boolean,
  selectedStartDate?: string,
  isEdit?: boolean
|};

export const createDateRange = ({ eventStartDate, eventEndDate, selectedStartDate, pristine, isEdit }: CreateDateRageParamsType): [string[], string[]] => {
  const start = moment(eventStartDate, DATE_FORMAT);
  const end = moment(eventEndDate, DATE_FORMAT);

  const reservationStart = selectedStartDate ? moment(selectedStartDate, DATE_FORMAT) : null;

  const minusOne = pristine ? end.clone() : end.clone().add(-1, 'days');
  const plusOne = pristine ? end.clone() : end.clone().add(1, 'days');

  const from = momentRange(start, minusOne);
  const to = reservationStart ? momentRange(isEdit ? reservationStart : reservationStart.add(1, 'days'), plusOne) : [];

  return [mapDates(from), mapDates(to)];
};

type DatesInRangeInputType = {|
  end: string | null,
  selected: { end: string | null, start: string | null },
  start: string | null
|};

export const datesInRange = (input: DatesInRangeInputType): boolean => {
  const productRange = moment.range(moment(input.start, DATE_FORMAT), moment(input.end, DATE_FORMAT));
  return productRange.contains(moment(input.selected.start, DATE_FORMAT)) && productRange.contains(moment(input.selected.end, DATE_FORMAT));
};
