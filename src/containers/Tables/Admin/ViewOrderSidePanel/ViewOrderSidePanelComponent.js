//@flow
import React, { useCallback, useEffect, useMemo, useContext } from 'react';
import { capitalize } from '@material-ui/core';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { useHistory } from 'react-router';
import moment from 'moment';
import { getValueByPropPath } from '../../../../utils/objectHelpers';

import Button from '../../../../components/Button';
import { ORDER_FOR_ORDER_TABLE_DETAIL } from '../../../../queries/Admin/OrderForOrderTableDetail';
import type { OrderReturnType } from '../../../../queries/Admin/OrderForOrderTableDetail';
import { formatPhoneNumber } from 'Helpers';
import { getOrderItems, parseDateRange } from './ViewOrderSidePanelHelpers';
import { ClosePanelButton as CloseButton } from './ClosePanelButton';
import { SidePanelRow as Row } from './SidePanelRow';
import { SidePanelCol as Columns } from './SidePanelCol';
import { SidePanelAddOns as AddOns } from './SidePanelAddOns';
import { SidePanelForm as Form } from './SidePanelForm';
import { SidePanelLayout as Layout } from './SidePanelLayout';
import { SidePanelSelect as Select } from './SidePanelSelect';
import { ViewOrderSidePanelLoading as Loading } from './ViewOrderSidePanelLoading';
import { SidePanelStalls as Stalls } from './SidePanelStalls';
import { SidePanelRvs as Rvs } from './SidePanelRvs';
import UPDATE_ISVISITED from '../../../../mutations/UpdateIsVisited';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';
import { PRODUCTS_TYPES } from '../../../../constants/productType';
import { UserContext } from '../../../../store/UserContext';
import { GROUP_LEADER } from '../../../../constants/userRoles';

const EDIT_ORDER_LINK_MAP = (role, orderId) => `/${role}/order/edit/${orderId}`;

type ViewOrderSidePanelPropsType = {|
  onClose: () => void,
  orderID: string
|};

export const ViewOrderSidePanelComponent = (props: ViewOrderSidePanelPropsType): React$Node => {
  const { orderID, onClose } = props;
  const { push } = useHistory();
  const [getOrderByIdCallback, { called, data, loading, refetch }] = useLazyQuery<OrderReturnType>(ORDER_FOR_ORDER_TABLE_DETAIL, {
    fetchPolicy: 'network-only'
  });
  const order = data && data.order ? data.order : {};
  const { user = {}, event = {}, orderItems = [], notes } = order;
  const { stallsOrder, rvsOrder, addOnOrderItems } = useMemo(() => getOrderItems(orderItems), [JSON.stringify(orderItems)]);
  const currentOrderAddOns = addOnOrderItems.filter(item => item.quantity > 0);
  const canSeeStallStatus = useValidateAction(PRODUCTS_TYPES.ORDERS, actions.STALL_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);
  const canSeeRVStatus = useValidateAction(PRODUCTS_TYPES.ORDERS, actions.RV_STATUS_DROPDOWN_ON_RESERVATION_SIDEBAR);

  const { user: userContext } = useContext(UserContext);

  const role = +userContext.role.id === GROUP_LEADER ? 'group-leader' : 'admin';

  const [setIsVisited] = useMutation(UPDATE_ISVISITED, {
    variables: { id: orderID }
  });

  const loadOrder = useCallback(() => {
    if (orderID) {
      getOrderByIdCallback({ variables: { id: orderID } });
    }
  }, [orderID]);

  useEffect(() => {
    if (data && data.order && !data.order.isVisited) {
      setIsVisited();
      refetch();
    }
  }, [data]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (!orderID) return null;

  if (loading || !called) return <Loading />;
  return (
    <Form
      hasRvs={Boolean(rvsOrder)}
      hasStalls={Boolean(stallsOrder)}
      key={orderID}
      order={order}
      rvStatusId={getValueByPropPath(rvsOrder, 'reservation.status.id', '')}
      stallStatusId={getValueByPropPath(stallsOrder, 'reservation.status.id', '')}>
      {() => (
        <Layout>
          <Row className={'row-20 order-user-name'}>
            <div>{`${capitalize(user.firstName || '')} ${capitalize(user.lastName || '')}`}</div>
            <CloseButton onClose={onClose} />
          </Row>

          <Row className="phone-and-updated">
            <div className="user-phone">{formatPhoneNumber(user.phone)}</div>
            <p>Edited at {moment.unix(new Date(order.updatedAt) / 1000).format('MM/DD/YY[,]h:mm A')}</p>
          </Row>

          <Row className={'row-20'} title={'Event'} text={event.name} />
          {!!stallsOrder?.quantity && (
            <Row
              title={'Stalls'}
              text={parseDateRange(getValueByPropPath(stallsOrder, 'reservation.startDate', ''), getValueByPropPath(stallsOrder, 'reservation.endDate', ''))}>
              <Stalls order={stallsOrder}>{stallColumns => <Columns columns={stallColumns} />}</Stalls>
              {canSeeStallStatus && <Select name={'stallStatusId'} orderItemId={stallsOrder.id} disabled={order.canceled ? true : false} />}
            </Row>
          )}

          {!!rvsOrder?.quantity && (
            <Row
              title={'RV Spots'}
              text={parseDateRange(getValueByPropPath(rvsOrder, 'reservation.startDate', ''), getValueByPropPath(rvsOrder, 'reservation.endDate', ''))}>
              <Rvs order={rvsOrder}>{columns => <Columns columns={columns} />}</Rvs>
              {canSeeRVStatus && <Select name={'rvStatusId'} orderItemId={rvsOrder.id} disabled={order.canceled ? true : false} />}
            </Row>
          )}

          {currentOrderAddOns.length > 0 && (
            <Row title={'Add Ons'}>
              <AddOns addOnOrderItems={currentOrderAddOns}>{columns => <Columns columns={columns} />}</AddOns>
            </Row>
          )}

          {!!notes && <Row title={'Special Request'} text={notes} />}

          {order.isEditable && (
            <Row className={'row-edit-button'}>
              <Button type={'submit'} secondary onClick={() => push(EDIT_ORDER_LINK_MAP(role, orderID))}>
                Edit Reservation
              </Button>
            </Row>
          )}
        </Layout>
      )}
    </Form>
  );
};
