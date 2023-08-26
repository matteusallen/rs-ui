//@flow
import React from 'react';
import styled from 'styled-components';
import { capitalize } from '@material-ui/core';
import { AccessTime, Today, LocationOn } from '@material-ui/icons';
import PhoneIcon from '../../../../assets/img/icons/phone.svg';

import FormCard from '../../../../components/Cards/FormCard';
import PhoneLink from '../../../../components/Links/PhoneLink';
import { headingFive, paragraphReg } from '../../../../styles/Typography';
import colors from '../../../../styles/Colors';
import useEventDetailsHook from './useEventDetailsHook';
import { formatTime } from '../../../../helpers';
import { displayFlex, doMediaQuery } from '../../../../styles/Mixins';

const EventDetails = ({ className = '' }: {| className?: string |}) => {
  const {
    eventName,
    venueCity,
    venueState,
    venueName,
    venuePhone,
    eventLocation,
    eventDescription,
    checkInTime,
    checkOutTime,
    venueMap
  } = useEventDetailsHook();

  return (
    <FormCard className={`${className} event-details-card`}>
      <div className={'container'}>
        <div className={'event-name'}>{capitalize(eventName)}</div>
        <div className={'event-date'}>
          <p>
            <LocationOn /> {venueCity}, {venueState} • {venueName}
            {venueMap && ' • '}
            {venueMap && (
              <a href={venueMap.url} target="_blank" className="map-download">
                Download Venue Map
              </a>
            )}
          </p>
          <p>
            <Today /> {eventLocation}
          </p>
          {venuePhone && (
            <p>
              <img src={PhoneIcon} alt="phone icon" className={'phone-icon'} /> <PhoneLink phone={venuePhone} />
            </p>
          )}
        </div>
        <div className={'event-description'}>{eventDescription}</div>
        <div className={'event-checkin-checkout-time'}>
          <div>
            <AccessTime /> <strong>Check in</strong>
            {` after ${formatTime(checkInTime)}`}
          </div>
          <div>
            <AccessTime /> <strong>Check out</strong>
            {` by ${formatTime(checkOutTime)}`}
          </div>
        </div>
      </div>
    </FormCard>
  );
};

const EventDetailsStyled = styled(EventDetails)`
  &&&.event-details-card {
    ${paragraphReg}
    font-size: 16px;
    color: ${colors.text.primary};

    .container {
      padding: 0px;
      ${displayFlex}
      flex-direction: column;
    }

    .map-download {
      font-size: 16px;
      color: ${colors.text.darkBlue};
      text-decoration: underline;
    }

    .event-name {
      ${headingFive}
      font-size: 25px;
    }

    .event-date {
      margin: 15px 0 20px;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin: 25px 0;
      `
      )}
      color: ${colors.text.lightGray2};
      font-family: 'IBMPlexSans-Bold';
      letter-spacing: 0.7px;

      p {
        font-family: 'IBMPlexSans-Bold';
        margin: 0;
      }
      svg {
        position: relative;
        top: 8px;
      }
      .phone-icon {
        top: 5px;
        height: 20px;
        margin-left: 2px;
        position: relative;
      }
    }

    .event-description {
      margin: 0 0 20px 0;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin: 0 0 25px 0;
      `
      )}
    }

    .event-checkin-checkout-time {
      ${displayFlex}
      flex-direction: column;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        flex-direction: row;
        justify-context: flex-start;
      `
      )}

      svg {
        color: ${colors.primary};
        position: relative;
        top: 6px;
      }
      strong {
        font-family: 'IBMPlexSans-Bold';
      }
      div {
        ${doMediaQuery(
          'SMALL_TABLET_WIDTH',
          `
          padding-left: 50px;
        `
        )}
      }
      div:first-child {
        ${doMediaQuery(
          'SMALL_TABLET_WIDTH',
          `
          padding-left: 0px;
        `
        )}
      }
    }
  }
`;

export default EventDetailsStyled;
