//@flow
import React, { useCallback, useRef } from 'react';
import { CardListContainer, RentableEventStyles } from './RentableEventStyles';
import EventCard from './EventCard';
import IndeterminateLoading from '../../components/Loading/IndeterminateLoading';
import osLogo from '../../assets/img/oslogo.png';
import { HeadingTwo } from 'Components/Headings';

type MobileInfiniteListPropsType = {|
  className?: string,
  events?: [],
  loadMoreItems: () => void,
  hasMoreRecords: boolean,
  isLoading?: boolean,
  limit: number,
  searchText: string
|};

const MobileInfiniteList = ({ className = '', events = [], isLoading, hasMoreRecords, loadMoreItems, searchText }: MobileInfiniteListPropsType) => {
  const ref = useRef();

  const renderEmptyEvents = () => {
    return searchText?.length > 2 ? (
      <div className={`${className}__no-results-container`}>
        <p className="no-reservations">
          No results for <b>"{searchText}"</b>
        </p>
        <p className="no-reservations">You may want to try using different keywords or checking for typos</p>
      </div>
    ) : (
      <div className={`${className}__empty-list`}>
        <img src={osLogo} alt="horse logo" />
        <HeadingTwo id="green-banner" label="Coming soon" />
        <p>More events &amp; venues</p>
      </div>
    );
  };

  const lastElementReference = useCallback(node => {
    if (isLoading) return;
    if (ref.current) ref.current.disconnect();
    ref.current = new IntersectionObserver(entries => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMoreRecords) {
        loadMoreItems();
      }
    });
    if (node) ref.current.observe(node);
  });
  return (
    <>
      <CardListContainer>
        {events.length === 0 ? (
          renderEmptyEvents()
        ) : (
          <>
            {events.map((event, index) => {
              return (
                <EventCard
                  getReference={events.length && index + 1 === events.length ? lastElementReference : undefined}
                  event={event}
                  className={className}
                  key={`renter-event-card-${event.id}`}
                />
              );
            })}
            {isLoading && (
              <div className={className + '__loader'}>
                <IndeterminateLoading />
              </div>
            )}
          </>
        )}
      </CardListContainer>
    </>
  );
};

export default RentableEventStyles(MobileInfiniteList);
