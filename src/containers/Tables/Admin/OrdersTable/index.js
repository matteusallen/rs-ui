import React, { useState, useEffect, useContext } from 'react';
import { compose } from 'recompose';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { ORDERS_TABLE } from '../../../../queries/Admin/OrdersTable';
import { subRouteCodes as SUB_ROUTES } from '../../../../constants/routes';

import AddButton from '../../../../components/Button/AddButton';
import InfiniteTable from '../../../../components/Table/InfiniteTable';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import { UserContext } from '../../../../store/UserContext';

import TableFilters from './TableFilters';
import { useOrderSidePanel, ViewOrderSidePanel } from '../ViewOrderSidePanel';
import ContextSnackbar from '../../../../components/Snackbar';

import { TableContextProvider } from '../../../../components/Table/TableContext';
import ActionBar from '../../../../components/Table/ActionBar/ActionBar';

import { withSnackbarContextActions } from '../../../../store/SnackbarContext';
import { withUserContext } from '../../../../store/UserContext';
import { HeadingOne } from 'Components/Headings';
import { ADMIN, GROUP_LEADER, RESERVATION_ADMIN } from '../../../../constants/userRoles';

/**
 * Get just the orders collection from the result, or return []
 * @returns Array<object>
 */
const getDataFromResult = data => {
  return getValueByPropPath(data, 'orders.orders', []);
};

const CREATE_ORDER_LINK_MAP = {
  [ADMIN]: SUB_ROUTES.ADMIN.CREATE_ORDER,
  [GROUP_LEADER]: SUB_ROUTES.GROUP_LEADER.CREATE_ORDER,
  [RESERVATION_ADMIN]: SUB_ROUTES.ADMIN.CREATE_ORDER
};

