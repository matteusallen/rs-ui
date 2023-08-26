// @flow
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import moment from 'moment';

import { HeadingFour } from '../../../../components/Headings';
import { FormSelect } from '../../../../components/Select';

import { isEmpty } from '../../../../helpers';

import { UPCOMING_VENUE_EVENTS } from '../../../../queries/Admin/UpcomingVenueEvents';

import { withUserContext } from '../../../../store/UserContext';

import colors from '../../../../styles/Colors';
import { paragraphReg } from '../../../../styles/Typography';

const EventSelectionBase = props => {
  const { className, user: adminUser } = props;
  const { setFieldValue, values } = useFormikContext();
  const { event, reservationEdit } = values;

  const [getCurrentVenueEvents, { data, error, loading }] = useLazyQuery(UPCOMING_VENUE_EVENTS, {
    variables: {
      filterBy: {
        endDate: moment()
          .format('YYYY-MM-DD')
          .toString()
      }
    },
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (!!adminUser && !!adminUser.venues) {
      getCurrentVenueEvents();
    }
  }, [adminUser]);

  if (error) return 'Error retrieving events';
  if (loading) return 'Loading...';

  let availableEventLabels = [];
  if (data) {
    const { venue } = data;
    if (reservationEdit) {
      availableEventLabels = [{ value: event.id, label: event.name }];
    } else {
      availableEventLabels = venue.events.map(event => {
        return { value: event.id, label: event.name };
      });
    }
  }

  const getEventName = eventLabels => {
    if (isEmpty(event)) return '';
    const match = eventLabels.find(option => option.value === event.id) || {};
    return match.value;
  };

  const getSelectedEvent = eventId => {
    const selectedEvent = data.venue.events.filter(event => event.id === eventId);
    return selectedEvent[0];
  };

  const setEvent = id => {
    const selectedEvent = getSelectedEvent(id);
    setFieldValue('event', selectedEvent);
  };

  const availableEventList = {
    cb: e => setEvent(e.target.value),
    disabled: reservationEdit,
    label: 'EVENT',
    options: availableEventLabels,
    selectedOption: event ? event.id : '',
    type: 'select',
    value: getEventName(availableEventLabels),
    emptyListMessage: 'No current events'
  };

  return (
    <>
      <HeadingFour label={'Reservation Details'} />
      <FormSelect
        className={`${className}__available-events` + (reservationEdit ? ` ${className}__available-events--disabled` : '')}
        {...availableEventList}
        key={reservationEdit ? null : availableEventList.label}
      />
    </>
  );
};

const EventSelection = styled(EventSelectionBase)`
  &__available-events {
    ${paragraphReg}
    color: rgb(0, 0, 0);
    font-size: 0.9375rem;
    line-height: 24px;
    margin: 20px 0;
    padding: 13px 0 0;
    background-color: ${colors.background.primary} !important;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    &::placeholder {
      color: ${colors.text.secondary};
    }
    &--disabled {
      opacity: 0.5;
    }
    &&& {
      label[class^='MuiInputLabel-formControl'],
      label[class*='MuiInputLabel-formControl'] {
        top: -13px;
      }
      svg[class^='MuiSelect-icon'],
      svg[class*='MuiSelect-icon'] {
        top: -2px;
      }
    }
    &&& {
      label[class^='MuiFormLabel-filled'],
      label[class*='MuiFormLabel-filled'] {
        top: -12px;
      }
      div[class^='MuiSelect-selectMenu'],
      div[class*='MuiSelect-selectMenu'] {
        margin-bottom: 15px;
      }
    }
  }
`;

export default withUserContext(EventSelection);
