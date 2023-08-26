import React from 'react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import FormCard from '../../components/Cards/FormCard';
import BookButton from '../../components/Button/BookButton';
import { formatPhoneNumber } from '../../helpers/formatPhoneNumber';
import { HeadingTwo } from '../../components/Headings';
import { displayFlex, BIG_TABLET_WIDTH, SMALL_TABLET_WIDTH } from '../../styles/Mixins';
import colors from '../../styles/Colors';
import DividerImg from '../../assets/img/divider.png';
import RvBlueIcon from '../../assets/img/icons/RV_blue.png';
import HorseshoeBlueIcon from '../../assets/img/icons/Horseshoe_blue.png';
import RvGreyIcon from '../../assets/img/icons/RV_grey.png';
import HorseshoeGreyIcon from '../../assets/img/icons/Horseshoe_grey.png';
import { eventDateParser } from '../../helpers/eventDateParser';

const EventCardBase = ({ className, event, style, getReference }) => {
  const eventOpenDate = moment(event.openDate).format('MM/DD/YYYY HH:mm:ss');
  const eventCloseDate = moment(event.closeDate).format('MM/DD/YYYY HH:mm:ss');
  const currentTime = moment().format('MM/DD/YYYY HH:mm:ss');

  const renderStallsPrice = () => {
    if (event.stallProducts.length == 0 || (event.stallSoldOut && moment(currentTime).isAfter(eventOpenDate))) {
      return (
        <>
          <img src={HorseshoeGreyIcon} alt="Grey Horseshoe Icon" />
          <span className="disabled-text">
            <strong>Stalls</strong> {event.stallProducts.length !== 0 ? 'Sold Out' : 'Unavailable'}
          </span>
        </>
      );
    }

    const priceToShow =
      event.stallProducts.length &&
      event.stallProducts.reduce(function(prev, current) {
        if (+current.price < +prev.price) {
          return current;
        } else {
          return prev;
        }
      });

    let message = '';
    if (!priceToShow.nightly) {
      const startDate = moment(priceToShow.startDate);
      const endDate = moment(priceToShow.endDate);
      const nights = Math.abs(startDate.diff(endDate, 'days'));
      message = nights + ' night' + (nights > 1 ? 's' : '');
    } else {
      message = 'night';
    }

    return (
      <>
        <img src={HorseshoeBlueIcon} alt="Blue Horseshoe Icon" />
        <strong>Stalls</strong> <span className="small-text">from</span> ${priceToShow.price} / {message}
      </>
    );
  };

  const renderRvsPrice = () => {
    if (event.rvProducts.length == 0 || (event.rvSoldOut && moment(currentTime).isAfter(eventOpenDate))) {
      return (
        <>
          <img src={RvGreyIcon} alt="Grey RV Icon" />
          <span className="disabled-text">
            <strong>RV Spots</strong> {event.rvProducts.length !== 0 ? 'Sold Out' : 'Unavailable'}
          </span>
        </>
      );
    }

    const priceToShow = event.rvProducts?.reduce(function(prev, current) {
      if (+current.price < +prev.price) {
        return current;
      } else {
        return prev;
      }
    });

    let message = '';
    if (!priceToShow.nightly) {
      const startDate = moment(priceToShow.startDate);
      const endDate = moment(priceToShow.endDate);
      const nights = Math.abs(startDate.diff(endDate, 'days'));
      message = nights + ' night' + (nights > 1 ? 's' : '');
    } else {
      message = 'night';
    }

    return (
      <>
        <img src={RvBlueIcon} alt="Blue RV Icon" />
        <strong>RV Spots</strong> <span className="small-text">from</span> ${priceToShow.price} / {message}
      </>
    );
  };

  const getTestIdSuffix = event => {
    return event?.name?.includes('Automation') ? 'automation' : `${event?.id}`;
  };

  const renderBookingOptions = () => {
    return (
      <div className={`${className}__book-container`}>
        {!event.stallSoldOut && (
          <div>
            <Link to={`reservation/${event.id}/stalls`} className={`${className}__book-link`}>
              <BookButton dataTestId={`book-now-${getTestIdSuffix(event)}`} label={'BOOK NOW'} />
            </Link>
          </div>
        )}
        {event.stallSoldOut && !event.rvSoldOut && (
          <div>
            <Link to={`reservation/${event.id}/rvs`} data-testid={`book-rv-${getTestIdSuffix(event)}`} className={`${className}__rv-link onlyRvs`}>
              <BookButton dataTestId={`book-rv-${getTestIdSuffix(event)}`} label={'Book RV spot only'} />
            </Link>
          </div>
        )}
        {event.stallSoldOut && event.rvSoldOut && <div className="disabled-button">Sold Out</div>}
      </div>
    );
  };

  const renderBooking = () => {
    if (moment(currentTime).isBefore(eventOpenDate)) {
      return (
        <>
          <div className={`${className}__price-container`}>
            <p className={`${className}__stalls-price`}>{renderStallsPrice(event)}</p>
            <p className={`${className}__rv-price`}>{renderRvsPrice(event)}</p>
          </div>
          <div>
            <div className="disabled-button coming-soon">Coming Soon</div>
            <p className="coming-soon-text">Reserve starting {moment(eventOpenDate).format('MMM D, YYYY')}</p>
          </div>
        </>
      );
    }

    if (moment(eventCloseDate).isBefore(currentTime)) {
      return (
        <>
          <div className={`${className} book-closed-container`}>
            <div className="disabled-button">Online Reservations Closed</div>
            <p>
              Contact the venue at <span>{formatPhoneNumber(event.venue.phone)}</span> to make a reservation.
            </p>
          </div>
        </>
      );
    }
    return (
      <>
        <div className={`${className}__price-container`}>
          <p className={`${className}__stalls-price`}>{renderStallsPrice(event)}</p>
          <p className={`${className}__rv-price`}>{renderRvsPrice(event)}</p>
        </div>
        {renderBookingOptions()}
      </>
    );
  };

  return (
    <Card key={`${event.id}`} style={style} className={`${className}__event-card`}>
      <div className={`${className}__heading-line-clamp`} ref={getReference}>
        <div className={`${className}__date-range-container`}>{`${eventDateParser(event)} • ${event.venue.name} • ${event.venue.city}, ${
          event.venue.state
        }`}</div>
        <HeadingTwo label={`${event.name}`} styles={{ lineHeight: '35px !important' }} title={event.name} />
      </div>
      <div className={`${className}__price-book-container`}>{renderBooking()}</div>
    </Card>
  );
};

