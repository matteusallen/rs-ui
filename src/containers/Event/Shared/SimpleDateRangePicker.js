//@flow
import React, { useEffect, useMemo, useState } from 'react';
import moment, { Moment } from 'moment';
import { useFormikContext } from 'formik';
import styled from 'styled-components';
import RangeDatePicker from '../../../components/DatePicker/RangeDatePicker';
import { createDateRange, DATE_FORMAT } from '../../../helpers';
import type { EventFormType } from './Form';

type SimpleDateRangePickerPropsType = {|
  disabled?: boolean,
  endDate?: string | null,
  fromDateLabel?: string,
  name: 'bookingWindow' | 'eventDates' | string,
  selectableDateRange?: {
    endDate?: string,
    startDate?: string
  },
  startDate?: string | null,
  toDateLabel?: string,
  allowedRangeForStart?: Array<string>,
  allowedRangeForEnd?: Array<string>
|};

export const SimpleDateRangePicker = ({
  name,
  fromDateLabel,
  toDateLabel,
  disabled = false,
  startDate = null,
  endDate = null,
  selectableDateRange,
  allowedRangeForStart,
  allowedRangeForEnd
}: SimpleDateRangePickerPropsType) => {
  const { setFieldValue } = useFormikContext<EventFormType>();
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(startDate);
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(endDate);
  const today = useMemo(
    () =>
      selectableDateRange && selectableDateRange.startDate
        ? moment(selectableDateRange.startDate, DATE_FORMAT).format(DATE_FORMAT)
        : moment().format(DATE_FORMAT),
    [JSON.stringify(selectableDateRange)]
  );

  const nextYear = useMemo(
    () =>
      selectableDateRange && selectableDateRange.endDate
        ? moment(selectableDateRange.endDate, DATE_FORMAT).format(DATE_FORMAT)
        : moment()
            .add(1, 'year')
            .format(DATE_FORMAT),
    [JSON.stringify(selectableDateRange)]
  );

  const [checkInDates, checkOutDates] = useMemo(
    () =>
      createDateRange({
        eventStartDate: today,
        eventEndDate: nextYear,
        selectedStartDate,
        pristine: true
      }),
    [today, nextYear, selectedStartDate]
  );

  useEffect(() => {
    setFieldValue(name, {
      startDate: selectedStartDate,
      endDate: selectedEndDate
    });
  }, [selectedStartDate, selectedEndDate]);

  useEffect(() => {
    setSelectedStartDate(startDate);
    setSelectedEndDate(endDate);
  }, [startDate, endDate]);

  return (
    <>
      <StyledRangeDatePicker
        displayFormat={'MM/DD/YY'}
        value={[selectedStartDate, selectedEndDate]}
        isOutsideRange={() => false}
        cb={({ startDate, endDate }: { endDate?: Moment, startDate?: Moment }) => {
          setSelectedStartDate(startDate ? moment(startDate).format(DATE_FORMAT) : null);
          setSelectedEndDate(endDate ? moment(endDate).format(DATE_FORMAT) : null);
        }}
        disabled={disabled}
        checkInDates={allowedRangeForStart ?? checkInDates}
        checkOutDates={allowedRangeForEnd ?? checkOutDates}
        eventStartDate={today}
        fromDateLabel={fromDateLabel}
        toDateLabel={toDateLabel}
        noCheckLabel={true}
      />
    </>
  );
};

const StyledRangeDatePicker = styled(RangeDatePicker)`
  & .DateRangePicker_picker {
    z-index: 9999;
  }

  && {
    display: inline-flex;
  }
`;
