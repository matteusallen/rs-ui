//@flow
import React from 'react';
import './Dates.scss';
import { useFormikContext, Field } from 'formik';
import { FormikField } from '../../../../components/Fields';
import { EventCard } from '../Cards/EventCard';
import { SimpleDateRangePicker } from '../SimpleDateRangePicker';
import type { EventFormType } from '../Form';
import { HeadingFour } from 'Components/Headings';

export const Dates = () => {
  const {
    values: { eventDates, bookingWindow, closeTime, openTime, hasOrders }
  } = useFormikContext<EventFormType>();

  return (
    <EventCard title={'Dates'} testId="event-create-dates">
      <div className={'card-row'}>
        <div className={'card-col'}>
          <HeadingFour label="Reservable Dates for Event" />
          <p>
            Set the date range in which stalls and/or RV spots will be <br />
            available for this event
          </p>
          <div className={'date-picker-container'}>
            <SimpleDateRangePicker
              disabled={hasOrders > 0}
              fromDateLabel={'START DATE'}
              toDateLabel={'END DATE'}
              name={'eventDates'}
              startDate={eventDates.startDate}
              endDate={eventDates.endDate}
            />
          </div>
        </div>

        <div className={'card-col booking-col'}>
          <HeadingFour label="Online Booking Window" />
          <p>Set the date range in which this event will be shown on Open Stalls for athletes to book stalls and/or RV spots online</p>
          <div className={'date-picker-container'}>
            <SimpleDateRangePicker
              name={'bookingWindow'}
              fromDateLabel={'OPEN DATE'}
              toDateLabel={'CLOSE DATE'}
              startDate={bookingWindow.startDate}
              endDate={bookingWindow.endDate}
              selectableDateRange={{ endDate: eventDates.endDate }}
              disabled={!eventDates.startDate || !eventDates.endDate}
            />
          </div>
          <div className={'booking-time'}>
            <Field component={FormikField} label="OPENING TIME" type="time" name="openTime" variant="filled" value={openTime} className={'open-time-field'} />
            <Field
              component={FormikField}
              label="CLOSING TIME"
              type="time"
              name="closeTime"
              variant="filled"
              value={closeTime}
              className={'close-time-field'}
            />
          </div>
        </div>
      </div>
    </EventCard>
  );
};
