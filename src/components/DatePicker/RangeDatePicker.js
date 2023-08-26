// @flow
import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import styled from 'styled-components';
import moment, { Moment } from 'moment';
import colors from '../../styles/Colors';
import { omit } from '../../utils/objectHelpers';
import { HORIZONTAL_ORIENTATION } from '../../constants/responsive';

type DateRangePickerPropsType = {|
  availability?: [],
  cb: (dates: { endDate: Moment, startDate: Moment }) => void,
  checkInDates: Array<?Moment>,
  checkOutDates: Array<?Moment>,
  className?: string,
  disabledStartDate?: boolean,
  disabled?: boolean,
  displayFormat?: string,
  eventStartDate: Moment,
  fromDateLabel?: string,
  isFilter?: boolean,
  isOutsideRange: () => boolean,
  toDateLabel?: string,
  value: Array<?Moment>
|};

type DateRangePickerStateType = {|
  endDate: Moment | null,
  focusedInput?: boolean | null,
  startDate?: Moment | null
|};

class DateRangePickerWrapper extends Component<DateRangePickerPropsType, DateRangePickerStateType> {
  constructor(props: DateRangePickerPropsType) {
    super(props);

    this.state = {
      // eslint-disable-next-line
      endDate: null,
      focusedInput: null,
      // eslint-disable-next-line
      startDate: null
    };
  }

  onDatesChange = ({ startDate, endDate }: { endDate: Moment, startDate: Moment }) => {
    const { cb, checkInDates, checkOutDates, isFilter } = this.props;

    if (!isFilter && !!startDate && !!endDate) {
      const currDate = moment(startDate).startOf('day');
      const lastDate = moment(endDate).startOf('day');
      const datesBetweenCheckInAndOut = [startDate.format('YYYY-MM-DD')];

      while (currDate.add(1, 'days').diff(lastDate) < 0) {
        datesBetweenCheckInAndOut.push(currDate.clone().format('YYYY-MM-DD'));
      }

      const datesAreAvailable = datesBetweenCheckInAndOut.map(date => checkInDates.includes(date));
      if (datesAreAvailable.length) {
        const isBeforeEventEndDate = moment(datesAreAvailable[datesAreAvailable.length - 1]).isBefore(checkOutDates[checkOutDates.length - 1]);
        if (isBeforeEventEndDate)
          return cb({
            startDate,
            endDate
          });
      }
    }

    return cb({
      startDate,
      endDate
    });
  };

  onFocusChange = (focusedInput: boolean) => {
    this.setState({ focusedInput });
  };

  isDateBlocked = (date: string) => {
    const { checkInDates, checkOutDates, isFilter } = this.props;
    const [resStartDate] = this.props.value;
    const { focusedInput } = this.state;

    if (isFilter) return;

    if (focusedInput === 'startDate') {
      const index = checkInDates.findIndex(item => moment(item).isSame(date, 'day'));
      const reservationDateActive = moment(date).isSame(resStartDate, 'day');
      return index > -1 || reservationDateActive ? false : true;
    }

    const index = checkOutDates.findIndex(item => moment(item).isSame(date, 'day'));
    return index > -1 ? false : true;
  };

