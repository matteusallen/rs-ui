// @flow
import React from 'react';

import styled from 'styled-components';

import type { UserType } from '../../../../pages/Admin/Users';
import { useValidateAction } from '../../../utils/actions';
import { actions } from '../../../constants/actions';

import BulkActionsSelect from './BulkActionsSelect';
import RowSelectionInfo from './RowSelectionInfo';
import OrderSortControl from './OrderSortControl';
import TableCount from './TableCount';

export type BulkActionsPropsType = {|
  checkInOutFilter: number,
  checkingInCount: number,
  checkingOutCount: number,
  className: string,
  count: number,
  // eslint-disable-next-line flowtype/no-weak-types
  filters: any,
  loading: boolean,
  ordering: [],
  setCheckInOutFilter: () => void,
  setOrdering: () => void,
  getAllOrders: () => void,
  allOrders: [],
  user: UserType
|};

const ActionBarComponent = ({
  className,
  ordering,
  setOrdering,
  count,
  filters,
  checkingInCount,
  checkingOutCount,
  checkInOutFilter,
  setCheckInOutFilter,
  loading,
  getAllOrders,
  allOrders
}: BulkActionsPropsType) => {
  const canSendResAssigments = useValidateAction('orders', actions.GET_DETAILS_SMS_COUNT);
  const canSendCustomMessage = useValidateAction('orders', actions.SEND_CUSTOM_SMS_BY_ORDER_IDS);
  const canBulkActions = canSendResAssigments && canSendCustomMessage;

  return (
    <>
      <TableCount
        className={className}
        count={count}
        filters={filters}
        checkingInCount={checkingInCount}
        checkingOutCount={checkingOutCount}
        checkInOutFilter={checkInOutFilter}
        setCheckInOutFilter={setCheckInOutFilter}
        loading={loading}
      />
      <div className={`${className}__action-bar`}>
        {canBulkActions && (
          <>
            <RowSelectionInfo getAllOrders={getAllOrders} allOrders={allOrders} />
            <BulkActionsSelect />
          </>
        )}
        <OrderSortControl className={className} ordering={ordering} setOrdering={setOrdering} />
      </div>
    </>
  );
};

const platform = window.navigator.platform;
const ActionBar = styled(ActionBarComponent)`
  &__action-bar {
    margin-left: 50px;
    margin-right: ${platform.indexOf('Win') > -1 ? '0' : '45px'}
    padding-right: ${platform.indexOf('Win') > -1 ? '50px' : '5px'};
    padding-bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`;

export default ActionBar;
