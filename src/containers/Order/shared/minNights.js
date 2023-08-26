export const checkMinNights = (dates, minNights, setIsBelowMinNights) => {
  if (dates.startDate && dates.endDate) {
    const selectedNights = dates.endDate.diff(dates.startDate, 'days');
    const isBelowMin = selectedNights < minNights;
    setIsBelowMinNights(isBelowMin);
  }
};
