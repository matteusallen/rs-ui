//@flow
import moment from 'moment';

export const eventDateParser = (event: { endDate: string, startDate: string }): string => {
  const getStartDate = moment(event.startDate);
  const getEndDate = moment(event.endDate);
  const isSameMonth = moment(getStartDate).isSame(getEndDate, 'month');

  return isSameMonth
    ? `${moment(event.startDate).format('MMM DD')} - ${moment(event.endDate).format('DD, YYYY')}`
    : `${moment(event.startDate).format('MMM DD')} - ${moment(event.endDate).format('MMM DD, YYYY')}`;
};
