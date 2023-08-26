import React, { Component } from 'react';

import { isEmpty } from '../../../helpers';

const withDetailsActions = ComposedComponent => {
  return class WithDetailsActions extends Component {
    getEventName = eventLabels => {
      if (isEmpty(event)) return '';
      const match = eventLabels.find(option => option.value == event.id);
      return match.value;
    };

    setNumberOfStalls = (value, reservationType, stalls) => {
      const re = /^[0-9\b]+$/;
      if (value === '' || re.test(value)) {
        this.props.dispatch(this.props.actions.setNumberOfStalls(value));
        this.resetNightlyDates(value, reservationType, stalls);
      }
    };

    resetNightlyDates = (value, reservationType, stalls) => {
      if (reservationType === 'nightly' && value !== stalls) {
        this.props.dispatch(this.props.actions.setDateRange({ from: null, to: null }));
      }
    };

    updateEventSelection = events => e => {
      if (e.target) {
        const { value } = e.target;
        const match = events.find(event => event.id === value);
        this.setNumberOfStalls(0);
        return this.props.dispatch(this.props.actions.setEvent(match));
      }
      return this.props.dispatch(this.props.actions.setEvent({}));
    };

    setDateRange = range => {
      this.props.dispatch(this.props.actions.setDateRange(range));
    };

    setReservationType = value => {
      this.props.dispatch(this.props.actions.setReservationType(value));
    };

    render() {
      return (
        <ComposedComponent
          {...this.props}
          setDateRange={this.setDateRange}
          updateEventSelection={this.updateEventSelection}
          resetNightlyDates={this.resetNightlyDates}
          setNumberOfStalls={this.setNumberOfStalls}
          getEventName={this.getEventName}
          setReservationType={this.setReservationType}
        />
      );
    }
  };
};

export default withDetailsActions;
