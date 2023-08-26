import React, { useState, useEffect } from 'react';
import { useQuery, useLazyQuery } from '@apollo/react-hooks';
import moment from 'moment';
import colors from '../../styles/Colors';
import { HeadingOne } from '../../components/Headings';
import styled from 'styled-components';
import { CURRENT_RENTABLE_EVENTS_HOMEPAGE } from '../../queries/Renter/CurrentRentableEventsHomePage';
import { RENTABLE_EVENTS_BY_NAME_OR_CITY } from '../../queries/Renter/RentableEventsByNameOrCity';
import InfiniteRentableEventsList from './InfiniteRentableEventsList';
import { displayFlex, doMediaQuery } from '../../styles/Mixins';
import IndeterminateLoading from '../../components/Loading/IndeterminateLoading';
import RentableEventsList from './RentableEventsList';
import useWindowSize from '../../helpers/useWindowSize';
import MobileInfiniteList from './MobileInfiniteList';
import AsyncTypeahead from 'Components/Typeahead/AsyncTypeahead';

function RenterEventsQuery(props) {
  const { limit, noTitle, infiniteScroll } = props;
  const [hasMoreRecords, setHasMoreRecords] = useState(true);
  const [searchText, setSearchText] = useState('');
  const { isMobile } = useWindowSize();

  const { loading, data: rawEvents, error, fetchMore } = useQuery(CURRENT_RENTABLE_EVENTS_HOMEPAGE, {
    variables: {
      orderBy: ['endDate', 'ASC'],
      filterBy: {
        createdAt: '2020-10-07 00:00:00' //change createdAt to 2020-10-07 00:00:00-05 in db to show event on homepage
      },
      limit: limit,
      offset: 0
    },
    fetchPolicy: 'network-only'
  });

  const [searchEvents, { data: searchedEvents, error: searchError, loading: searchLoading, fetchMore: searchFetchMore }] = useLazyQuery(
    RENTABLE_EVENTS_BY_NAME_OR_CITY,
    {
      variables: {
        input: { name: searchText?.slice(0, 12) || '', limit, offset: 0 }
      },
      fetchPolicy: 'network-only'
    }
  );

  useEffect(() => {
    if (searchText?.length > 2) searchEvents();
  }, [searchText]);

  const exactMatch = searchedEvents?.searchEvents.find(event => event.name.toLowerCase() === searchText?.toLowerCase());

  const typeaheadMap = {};

  searchedEvents?.searchEvents.forEach(event => {
    typeaheadMap[event.name] = true;
    typeaheadMap[event.venue.city] = true;
  });

  const typeaheadOptions = Object.keys(typeaheadMap);

  const handleSearch = val => {
    setSearchText(val);
  };

  if (!rawEvents && !searchedEvents) return <IndeterminateLoading />;
  if (error || searchError) {
    // eslint-disable-next-line
    console.error(error);
    return `Error! ${error || searchError}`;
  }
  const events = searchText?.length > 2 && searchedEvents ? (exactMatch ? [exactMatch] : searchedEvents.searchEvents) : rawEvents.events;

  const itemCount = hasMoreRecords ? events.length + 1 : events.length;

  const isItemLoaded = index => !hasMoreRecords || index < events.length;

  const loadMoreItems = () => {
    if (!hasMoreRecords || events.length % limit) {
      return;
    }
    const offset = Math.ceil(events.length / limit) * limit;

    const variables =
      searchText?.length > 2
        ? { name: searchText, limit, offset }
        : {
            orderBy: ['endDate', 'ASC'],
            filterBy: {
              endDate: moment.utc().format('YYYY-MM-DD')
            },
            limit,
            offset
          };

    const fetchMoreVariables = {
      variables,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          setHasMoreRecords(false);
          return prev;
        }
        const newData = searchText?.length > 2 ? fetchMoreResult.searchevents : fetchMoreResult.events;
        if (newData.length === 0) {
          setHasMoreRecords(false);
          return prev;
        }
        if (newData.length < limit) {
          setHasMoreRecords(false);
        }
        const previousData = searchText?.length > 2 ? prev.searchevents : prev.events;
        const newResult = {
          events: [...previousData, ...newData],
          __typename: 'Event'
        };

        if (JSON.stringify(newData) === JSON.stringify(previousData.slice(Math.max(previousData.length - newData.length, 1)))) return prev;
        return newData.length > 0 ? newResult : prev;
      }
    };
    return searchText?.length > 2 ? searchFetchMore(fetchMoreVariables) : fetchMore(fetchMoreVariables);
  };

  const regularList = () => {
    return <RentableEventsList data={events} noTitle={noTitle} />;
  };

  const infiniteList = () => {
    return (
      <>
        <EventListHeader className={`header-container`}>
          <HeadingOne label={props.noTitle ? undefined : 'Events'} />
          <AsyncTypeahead
            className="events"
            options={typeaheadOptions || []}
            searchText={searchText}
            setSearchText={setSearchText}
            placeholder="FIND YOUR EVENT"
            handleSearch={handleSearch}
            loading={searchLoading || loading}
          />
        </EventListHeader>
        <InfiniteRentableEventsList
          searchText={searchText}
          loading={searchLoading || loading}
          data={events}
          noTitle={noTitle}
          fetchMore={searchText?.length > 2 ? searchFetchMore : fetchMore}
          loadMoreItems={loadMoreItems}
          itemCount={itemCount}
          isItemLoaded={isItemLoaded}
        />
      </>
    );
  };

  return !infiniteScroll ? (
    regularList()
  ) : isMobile ? (
    <>
      <EventListHeader className={`header-container`}>
        <AsyncTypeahead
          className="events"
          options={typeaheadOptions || []}
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="FIND YOUR EVENT"
          handleSearch={handleSearch}
          loading={searchLoading || loading}
        />
      </EventListHeader>
      <MobileInfiniteList
        events={events}
        isLoading={searchLoading || loading}
        loadMoreItems={loadMoreItems}
        hasMoreRecords={hasMoreRecords}
        searchText={searchText}
      />
    </>
  ) : (
    infiniteList()
  );
}