export const Card = styled(FormCard)`
  &&&& {
    height: 150px;
    box-sizing: border-box;
    padding: 15px 25px;
    display: flex;

    &&&& h2 {
      font-size: 1.45rem;
    }

    &.empty {
      height: 318px;
    }
    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: column;
      height: auto;
      padding: 25px;
    }
  }
`;

const EventCard = styled(EventCardBase)`
  &__heading-line-clamp {
    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
      width: 53%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;

      h2 {
        display: -webkit-box;
        padding-right: 20px;
        overflow: hidden;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;

        @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
          font-size: 1.35rem;
        }
      }
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: column;
      width: 100%;
      margin-bottom: 6px;
    }
  }

  &__date-range-container {
    color: #8093a5;
    text-transform: uppercase;
    font-family: 'IBMPlexSans-Bold';
    letter-spacing: 0.62px;

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      font-size: 14px;
    }
  }

  &__loading-container {
    ${displayFlex}
    align-items: center;
    justify-content: center;
    width: 40%;

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: column;
      width: 100%;
      padding: 0;
    }
  }

  &__price-book-container {
    ${displayFlex}
    flex-direction: row;
    justify-content: space-between;
    width: 47%;

    .disabled-text {
      color: #4d5c6c;
    }

    div.disabled-button {
      background: #e0e7ef;
      border-radius: 3px;
      padding: 12px 16px 7px 16px;
      display: flex;
      font-size: 1rem;
      text-transform: uppercase;
      color: #4d5c6c;
      width: max-content;
      align-self: flex-end;
      padding-top: 13px;
      height: 46px;

      @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
        width: 100%;
      }
      &.coming-soon {
          height: 46px;
          width: 200px;
          border-radius: 3px
          align-items: center;
          justify-content: center;
          align-self: flex-end;
          padding-top: 6px;
          margin-top: 10px;


          @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
            width: auto;
          }
        }
      }
      .coming-soon-text {
        font-size: 16px;
        white-space: nowrap;
        text-align: center;
      }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: column;
      width: 100%;
      padding: 0;
    }
  }

  &.book-closed-container {
    text-align: right;
    width: 100%;
    min-height: 80px;
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    background: url(${DividerImg}) center left no-repeat;

    p {
      font-size: 16px;
      margin: 7px 0;

      span {
        color: ${colors.secondary};
      }
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: column-reverse;
      text-align: left;
      background: none;

      div {
        width: 100%;
        flex-flow: column;
        text-align: center;
      }
    }
  }

  &__price-container {
    background: url(${DividerImg}) center left no-repeat;
    padding-left: 60px;
    justify-content: space-between;
    display: flex;
    flex-direction: column;
    justify-content: center;

    p {
      font-size: 16px;
      margin: 6px 14px;

      img {
        width: 18px;
        display: inline-block;
        margin-right: 8px;
        position: relative;
        top: 2px;

        @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
          display: block;
          margin: 0px auto 6px auto;
        }
      }
      .small-text {
        font-size: 12px;

        @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
          display: block;
          margin: 0px auto;
          position: relative;
          margin-top: -12px;
        }
      }
      strong {
        font-family: 'IBMPlexSans-Bold';
        letter-spacing: 0.7px;

        @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
          display: block;
          margin-bottom: 12px;
        }
      }

      @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
        text-align: center;
        width: 135px;
      }
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      flex-direction: row;
      margin: 5px 0;
      padding-left: 0;
      background-position-x: center;
      background-position-y: center;
    }
  }

  &__stalls-price {
  }

  &__book-container {
    display: flex;
    flex-direction: column;
    justify-content: center;

    &&& .disabled-button {
      width: 200px;
      justify-content: center;

      @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
        width: 100%;
      }
    }

    div {
      text-align: center;
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      margin-top: 12px;
    }
    .onlyRvs {
      margin-top: 0;
    }
  }

  &__rv-link {
    color: ${colors.secondary};
    text-decoration: none;
    display: block;
    text-align: center;
    margin-top: 20px;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1.05px;
  }

  &.book-link {
    text-decoration: none;
  }
`;

export default EventCard;
