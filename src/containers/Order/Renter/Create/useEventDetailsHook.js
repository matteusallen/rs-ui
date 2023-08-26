//@flow
import { useFormikContext } from 'formik';
import moment from 'moment';

import { DATE_FORMAT } from '../../../../helpers';

type venueMapType = {
  id: string,
  name: string,
  url: string
};

export default (): {|
  checkInTime: string,
  checkOutTime: string,
  eventDescription: string,
  eventLocation: string,
  eventName: string,
  venueCity: string,
  venueDescription: string,
  venueName: string,
  venueState: string,
  venuePhone: string,
  venueMap: venueMapType
|} => {
  const { values = {} } = useFormikContext();
  const { event = {} } = values;
  const { venue = {} } = event;

  const startDateMoment = moment(event.startDate, DATE_FORMAT);
  const endDateMoment = moment(event.endDate, DATE_FORMAT);
  const eventYear = startDateMoment.format('YYYY');
  const eventYearEnd = endDateMoment.format('YYYY');
  const eventMonth = startDateMoment.format('MMM');
  const eventMonthEnd = endDateMoment.format('MMM');
  const startDay = startDateMoment.format('D');
  const endDay = endDateMoment.format('D');
  const isSameMonth = startDateMoment.isSame(endDateMoment, 'month');
  const isSameYear = startDateMoment.isSame(endDateMoment, 'month');

  const eventLocation = isSameMonth
    ? `${eventMonth} ${startDay}-${endDay}, ${eventYear}`
    : isSameYear
    ? `${eventMonth} ${startDay} - ${eventMonthEnd} ${endDay}, ${eventYear}`
    : `${eventMonth} ${startDay}, ${eventYear} - ${eventMonthEnd} ${endDay}, ${eventYearEnd}`;

  return {
    checkInTime: event.checkInTime || '',
    checkOutTime: event.checkOutTime || '',
    eventLocation,
    eventName: event.name || '',
    venueCity: venue.city || '',
    venueDescription: venue.description || '',
    eventDescription: event.description || '',
    venueName: venue.name || '',
    venueState: venue.state || '',
    venuePhone: venue.phone || '',
    venueMap: event.venueMap
  };
};
