//@flow
import React from 'react';
import styled from 'styled-components';
import moment, { Moment } from 'moment';
import { capitalize } from '@material-ui/core';

import { headingFive, headingTwo } from '../../../../styles/Typography';
import { displayFlex, doMediaQuery } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';
import Electric from '../../../../assets/img/icons/Electric.png';
import Water from '../../../../assets/img/icons/Water.png';
import Sewer from '../../../../assets/img/icons/Sewer.png';
import type { EventType } from '../../../../queries/Renter/EventForOrderCreate';
import PhoneLink from '../../../../components/Links/PhoneLink';

export type SummaryPropsType = {|
  addOns: { [index: string]: string },
  className?: string,
  event: EventType,
  hideHeader?: boolean,
  rvProductId: string | null,
  rv_spot: {
    end?: Moment,
    quantity: number,
    start?: Moment
  },
  showFooter?: boolean,
  stalls: {
    end?: Moment,
    quantity: number,
    start?: Moment
  }
|};

function Summary({ className = '', event, stalls, rv_spot, rvProductId, addOns, hideHeader, showFooter }: SummaryPropsType): React$Element<'div'> {
  const { venue, checkOutTime, checkInTime, addOnProducts = [], rvProducts = [] } = event;

  const selectedRvProduct = rvProducts.find(({ id }) => id === rvProductId);

  const addOnItems: {
    description: string,
    key: string,
    title: string
  }[] = addOnProducts
    .filter(product => addOns[product.id])
    .reduce((acc, product) => {
      const selected = addOns[product.id];
      if (Number(selected) > 0) {
        const plural = Number(selected) > 1 ? 's' : '';
        const addOnName = product.addOn ? product.addOn.name : '';
        const unitName = product.addOn ? product.addOn.unitName : '';
        const addPlural = (str: string): string => (str.match(/s$/i) ? str : str + plural);
        acc.push({
          key: 'item-' + (!!product && product.name ? product.name : ''),
          title: addPlural(addOnName),
          description: `${selected} ${addPlural(unitName)} of ${addPlural(addOnName)}`
        });
      }

      return acc;
    }, []);

  const formatDate = (date?: Moment): string => (date ? date.format('ddd, MMM D, YYYY') : '');

  const formatTime = (time: string): string => {
    const timeObj = moment(time, 'hh:mm:ss');
    if (timeObj.format('mm') === '00') {
      return timeObj.format('ha');
    }
    return timeObj.format('h:mma');
  };

  return (
    <div className={`${className} summary-container`}>
      <div className="summary-row">
        {!hideHeader && <h2>Reservation Summary</h2>}

        <div className={'summary-col'}>
          <div className={'summary-item'}>
            <h5>Event</h5>
            {event.name}
          </div>

          <div className={'summary-item'}>
            <h5>Location</h5>
            {venue.name} <br />
            {venue.street} {venue.street2}
            <br />
            {venue.city}, {venue.state} {venue.zip}
          </div>
        </div>

        <div className={'summary-col'}>
          <div className={'summary-item last-item'}>
            <h5>Venue</h5>
            {venue.description}
          </div>
        </div>
      </div>

      {stalls.quantity > 0 && (
        <>
          <div className={'divider'} />

          <div className="summary-row">
            <h2>Stall Summary</h2>
            <div className={'summary-item'}>
              <h5>Check In</h5>
              {formatDate(stalls.start)} • After {formatTime(checkInTime)}
            </div>
            <div className={'summary-item'}>
              <h5>Number Of Stalls</h5>
              {stalls.quantity} Stall{stalls.quantity > 1 && 's'}
            </div>
            <div className={'summary-item next-row'}>
              <h5>Check Out</h5>
              {formatDate(stalls.end)} • By {formatTime(checkOutTime)}
            </div>
          </div>
        </>
      )}

      {selectedRvProduct && (
        <>
          <div className={'divider'} />

          <div className="summary-row">
            <h2>RV Spot Summary</h2>
            <div className={'summary-item'}>
              <h5>Check In</h5>
              {formatDate(rv_spot.start)} • After {formatTime(checkInTime)}
            </div>

            <div className={'summary-item col2'}>
              <h5>Number Of Spots</h5>
              {rv_spot.quantity} Spot{rv_spot.quantity > 1 && 's'}
            </div>

            <div className={'summary-item col2'}>
              <h5>Spot Type</h5>
              {selectedRvProduct.name || selectedRvProduct.rvLot.name}
            </div>

            <div className={'summary-item next-row'}>
              <h5>Check Out</h5>
              {formatDate(rv_spot.end)} • By {formatTime(checkOutTime)}
            </div>

            <div className={'summary-item next-row'}>
              <h5>Amenities</h5>
              {selectedRvProduct.rvLot.power != '0' && (
                <span className={'amenity'}>
                  <img src={Electric} alt="electric" />
                  Electric
                </span>
              )}
              {selectedRvProduct.rvLot.water && (
                <span className={'amenity'}>
                  <img src={Water} alt="water" />
                  Water
                </span>
              )}
              {selectedRvProduct.rvLot.sewer && (
                <span className={'amenity'}>
                  <img src={Sewer} alt="sewer" />
                  Sewer
                </span>
              )}
            </div>
          </div>
        </>
      )}

      {addOnItems.length > 0 && (
        <>
          <div className={'divider'} />

          <div className="summary-row">
            <h2>Add Ons</h2>
            {addOnItems.map(({ description, key, title }, index) => {
              return (
                <div key={key} className={`summary-item ${index >= 2 ? 'next-row' : ''}`}>
                  <h5>{capitalize(title)}</h5>
                  {description}
                </div>
              );
            })}
          </div>
        </>
      )}

      {showFooter && (
        <>
          <div className={'divider'} />

          <div className={'summary-footer'}>
            If you need to cancel or make changes to your reservation, please contact <br />
            {venue.name} at <PhoneLink phone={venue.phone} />
          </div>
        </>
      )}
    </div>
  );
}

