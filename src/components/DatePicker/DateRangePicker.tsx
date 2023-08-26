import React, { useState, useMemo, useEffect } from 'react';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker as RangePicker } from 'react-dates';
import moment, { Moment } from 'moment';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { FocusedInputType, DateRangeType } from './types';
import { HORIZONTAL_ORIENTATION } from 'Constants/responsive';
import './DateRangePicker.scss';
import BackDateModal from '../WarningModal/WarningModal';
import { DateType } from './types';

interface DateRangePickerProps {
  startDateId?: string;
  endDateId?: string;
  startTitle?: string;
  endTitle?: string;
  defaultStartDate?: DateType;
  defaultEndDate?: DateType;
  startLabel?: string;
  endLabel?: string;
  minDate: Moment;
  maxDate: Moment;
  minimumNights?: number;
  allowBackDate?: boolean;
  disabled?: boolean;
  dateChangeCallback?: Function;
  showBackDateWarning?: boolean;
  initialVisibleMonth?: Moment;
}

// Dev Notes: There is now way to eliminate componentWillUpdate warning: https://github.com/airbnb/react-dates/issues/1748
const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDateId = 'start',
  endDateId = 'end',
  startTitle,
  endTitle,
  minimumNights = 1,
  defaultStartDate = null,
  defaultEndDate = null,
  startLabel = 'Start Date',
  endLabel = 'End Date',
  minDate,
  maxDate,
  showBackDateWarning = true,
  allowBackDate = false,
  disabled = false,
  dateChangeCallback = () => null,
  initialVisibleMonth = undefined
}) => {
  const [focusedInput, setFocusedInput] = useState<FocusedInputType>(null);
  const [dates, setDates] = useState<DateRangeType>({ startDate: defaultStartDate, endDate: defaultEndDate });
  const [showBackdateModal, setShowBackdateModal] = useState<boolean>(false);
  const backDate: Moment = useMemo(
    () =>
      moment(minDate)
        .startOf('days')
        .subtract(1, 'days'),
    [minDate]
  );
  const ceilingDate: Moment = useMemo(
    () =>
      moment(maxDate)
        .startOf('days')
        .add(1, 'days'),
    [maxDate]
  );
  const today = moment().startOf('days');

  useEffect(() => {
    const backDateSelected = dates.startDate?.isSame(backDate) || dates.startDate?.isBefore(today);
    if (defaultEndDate) return;
    if (dates.startDate && backDateSelected && showBackDateWarning) {
      setShowBackdateModal(true);
    }
    if (dates.startDate) {
      setDates({ startDate: dates.startDate, endDate: null });
    }
  }, [dates.startDate]);

  useEffect(() => {
    setDates({ startDate: defaultStartDate, endDate: defaultEndDate });
  }, [defaultStartDate, defaultEndDate]);

  const smallDevice = useMediaQuery('(max-width: 769px)');

  function onFocusChange(focusedInputInput: FocusedInputType): void {
    setFocusedInput(focusedInputInput);
  }

  function onDatesChange(dates: DateRangeType): void {
    setDates(dates);
    dateChangeCallback(dates);
  }

  function isOutsideRange(date: Moment, allowBackDate: boolean): boolean {
    if (focusedInput === 'startDate' && !dates.startDate) {
      return (allowBackDate ? date.isBefore(backDate) : date.isBefore(minDate)) || date.isSameOrAfter(maxDate);
    } else if (focusedInput === 'startDate' && dates.startDate && dates.endDate) {
      return (allowBackDate ? date.isBefore(backDate) : date.isBefore(minDate)) || date.isSameOrAfter(maxDate);
    }

    return (allowBackDate ? date.isBefore(backDate) : date.isBefore(minDate)) || date.isSameOrAfter(ceilingDate);
  }

  function onModalCancel(): void {
    setShowBackdateModal(false);
    const newDate: DateRangeType = { startDate: null, endDate: null };
    dateChangeCallback(newDate);
    setDates(newDate);
    setFocusedInput('startDate');
  }

  function onModalContinue(): void {
    setShowBackdateModal(false);
    setFocusedInput('endDate');
  }

  function onModalClose(): void {
    setShowBackdateModal(false);
  }

  return (
    <div className="os-calendar-wrapper" data-testid="date-range-picker">
      <BackDateModal
        isOpen={showBackdateModal}
        handleClose={onModalClose}
        onCancel={onModalCancel}
        onContinue={onModalContinue}
        header="Previous Date Selected"
        text="You selected a date that is in the past, do you want to continue with this selection?"
        continueLabel="CONTINUE"
      />
      <div className="date-label-wrapper">
        {dates.startDate ? <label className="date-label-start">{startTitle ? startTitle : 'CHECK IN'}</label> : null}
        {dates.endDate ? <label className="date-label-end">{endTitle ? endTitle : 'CHECK OUT'}</label> : null}
      </div>
      <RangePicker
        minimumNights={minimumNights}
        startDatePlaceholderText={startLabel}
        startDate={dates.startDate}
        endDatePlaceholderText={endLabel}
        endDate={dates.endDate}
        startDateId={startDateId}
        endDateId={endDateId}
        disabled={disabled}
        isOutsideRange={date => isOutsideRange(date, allowBackDate)}
        enableOutsideDays={false}
        focusedInput={focusedInput}
        onFocusChange={onFocusChange}
        onDatesChange={onDatesChange}
        numberOfMonths={smallDevice ? 1 : 2}
        orientation={HORIZONTAL_ORIENTATION}
        displayFormat={'MM/DD/YY'}
        initialVisibleMonth={initialVisibleMonth ? () => moment(initialVisibleMonth) : undefined}
        readOnly
      />
    </div>
  );
};

export default DateRangePicker;
