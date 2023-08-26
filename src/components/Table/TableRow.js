// @flow
import React, { useContext, useCallback, useRef, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import _memoize from 'lodash.memoize';
import { Checkbox, IconButton } from '@material-ui/core';
import ReactToPrint from 'react-to-print';
import colors from '../../styles/Colors';
import { findIndex } from '../../utils/arrayHelpers';
import SpecialRequestIcon from '../../assets/img/icons/special-request.png';
import PrintIcon from '../../assets/img/icons/Printer.svg';
import RowStat from './RowStat';
import Badge from '../Badge';
import { TableContext } from './TableContext';
import upperFirst from '../../utils/upperFirst';
import type { OrderItemsType } from '../../helpers';
import type { UserType } from '../../pages/Admin/Users';
import PrintReceipt from '../PrintReceipt';
import { ORDER_FOR_PRINT_RECEIPT } from '../../queries/Admin/OrderForPrintReceipt';
import { sortArrayOfObj } from 'Utils/arrayHelpers';
import { UserContext } from '../../store/UserContext';
import { GROUP_LEADER } from '../../constants/userRoles';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import ErrorOutline from '@material-ui/icons/ErrorOutline';

type EventType = {|
  id: string | number,
  name: string
|};

type GroupType = {|
  id: string | number,
  name: string
|};

export type RowItemType = {|
  id: string,
  notes: string,
  orderItems?: OrderItemsType[],
  user?: UserType,
  event: EventType,
  group: GroupType
|};

const IconTip = () => {
  return (
    <RedTooltip placement="top" arrow title="Unpaid">
      <ErrorOutline style={{ color: colors.error.primary }} fontSize="small" />
    </RedTooltip>
  );
};

// eslint-disable-next-line flowtype/require-exact-type
export type TableRowBaseType = {
  className: string,
  index: string | number,
  item: RowItemType,
  onCheckboxSelected: (item: number | string) => void,
  onClick: (event: SyntheticMouseEvent<HTMLDivElement>) => void,
  style?: string,
  isFocused: boolean
};

const getStatus = (orderItems: OrderItemsType[]) => {
  let previous = false;
  return orderItems.reduce((acc, orderItem) => {
    if (orderItem.reservation && orderItem.reservation.status && orderItem.quantity) {
      if (
        (orderItem.reservation.stalls && orderItem.quantity !== orderItem.reservation.stalls.length) ||
        (orderItem.reservation.rvSpots && orderItem.quantity !== orderItem.reservation.rvSpots.length)
      ) {
        acc['assignment'] = 'need-assignment';
      }
      if (
        previous &&
        previous.reservation !== null &&
        orderItem.reservation.status.name &&
        previous.reservation.status.name &&
        (orderItem.reservation.status.name == 'checked in' || previous.reservation.status.name == 'checked in') &&
        orderItem.reservation.status.name !== previous.reservation.status.name
      ) {
        acc['partial'] = 'partial-check-in';
      }
      acc[orderItem.reservation.status.name] = orderItem.reservation.status.name === 'checked in' ? 'checked-in' : orderItem.reservation.status.name;
    }
    previous = orderItem;
    return acc;
  }, {});
};

const getBadges = (item: RowItemType) => {
  let returnValue = [];
  const badges = getStatus(item.orderItems || []);

  if (badges.canceled) {
    returnValue.push(<Badge type="canceled" key="canceled" />);
    return returnValue;
  }

  Object.entries(badges).forEach(type => {
    if (type.length && badges.partial === 'partial-check-in' && type[1] !== 'checked-in' && badges.partial === 'partial-check-in' && type[1] !== 'reserved') {
      returnValue.push(<Badge type={type[1]} key={type[0]} />);
    } else if (type.length > 0 && badges.partial !== 'partial-check-in') {
      returnValue.push(<Badge type={type[1]} key={type[0]} />);
    }
  });

  return sortArrayOfObj(returnValue, 'key');
};

const isChecked = _memoize(
  (selection, selectedRows) => {
    if (selectedRows.length === 0) return false;
    const foundIndex = findIndex(selectedRows, item => {
      return item && selection && item === selection.id;
    });
    return foundIndex > -1;
  },
  (...args) => {
    return JSON.stringify(args);
  }
);

const getUserName = _memoize(
  user => {
    if (!user) return null;
    return `${upperFirst(user.firstName) || ''} ${upperFirst(user.lastName) || ''}`;
  },
  (...args) => {
    return JSON.stringify(args);
  }
);

const reduceOrderItems = _memoize(
  (orderItems, productType: 'stalls' | 'rvs') => {
    return orderItems.reduce((acc, orderItem) => {
      if (typeof acc['quantity'] === 'undefined') {
        acc['quantity'] = 0;
      }
      if (orderItem.reservation !== null && orderItem.reservation[productType] !== null) {
        acc['quantity'] = orderItem.quantity;
      }
      return acc;
    }, {});
  },
  (...args) => {
    return JSON.stringify(args);
  }
);

const TableRowBase = (props: TableRowBaseType) => {
  const { onClick, onCheckboxSelected, className, style, index, item, isFocused } = props;
  const [getData, setGetData] = useState(false);
  const { data } = useQuery(ORDER_FOR_PRINT_RECEIPT, {
    variables: { id: item.id },
    skip: !getData,
    fetchPolicy: 'network-only'
  });
  const tableContextRef = useContext(TableContext);
  const { user } = useContext(UserContext);
  const isNotGroupLeader = +user.role.id !== GROUP_LEADER;
  const componentRef = useRef();
  const orderItems = item.orderItems || [];
  const handleCheckboxSelect = useCallback(() => {
    onCheckboxSelected(item.id);
  });
  const stalls = useCallback(reduceOrderItems(orderItems, 'stalls'));
  const rvSpots = useCallback(reduceOrderItems(orderItems, 'rvSpots'));
  const currentOrderAddOns = item?.orderItems?.filter(item => item.addOnProduct && item.quantity > 0);

  return (
    <div
      className={`${className}__table-row ${isFocused ? 'tr-focused' : ''} ${item.isVisited ? '' : 'tr-notvisited'}`}
      style={style}
      key={index}
      onMouseEnter={() => setGetData(true)}
      data-testid="ops-table-row">
      {isNotGroupLeader && <Checkbox onChange={handleCheckboxSelect} color={'primary'} checked={isChecked(item, tableContextRef.selectedRows)} />}
      <div onClick={onClick} onKeyPress={onClick} className={`body`} role="button" tabIndex="0">
        <div className="customer-name-container">
          <div className="customer-name">
            {getUserName(item.user)} {item.notes && <img src={SpecialRequestIcon} alt="Special Request Icon" />}{' '}
            {item.multipleOrders && <Badge type={'hasMultiple'} />}
            {item.group && !item.isGroupOrderPaymentSettled && <IconTip item={item} />}
          </div>
          <div className="event-group-name">
            {upperFirst(item.event.name)}
            {item.group?.name && ` | ${upperFirst(item.group.name)}`}
          </div>
        </div>
      </div>
      <div className="status-badges">{getBadges(item)}</div>
      <div className="status-info">
        <RowStat value={stalls.quantity} title="stalls" />
        <RowStat value={rvSpots.quantity} title="rv spots" />
        <RowStat value={currentOrderAddOns?.length} title="add ons" />
      </div>
      <ReactToPrint
        trigger={() => (
          <IconButton data-testid="print-receipt-icon" className="printer-icon">
            <img src={PrintIcon} alt="printer icon" />
          </IconButton>
        )}
        content={() => componentRef.current}
      />
      {data && (
        <div style={{ display: 'none' }}>
          <PrintReceipt order={data.order} ref={componentRef} />
        </div>
      )}
    </div>
  );
};

export const RedTooltip = withStyles({
  tooltip: {
    color: colors.white,
    backgroundColor: colors.border.tertiary,
    fontSize: '16px'
  },
  arrow: {
    color: colors.border.tertiary
  }
})(Tooltip);

const TableRow = styled(TableRowBase)`
  &__table-row {
    display: flex;
    flex-direction: row;
    height: 88px;
    margin: 5px 20px;
    text-align: left;
    align-items: center;
    box-sizing: borderbox;
    background: white;
    padding: 14px;
    box-shadow: 0 2px 6px rgba(17, 24, 31, 0.03), 0 2px 3px rgba(17, 24, 31, 0.1);

    &:hover {
      box-shadow: 0 3px 8px rgba(17, 24, 31, 0.15), 0 2px 3px rgba(17, 24, 31, 0.3);

      .printer-icon {
        display: block;
      }
    }

    .printer-icon {
      display: none;
      position: absolute;
      right: -25px;
      background: #ebebeb;
      border: 1px solid #8395a7;

      &:hover {
        background: #ebebeb;
      }
    }

    &.tr-focused {
      box-shadow: 0 3px 8px rgba(17, 24, 31, 0.15), 0 2px 3px rgba(17, 24, 31, 0.3);
      color: ${colors.text.darkBlue};
      border-left: 3px solid ${colors.text.darkBlue};
    }

    &.tr-notvisited {
      box-shadow: 0 3px 8px rgba(17, 24, 31, 0.15), 0 2px 3px rgba(17, 24, 31, 0.3);
      border-left: 10px solid ${colors.primary};
    }

    &.tr-boldness {
      font-family: 'IBMPlexSans-Bold' !important;
    }

    .body {
      display: flex;
      height: 88px;
      width: 100%;
      margin-left: 10px;
      align-items: center;

      &:hover .customer-name {
        color: ${colors.text.darkBlue};
      }
    }

    .body:focus {
      outline: none;
    }
    .body:hover {
      cursor: pointer;
    }

    input {
      display: block;
      margin-right: 20px;
    }

    .customer-name-container {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      white-space: nowrap;
      width: 200px;

      .customer-name {
        font-family: 'IBMPlexSans-${props => (props.item.isVisited ? 'SemiBold' : 'Bold')}';
        font-size: 18px;
        line-height: 23px;
        letter-spacing: 0.792px;
        display: inline-flex;

        img {
          margin-left: 15px;
          margin-top: 3px;
          width: 18px;
          height: 18px;
        }
      }

      .event-group-name {
        font-size: 16px;
        font-family: 'IBMPlexSans-${props => (props.item.isVisited ? 'Regular' : 'Bold')}';
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    .status-badges {
      display: flex;
      flex-direction: row;
      flex-grow: 2;
      flex-shrink: 0;
      justify-content: flex-end;
      align-items: center;
      padding-right: 18px;
    }
    .status-info {
      display: flex;
      flex-grow: 1;
      width: 275px;
      padding-left: 10px;
      padding-right: 15px;
      border-left: 1px solid #cddae7;
    }
  }
`;

export default TableRow;