const EventListHeader = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  background-color: ${colors.background.primary};
  padding-left: 6px;
  display: flex !important;
  justify-content: space-between !important;
  position: sticky;
  align-items: center !important;
  margin-bottom: 0 !important;
  top: 64px;
  padding: 20px 20px 36px !important;
  z-index: 2;
  width: 100%;

  @media screen and (max-width: 600px) {
    top: 0px;
  }

  .dropdown-menu {
    display: none !important;
  }
  ${doMediaQuery(
    'SMALL_TABLET_WIDTH',
    `
    margin: 0 auto 25px auto;
  `
  )}
  .event-search-bar {
    height: 36px;
    width: 600px;
    background-color: $white;
    border: 1px solid ${colors.border.primary};
    border-radius: 113px;
    border-radius: 24px;
    box-shadow: none;
    position: relative;
    padding-left: 80px;

    @media screen and (max-width: 600px) {
      width: 100%;
    }

    &.is-focused {
      padding-left: 30px;

      & :nth-child(2) {
        left: 0px;
        margin-left: 0px;
      }

      input {
        text-align: left;

        &::placeholder {
          opacity: 0;
        }
      }
    }

    input {
      font: revert;
      padding: inherit;
      text-align: center;

      &::placeholder {
        opacity: 0.6;
      }
    }

    & :nth-child(2) {
      position: absolute;
      color: ${colors.primary};
      left: 50%;
      margin-left: -90px;
      padding: 6px 8px
      transform: scale(1, 1) !important;

    }
    & :nth-child(3) {
      svg {
        fill: ${colors.border.primary};
      }
    }
  }
`;

export default RenterEventsQuery;
