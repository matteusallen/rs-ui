import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import InfiniteLoader from 'react-window-infinite-loader';
import ScrollToButton from '../ScrollToButton';
import TableRow from './TableRow';

import { TableContext } from './TableContext';

const offset = 10;

const InfiniteTableBase = props => {
  const { openRow, orderID, className, itemCount, isItemLoaded, loadMoreItems, items } = props;
  const listRef = React.createRef();
  const [visibleStart, setVisibleStart] = useState(1);
  const tableContextRef = useContext(TableContext);

  const scrollTo = () => {
    listRef.current.scrollToItem(0);
  };

  const toggleCheckboxSelectionHandler = item => {
    tableContextRef.toggleSelection(item);
  };

  useEffect(() => {
    tableContextRef.setDataProvider(items);
  }, [items]);

  useEffect(() => {
    if (listRef.current) scrollTo();
  }, [items[0]]);

  const row = useCallback(args => {
    const { index, style } = args;
    if (!isItemLoaded(index)) {
      return <></>;
    }
    const item = items[index];

    return (
      <TableRow
        item={item}
        isFocused={orderID === item.id}
        onClick={() => openRow(item.id)}
        onCheckboxSelected={toggleCheckboxSelectionHandler}
        style={{
          ...style,
          marginLeft: 50,
          marginRight: 50,
          width: 'calc(100% - 100px)',
          top: style.top + offset,
          height: style.height - offset
        }}
        index={index}
      />
    );
  });

  return (
    <>
      <ScrollToButton
        style={{
          position: 'absolute',
          bottom: 12,
          right: 20,
          zIndex: 1
        }}
        onClick={scrollTo}
        start={visibleStart}
      />
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
                  itemSize={100}
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
    </>
  );
};

const InfiniteTable = styled(InfiniteTableBase)`
  &__wrapper-div {
    height: calc(100% - 83px);
    overflow-x: hidden;
  }

  &__table {
    width: 100%;
    height: 100%;
    &&& {
      margin: 0;
    }
  }
`;

export default InfiniteTable;
