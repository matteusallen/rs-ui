//@flow
import React from 'react';
import moment from 'moment';

import { EventCard } from '../Cards/EventCard';
import { EventFormType } from '../Form';
import { dateToSimpleLocaleTime } from '../../../../utils/dateTimeHelpers';

type ReviewDetailsPropType = {|
  formikValues: EventFormType,
  initialValues: EventFormType
|};

/**
 * @param {string} enteredDate
 * @param {string} enteredTime
 * @return {string}
 */
const formatDateTime = (enteredDate, enteredTime) => {
  if (enteredTime instanceof Date) {
    enteredTime = dateToSimpleLocaleTime(enteredTime);
  }
  const enteredTimeNormalized = enteredTime.toLowerCase();
  const isPm = enteredTimeNormalized.indexOf('pm') !== -1;

  if (isPm) {
    const [htime] = enteredTimeNormalized.split('pm');
    let [hour, minute] = htime.split(':');

    hour = parseInt(hour, 10);
    let goodHour = hour === 12 ? 12 : hour + 12;
    const goodMinute = minute.trim();

    return `${enteredDate}T${goodHour}:${goodMinute}`;
  }

  // am/pm wasn't specified, assume am unless it's 24 hour
  const [htime] = enteredTimeNormalized.split('am');
  let [hour, minute] = htime.split(':');
  hour = parseInt(hour, 10);

  let goodHour = hour < 10 ? `0${hour}` : hour;
  const goodMinute = minute.trim();

  return `${enteredDate}T${goodHour}:${goodMinute}`;
};

const formatInTime = (eventDates, checkInTime) => {
  const fixedDate = formatDateTime(eventDates.startDate, checkInTime);
  const time = new Date(fixedDate);
  return moment(time).format('h:mma');
};

const formatOutTime = (eventDates, checkOutTime) => {
  const fixedDate = formatDateTime(eventDates.endDate, checkOutTime);
  const time = new Date(fixedDate);
  return moment(time).format('h:mma');
};

const ReviewDetails = ({ formikValues, initialValues }: ReviewDetailsPropType) => {
  const {
    eventName,
    eventDescription,
    eventDates,
    checkInTime,
    checkOutTime,
    bookingWindow,
    openTime,
    closeTime,
    agreements,
    venueAgreement,
    maps,
    venueMap,
    renterGroupCodeMode
  } = formikValues;

  const selectedAgreement = agreements.find(a => venueAgreement && a.id === venueAgreement.toString());
  const selectedMap = maps.find(a => venueMap && a.id === venueMap.toString());

  const highlightIfUpdated = (initialValue, currentValue) => {
    if (!initialValues) {
      return '';
    }
    return initialValue === currentValue ? '' : 'highlighted';
  };

  const getReservableDates = () => {
    const formattedStartDate = moment(eventDates.startDate).format('MM/DD/YY');
    const formattedEndDate = moment(eventDates.endDate).format('MM/DD/YY');
    return `${formattedStartDate} – ${formattedEndDate}`;
  };

  const highlightReservableDates = () => {
    if (!initialValues) {
      return '';
    }
    const startDateWasUpdated = initialValues.eventDates.startDate !== eventDates.startDate;
    const endDateWasUpdated = initialValues.eventDates.endDate !== eventDates.endDate;
    return startDateWasUpdated || endDateWasUpdated ? 'highlighted' : '';
  };

  const getBookingWindow = () => {
    const start = moment(`${bookingWindow.startDate} ${openTime}`).format('MM/DD/YY, hh:mm a');
    const end = moment(`${bookingWindow.endDate} ${closeTime}`).format('MM/DD/YY, hh:mm a');
    return `${start} - ${end}`;
  };

  const highlightBookingWindow = () => {
    if (!initialValues) {
      return '';
    }
    const startDateWasUpdated = initialValues.bookingWindow.startDate !== bookingWindow.startDate;
    const endDateWasUpdated = initialValues.bookingWindow.endDate !== bookingWindow.endDate;
    const openTimeWasUpdated = initialValues.openTime !== openTime;
    const closeTimeWasUpdated = initialValues.closeTime !== closeTime;
    return startDateWasUpdated || endDateWasUpdated || openTimeWasUpdated || closeTimeWasUpdated ? 'highlighted' : '';
  };

  const getGroupCodeModeText = () => {
    const delayPaymentsText = {
      secured: 'Allow delayed payment with an access code',
      unsecured: 'Allow delayed payment with a credit/debit card on file',
      none: ''
    };

    const mode = renterGroupCodeMode === '' ? 'none' : renterGroupCodeMode;
    return delayPaymentsText[mode];
  };

  return (
    <EventCard title="Basic Details" testId="review-basic-details">
      <div className="info-row">
        <div className="info-item">
          <h3>Event Name</h3>
          <span className={`info ${highlightIfUpdated(initialValues?.eventName, eventName)}`}>{eventName}</span>
        </div>
        <div className="info-item">
          <h3>Check In Time</h3>
          <span className={`info ${highlightIfUpdated(initialValues?.checkInTime, checkInTime)}`}>{formatInTime(eventDates, checkInTime)}</span>
        </div>
        <div className="info-item">
          <h3>Check Out Time</h3>
          <span className={`info ${highlightIfUpdated(initialValues?.checkOutTime, checkOutTime)}`}>{formatOutTime(eventDates, checkOutTime)}</span>
        </div>
        <div className="info-item">
          {selectedAgreement && (
            <>
              <h3>Venue Agreement</h3>
              <span className={`info ${highlightIfUpdated(initialValues?.venueAgreement, venueAgreement)}`}>
                <a href={selectedAgreement.url} target="_blank" rel="noreferrer">
                  {selectedAgreement.name}
                </a>
              </span>
            </>
          )}
        </div>
        <div className="info-item">
          {selectedMap && (
            <>
              <h3>Venue Map</h3>
              <span className={`info ${highlightIfUpdated(initialValues?.venueMap, venueMap)}`}>
                <a href={selectedMap.url} target="_blank" rel="noreferrer">
                  {selectedMap.name}
                </a>
              </span>
            </>
          )}
        </div>
      </div>

      <div className="info-row">
        <div className="info-item">
          <h3>Reservable Dates</h3>
          <span className={`info ${highlightReservableDates()}`}>{getReservableDates()}</span>
        </div>
        <div className="info-item booking-info">
          <h3>Online Booking Window</h3>
          <span className={`info ${highlightBookingWindow()}`}>{getBookingWindow()}</span>
        </div>
        <div className="info-item-event-description">
          <h3>Event Description</h3>
          <span className={`info${!eventDescription ? ' default-description' : ''} ${highlightIfUpdated(initialValues?.eventDescription, eventDescription)}`}>
            {eventDescription || 'No event description'}
          </span>
        </div>
      </div>

      {renterGroupCodeMode.length > 0 && (
        <div className="info-row">
          <div className="info-item">
            <h3>Allow Renters to Delay their Payment</h3>
            <span className={`info ${highlightIfUpdated(initialValues?.renterGroupCodeMode, renterGroupCodeMode)}`}>{getGroupCodeModeText()}</span>
          </div>
        </div>
      )}
    </EventCard>
  );
};

export default ReviewDetails;
