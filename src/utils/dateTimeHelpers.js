import moment from 'moment';
/**
 * Converts a date to a numeric time string of the format HH:MM PM/AM.
 * @param {Date} myDate
 */
export function dateToSimpleLocaleTime(myDate) {
  const dateToTimeStringArray = myDate.toLocaleTimeString().split(' ');
  const numericTime = dateToTimeStringArray[0]
    .split(':')
    .slice(0, 2)
    .join(':');
  return `${numericTime} ${dateToTimeStringArray[1]}`;
}

/**
 * Return the date today.
 * @returns {Date}
 */
function getTodayNow() {
  return new Date();
}

/**
 * New date object reflecting the specified time.
 * @param {String} militaryTime - 00:00 to 23:59
 * @returns {Date}
 */
export function getSpecificTimeToday(militaryTime) {
  const today = getTodayNow();
  const days = String(today.getDate()).padStart(2, '0');
  const months = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();

  return new Date(`${months}/${days}/${year} ${militaryTime}`);
}

/**
 * New date object reflecting the specified time.
 * @param {String} date - YYYY/MM/DD
 * @returns {Date} format MM/DD/YY
 */
export function getStandardFormat(date) {
  return moment(date, 'YYYY/MM/DD').format('MM/DD/YY');
}

export function calculateReservationNights(reservation) {
  if (!reservation) return 0;
  const start = moment(reservation.startDate);
  const end = moment(reservation.endDate);
  return end.diff(start, 'days');
}
