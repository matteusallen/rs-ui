import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import ScrollToButton from '../../components/ScrollToButton';
import EventCard from './EventCard';
import { BIG_TABLET_WIDTH, SMALL_TABLET_WIDTH } from '../../styles/Mixins';
import osLogo from '../../assets/img/oslogo.png';
import bannerDesktop from '../../assets/img/banner-desktop.png';
import { eventDateParser } from '../../helpers/eventDateParser';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import { HeadingTwo } from 'Components/Headings';

const offset = 10;

const InfiniteAvailableEventListBase = props => {
  const { className, loadMoreItems, itemCount, isItemLoaded, data, loading, searchText } = props;

  const listRef = React.createRef();
  const [visibleStart, setVisibleStart] = useState(1);

  const scrollTo = () => {
    listRef.current.scrollToItem(0);
  };

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

  const row = useCallback(args => {
    const { index, style } = args;
    if (!isItemLoaded(index)) {
      return <></>;
    }
    const item = data[index];
    const event = {
      ...item,
      id: `${item.id}`,
      name: `${item.name}`,
      dateRange: eventDateParser(item),
      pricePerNight: item.pricePerNight,
      pricePerEvent: item.pricePerEvent,
      rvSoldOut: item.rvSoldOut,
      stallSoldOut: item.stallSoldOut
    };
    return (
      <EventCard
        event={event}
        className={className}
        index={index}
        style={{
          ...style,
          marginLeft: 20,
          marginRight: 20,
          width: 'calc(100% - 40px)',
          top: style.top + offset,
          height: style.height - offset - offset
        }}
      />
    );
  });

  if (loading) return <IndeterminateLoading />;

  const renderEventList = () => {
    return (
      <>
        <div className={`${className}__wrapper-div`}>
          <AutoSizer>
            {({ height, width }) => (
              <InfiniteLoader isItemLoaded={isItemLoaded} itemCount={itemCount} loadMoreItems={loadMoreItems}>
                {({ onItemsRendered }) => (
                  <List
                    height={height}
                    itemCount={itemCount}
                    onItemsRendered={({ visibleStartIndex, visibleStopIndex }) => {
                      setVisibleStart(visibleStartIndex + 1);
                      return onItemsRendered({
                        visibleStartIndex,
                        visibleStopIndex
                      });
                    }}
                    itemSize={150}
                    width={width}
                    ref={listRef}
                    className={`${className}__table`}>
                    {row}
                  </List>
                )}
              </InfiniteLoader>
            )}
          </AutoSizer>
        </div>
        <ScrollToButton
          style={{
            position: 'absolute',
            bottom: 120
          }}
          onClick={scrollTo}
          start={visibleStart}
        />
      </>
    );
  };

  return (
    <>
      <CardListContainer>{data.length === 0 ? renderEmptyEvents() : renderEventList()}</CardListContainer>
    </>
  );
};

const InfiniteAvailableEventList = styled(InfiniteAvailableEventListBase)`
  &__wrapper-div {
    height: calc(100vh - 176px);
  }

  &__table {
    padding-bottom: 40px;
  }

  &__no-results-container {
    text-align: left;
    margin-top: 20px;
    padding-left: 20px;

    p {
      margin: 0;
    }
  }

  &__empty-list {
    margin-top: 130px;
    width: 100%;

    img {
      width: 110px;
      height: 110px;
    }

    #green-banner {
      background: url(${bannerDesktop}) center center no-repeat;
      background-size: 625px 100px;
      height: 100px;
      color: white;
      text-transform: uppercase;
      padding-top: 38px;
      font-size: 38px;
      letter-spacing: 15px;
    }

    p {
      text-transform: uppercase;
      font-size: 2rem;
      font-weight: bold;
      letter-spacing: 12px;
    }

    @media screen and (max-width: ${SMALL_TABLET_WIDTH}) {
      width: 90%;
      margin: 50px auto 50px auto;

      img {
        width: 60px;
        height: 60px;
      }

      #green-banner {
        background-size: 335px 55px;
        height: 55px;
        padding-top: 21px;
        font-size: 24px;
        font-size: 22px;
        letter-spacing: 8px;
        margin-bottom: 10px;
      }

      p {
        font-size: 1.16rem;
        letter-spacing: 6px;
        margin-top: 10px;
      }
    }
  }
`;

const CardListContainer = styled.div`
  && {
    height: 100%;
    width: 100vw;
    @media screen and (min-width: ${BIG_TABLET_WIDTH}) {
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }
  }
`;

export default InfiniteAvailableEventList;
