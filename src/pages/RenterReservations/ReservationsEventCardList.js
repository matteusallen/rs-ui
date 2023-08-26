import React from 'react';
import { HeadingFour } from 'Components/Headings';
import BookButton from 'Components/Button/BookButton';
import { FlexWrapper } from '../../containers/RenterEvents/RentableEventStyles';
import { Link } from 'react-router-dom';
import { EventCard } from '../../containers/Event/Shared/Cards/EventCard';
import { eventDateParser } from 'Helpers/eventDateParser';

const EventCardList = ({ orders, header }) => {
  return (
    <>
      {header && (
        <FlexWrapper>
          <HeadingFour className="separation-header" label={header} />
        </FlexWrapper>
      )}

      {orders.map(order => (
        <EventCard key={order.id}>
          <div className="event-card-container">
            <div className="event-card-dates">
              <div className="date-range-container">{`${eventDateParser(order.event)} • ${order.event.venue.city}, ${order.event.venue.state}`}</div>
              <HeadingFour label={order.event.name} />
            </div>
            <div className={'book-button-container'}>
              <Link to={`reservation/details/${order.id}`} className={'book-button-link'}>
                <BookButton dataTestId={`view-details-${order.id}`} label={'VIEW DETAILS'} />
              </Link>
            </div>
          </div>
        </EventCard>
      ))}
    </>
  );
};

export default EventCardList;