export default styled(Summary)`
  &.summary-container {
    font-size: 16px;

    h2 {
      ${headingTwo}
      font-size: 22px;
      margin: 0 0 25px;
      font-family: 'IBMPlexSans-Bold';
    }

    h5 {
      ${headingFive}
      font-size: 16px;
      margin: 0 !important;
      font-family: 'IBMPlexSans-Bold';
    }

    .summary-row {
      width: 100%;
      ${displayFlex}
      flex-flow: column nowrap;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        flex-flow: row wrap;
      `
      )}

      h2 {
        width: 100%;
      }
    }

    .summary-col {
      width: 100%;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        width: 50%;
      `
      )}
      ${displayFlex}
      flex-flow: column nowrap;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        .summary-item:not(:first-child) {
          margin-top: 25px;
        }
      `
      )}

      .summary-item {
        width: 100%;
      }
    }

    && .last-item {
      margin-bottom: 0px;
    }

    .summary-item {
      min-width: 100%;
      margin-bottom: 20px;
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        min-width: unset;
        width: 50%;
        margin-bottom: 0;
      `
      )}
    }

    .next-row {
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        margin-top: 25px;
      `
      )}
    }

    .col2 {
      ${doMediaQuery(
        'SMALL_TABLET_WIDTH',
        `
        width: 25%;
        margin-bottom: 0;
      `
      )}
    }

    .divider {
      display: block;
      background: ${colors.text.lightGray};
      height: 1px;
      width: 100%;
      margin: 25px 0;
    }

    .amenity {
      margin: 0 25px 0 0;
      img {
        height: 16px;
        margin-right: 10px;
        position: relative;
        top: 0px;
      }
    }

    .summary-footer {
      text-align: center;

      a {
        text-decoration: none;
        cursor: pointer;
        color: ${colors.border.tertiary};

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
`;