const OrdersTableBase = props => {
  const { className } = props;
  const [hasMoreRecords, setHasMoreRecords] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [filters, setFilters] = useState({ reservationStatus: 0 });
  const [ordering, setOrdering] = useState('updatedAt_DESC');
  const [checkInOutFilter, setCheckInOutFilter] = useState({
    checkInOnly: false,
    checkOutOnly: false
  });
  const { open, onClose, orderID } = useOrderSidePanel();

  const { user } = useContext(UserContext);

  useEffect(() => {
    const sessionSortOrder = sessionStorage.getItem('reservationsOrder');
    if (!sessionSortOrder) sessionStorage.setItem('reservationsOrder', ordering);
    else if (ordering !== sessionSortOrder) setOrdering(sessionSortOrder);
  }, [ordering]);

  useEffect(() => {
    initialLoad ? localStorage.setItem('selectedRows', '') : null;
  }, [initialLoad]);

  const limit = 25;
  const { data, fetchMore, loading } = useQuery(ORDERS_TABLE, {
    variables: {
      input: {
        limit,
        filterBy: filters,
        orderBy: ordering,
        offset: 1,
        checkInOnly: checkInOutFilter.checkInOnly,
        checkOutOnly: checkInOutFilter.checkOutOnly
      }
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  });

  const [getAllOrders, { data: allOrders }] = useLazyQuery(ORDERS_TABLE, {
    variables: {
      input: {
        filterBy: filters,
        orderBy: ordering,
        offset: 1,
        limit: 1000,
        checkInOnly: checkInOutFilter.checkInOnly,
        checkOutOnly: checkInOutFilter.checkOutOnly
      }
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true
  });
  const error = getValueByPropPath(data, 'orders.error');
  if (error) {
    // TODO - handle error
    return <div>{error}</div>;
  }

  const orders = getDataFromResult(data);

  const itemCount = hasMoreRecords ? orders.length + 1 : orders.length;

  const isItemLoaded = index => !hasMoreRecords || index < orders.length;

  const loadMoreItems = () => {
    setInitialLoad(false);
    if (!hasMoreRecords || data.orders.orders.length % limit) {
      return;
    }
    return fetchMore({
      variables: {
        input: {
          limit,
          filterBy: filters,
          orderBy: ordering,
          offset: data.orders.orders.length / limit + 1,
          checkInOnly: checkInOutFilter.checkInOnly,
          checkOutOnly: checkInOutFilter.checkOutOnly
        }
      },
      notifyOnNetworkStatusChange: true,
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) {
          setHasMoreRecords(false);
          return prev;
        }
        const newData = getDataFromResult(fetchMoreResult);
        if (newData.length === 0) {
          setHasMoreRecords(false);
          return prev;
        }
        const previousData = getDataFromResult(prev);
        if (!newData || previousData === newData) return prev;
        const newResult = {
          orders: {
            error: fetchMoreResult.orders.error,
            orders: [...previousData, ...newData],
            success: fetchMoreResult.orders.success,
            __typename: 'OrdersReturn'
          }
        };

        return newData.length > 0 ? newResult : prev;
      }
    });
  };

  const CREATE_ORDER_LINK = CREATE_ORDER_LINK_MAP[+user.role.id];

  return (
    <>
      <ContextSnackbar />
      <div className={`${className}__page-header`}>
        <div className={`${className}__header-wrapper`}>
          <HeadingOne label="RESERVATIONS &amp; ORDERS" />
          <div>
            <CreateReservationLink to={CREATE_ORDER_LINK}>
              <AddButtonBase label={'CREATE NEW'} />
            </CreateReservationLink>
          </div>
        </div>
      </div>
      <>
        <div className={`${className}__main-wrapper`}>
          <TableContextProvider>
            <TableFilters
              setCheckInOutFilter={setCheckInOutFilter}
              orders={orders}
              checkInOutFilter={checkInOutFilter}
              filters={filters}
              setFilters={setFilters}
            />
            <ViewOrderSidePanel onClose={onClose} orderID={orderID} />
            {!(orders.length === 0) ? (
              <div className={`${className}__column-wrapper`}>
                <ActionBar
                  count={data.orders.count}
                  checkingInCount={data.orders.checkingInCount}
                  checkingOutCount={data.orders.checkingOutCount}
                  ordering={ordering}
                  setOrdering={setOrdering}
                  checkInOutFilter={checkInOutFilter}
                  setCheckInOutFilter={setCheckInOutFilter}
                  filters={filters}
                  getAllOrders={getAllOrders}
                  allOrders={allOrders}
                  loading={loading}
                  user={user}
                />
                <InfiniteTable
                  orderID={orderID}
                  isItemLoaded={isItemLoaded}
                  itemCount={itemCount}
                  loadMoreItems={loadMoreItems}
                  items={orders}
                  openRow={open}
                />
              </div>
            ) : !loading ? (
              <div className={`${className}__empty-list`}>No results found</div>
            ) : (
              <div className={`${className}__empty-list`}>
                <IndeterminateLoading />
              </div>
            )}
          </TableContextProvider>
        </div>
      </>
    </>
  );
};

const OrdersTable = styled(OrdersTableBase)`
  &__page-header {
    text-align: left;
    border-bottom: 1px solid rgb(200, 214, 229);
    &&& {
      margin: 0;
    }
  }

  &__empty-list {
    width: 100px;
    &&& {
      margin: 30px auto 0 auto;
    }
  }

  &__header-wrapper {
    margin: 85px 22px 20px !important;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__main-wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
    &&& {
      margin: 0;
    }
  }

  &__column-wrapper {
    width: calc(100% - 300px);
    height: 100%;

    &&& {
      margin: 0;
    }
  }

  &__list-helper {
    flex: 1 1 auto;
  }

  &__list-container {
    display: flex;
  }
`;

const AddButtonBase = styled(AddButton)`
  &&& {
    margin-left: 20px;

    svg {
      position: relative;
    }
  }
`;

const CreateReservationLink = styled(Link)`
  text-decoration: none;
`;

export default compose(withUserContext, withSnackbarContextActions)(OrdersTable);
