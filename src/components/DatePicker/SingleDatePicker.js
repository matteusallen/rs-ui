// @flow
import React, { Component } from 'react';
import { SingleDatePicker } from 'react-dates';
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import styled from 'styled-components';
import moment, { Moment } from 'moment';
import EventIcon from '@material-ui/icons/Event';

import { omit } from '../../utils/objectHelpers';
import { paragraphReg } from '../../styles/Typography';
import colors from '../../styles/Colors';

type SingleDatePickerPropsType = {|
  cb: ({ date: Moment }) => void,
  disabled: boolean,
  label: string,
  showPast: boolean,
  value: ?Moment
|};

type SingleDatePickerStateType = {|
  focused?: boolean | null
|};

class SingleDatePickerWrapper extends Component<SingleDatePickerPropsType, SingleDatePickerStateType> {
  constructor(props: SingleDatePickerPropsType) {
    super(props);
    this.state = {
      focused: false
    };
  }

  onDateChange = async (date: Moment) => {
    this.props.cb(date);
  };

  onFocusChange = ({ focused }: { focused: boolean }) => {
    this.setState({ focused });
  };

  render() {
    const { focused } = this.state;
    const { showPast } = this.props;

    const datePickerProps = omit(this.props, ['label', 'type', 'plural', 'value', 'cb', 'className', 'showPast']);
    const isOutsideRange =
      showPast !== undefined
        ? {
            isOutsideRange: day => {
              if (showPast) {
                return !showPast;
              }
              const date = moment.utc(day).format('YYYY-MM-DD');
              const today = moment.utc().format('YYYY-MM-DD');

              return moment(date).isBefore(moment(today));
            }
          }
        : {};

    return (
      <Wrapper disabled={this.props.disabled}>
        <SingleDatePicker
          {...datePickerProps}
          {...isOutsideRange}
          id="date_input"
          date={this.props.value}
          focused={focused}
          onDateChange={this.onDateChange}
          onFocusChange={this.onFocusChange}
          customInputIcon={<EventIcon />}
          inputIconPosition="after"
          block={false}
          hideKeyboardShortcutsPanel
          withPortal={false}
          placeholder={this.props.label}
          disabled={this.props.disabled}
          readOnly
        />
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  display: inline-block;
  &&& {
    height: 40px;

    .DateInput {
      width: 180px;
    }
    .DateInput_input {
      ${paragraphReg}
      color: rgb(0, 0, 0);
      font-size: 0.9375rem;
      line-height: 24px;
      padding: 16px 12px 8px;
      background-color: ${colors.background.primary} !important;
      &::placeholder {
        color: ${colors.text.secondary};
      }
    }
    .SingleDatePickerInput {
      background-color: ${colors.background.primary} !important;
      padding: 0 1px;
      border-color: ${props => {
        if (props.focusedInput) {
          return 'rgba(0, 0, 0, 0.87)';
        }
        return 'rgba(0,0,0,0.23)';
      }};
      :hover {
        border-color: rgba(0, 0, 0, 0.87);
      }
      opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    }
    .SingleDatePickerInput__withBorder {
      width: 215px;
      border-radius: 5px 5px 0 0;
      border: none;
      border-bottom: 1px solid #c8d6e5;
      display: inline-flex;
      flex-direction: row-reverse;
    }
    .DateInput_input {
      padding: 6px 10px;
    }
    .DateInput_input__focused {
      border-color: ${colors.secondary};
    }
    .SingleDatePickerInput_arrow_svg {
      fill: ${props => {
        if (props.focusedInput) {
          return colors.secondary;
        }
        return 'rgba(0,0,0,0.23)';
      }};
    }
    .SingleDatePickerInput_calendarIcon {
      margin: 0;
      padding: 8px 9px 0;
      background-color: ${colors.white};
      color: ${colors.primary};
    }
    // Will edit selected date or the endpoints of a range of dates
    .CalendarDay__hovered_span:hover,
    .CalendarDay__hovered_span,
    .CalendarDay__selected_span,
    .CalendarDay__selected {
      background: #10ac84;
      color: white;
    }

    // Will edit when hovered over. _span style also has this property
    .CalendarDay__hovered_span:hover,
    .CalendarDay__hovered_span,
    .CalendarDay__selected_span {
      opacity: 0.87;
      border-color: ${colors.secondary};
    }
    .CalendarMonth,
    .DayPicker_weekHeader {
      font-family: 'IBMPlexSans-SemiBold';
    }
    .DayPickerKeyboardShortcuts_show {
      display: none;
    }
  }
`;

export default SingleDatePickerWrapper;
