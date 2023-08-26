import React from 'react';

import { HeadingOne } from '../../components/Headings';
import EventCard from './EventCard';
import { HeadingTwo } from 'Components/Headings';
import osLogo from '../../assets/img/oslogo.png';
import { CardListContainer, FlexWrapper, RentableEventStyles } from './RentableEventStyles';

export const EmptyRenters = props => {
  return (
    <div className={`${props.className.className || ''}__empty-list`}>
      <img src={osLogo} alt="horse logo" />
      <HeadingTwo id="green-banner" label="Coming soon" />
      <p>More events &amp; venues</p>
    </div>
  );
};

const AvailableEventList = props => {
  const { className, data = [] } = props;

  const renderEventCard = () => {
    return data.reduce((acc, curr) => {
      if (!curr.id) return acc;
      const eventCard = <EventCard event={curr} className={className} key={`renter-event-card-${curr.id}`} />;
      acc.push(eventCard);
      return acc;
    }, []);
  };

  const renderEventList = () => {
    return (
      <>
        <FlexWrapper>
          <HeadingOne className={`${className}__Header`} label={props.noTitle ? undefined : 'Events'} />
        </FlexWrapper>
        {renderEventCard()}
      </>
    );
  };

  return <CardListContainer>{data.length === 0 ? <EmptyRenters className={className} /> : renderEventList()}</CardListContainer>;
};

export default RentableEventStyles(AvailableEventList);
