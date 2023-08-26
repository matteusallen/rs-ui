// @flow
import moment from 'moment';

const isStartTimeAfterEndTime = (startTime: string, endTime: string): boolean => {
  if (!!startTime && !!endTime) {
    const diff = moment.utc(moment(startTime, 'hh:mm:ss a').diff(moment(endTime, 'hh:mm:ss a')));
    return Boolean(!(diff.hours() === 0 && diff.minutes() === 0 && diff.seconds() === 0 && diff.milliseconds() === 0));
  }
  return false;
};

const isEndDateEqualToStartDate = (startDate: string, endDate: string): boolean => {
  if (!!startDate && !!endDate) {
    return moment(endDate).isSame(moment(startDate));
  }
  return false;
};

const isEndDateEqualOrAfterStartDate = (startDate: string, endDate: string): boolean => {
  if (!!startDate && !!endDate) {
    return moment(endDate)
      .add(1, 'days')
      .isAfter(moment(startDate));
  }
  return false;
};

export { isEndDateEqualOrAfterStartDate, isEndDateEqualToStartDate, isStartTimeAfterEndTime };