  render() {
    const { focusedInput } = this.state;
    const [startDate, endDate] = this.props.value;
    const { eventStartDate, fromDateLabel, toDateLabel } = this.props;
    const dateRangeProps = omit(this.props, [
      'checkInDates',
      'checkOutDates',
      'eventStartDate',
      'fromDateLabel',
      'toDateLabel',
      'label',
      'type',
      'plural',
      'value',
      'cb',
      'className',
      'selectableRangeStart',
      'selectableRangeEnd',
      'availability',
      'isFilter'
    ]);

    const smallDevice = window.matchMedia('(max-width: 769px)').matches;

    return (
      <Wrapper focusedInput={focusedInput} disabled={this.props.disabled} className={`${this.props.className || ''}${this.props.disabled ? ' disabled' : ''}`}>
        <div className="date-label-wrapper">
          {startDate && (
            <label className="date-label start-date" for={fromDateLabel}>
              {fromDateLabel || 'CHECK IN'}
            </label>
          )}
          {endDate && (
            <label className="date-label end-date" for={toDateLabel}>
              {toDateLabel || 'CHECK OUT'}
            </label>
          )}
        </div>
        <DateRangePicker
          {...dateRangeProps}
          disabled={(this.props.disabledStartDate && 'startDate') || this.props.disabled}
          onDatesChange={this.onDatesChange}
          onFocusChange={this.onFocusChange}
          startDate={startDate ? moment(startDate) : null}
          endDate={endDate ? moment(endDate) : null}
          isDayBlocked={date => this.isDateBlocked(date)}
          initialVisibleMonth={() => moment(eventStartDate)}
          focusedInput={focusedInput}
          block={false}
          startDatePlaceholderText={fromDateLabel ? fromDateLabel : 'FROM'}
          endDatePlaceholderText={toDateLabel ? toDateLabel : 'TO'}
          startDateId={'startDate'}
          endDateId={'endDate'}
          numberOfMonths={smallDevice ? 1 : 2}
          orientation={HORIZONTAL_ORIENTATION}
          readOnly
          displayFormat={this.props.displayFormat || 'MM/DD/YY'}
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: ${colors.background.inputs};
  border-bottom: 1px solid #576574;
  border-radius: 5px 5px 0px 0px;

  &.disabled {
    opacity: 50%;
  }

  & {
    .date-label-wrapper {
      display: flex;
      font-size: 12px;
      color: #8395a7;
      line-height: 16px;
      padding: 7px 12px 0;
      min-height: 23px;
      .date-label {
        flex-basis: 50%;
      }

      .end-date {
        text-align: right;
        margin-right: 23px;

        &[for='END DATE'] {
          margin-right: 32px;
        }
        &[for='CLOSE DATE'] {
          margin-right: 20px;
        }
      }
    }
    .DateRangePickerInput {
      display: flex;
      justify-content: space-between;
      background: none;
      border: none;
    }
    .DateInput,
    .DateInput_input {
      background: none;
    }
    .DateInput_input {
      font-size: 16px;
      font-family: 'IBMPlexSans-Regular';
      padding: 0 12px 7px;
      color: rgb(17, 24, 31);
    }
    .DateInput_input__focused {
      border-color: ${colors.primary};
    }
    .DateInput_input[aria-label='CHECK OUT'],
    .DateInput_input[aria-label='END DATE'],
    .DateInput_input[aria-label='CLOSE DATE'] {
      text-align: center;
    }
    .DateInput_input[aria-label='END DATE'] {
      text-align: center;
    }
    .DateInput_input[aria-label='CLOSE DATE'] {
      text-align: center;
    }
    .DateRangePickerInput_arrow {
      position: absolute;
      bottom: 40%;
      left: 45%;

      .DateRangePickerInput_arrow_svg {
        fill: ${colors.text.secondary};
      }
    }
    .CalendarDay__blocked_calendar,
    .CalendarDay__blocked_calendar:active,
    .CalendarDay__blocked_calendar:hover {
      background: ${colors.white};
      border: 0.5px solid ${colors.background.primary};
      color: #cacccd;
      text-decoration: line-through;
    }
    .CalendarDay__blocked_out_of_range,
    .CalendarDay__blocked_out_of_range:active,
    .CalendarDay__blocked_out_of_range:hover {
      text-decoration: line-through;
    }
    .CalendarDay__today {
      border: 2px solid #10ac84;
    }
    .CalendarDay__selected_span,
    .CalendarDay__hovered_span,
    .CalendarDay__selected_span:active,
    .CalendarDay__selected_span:hover,
    .CalendarDay__hovered_span:hover {
      background: #4cc1a3;
      border: 0.5px solid #4cc1a3;
      color: #fff;
    }
    .CalendarDay__selected,
    .CalendarDay__selected:active,
    .CalendarDay__selected:hover {
      background: #10ac84;
      border-color: #10ac84;
      color: #fff;
      text-decoration: none;
    }
    .DayPickerKeyboardShortcuts_show {
      display: none;
    }
    .DateInput_input__disabled {
      font-style: normal;
    }
  }
`;

export default DateRangePickerWrapper;
