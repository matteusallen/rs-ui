// @flow
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from 'react-apollo';
import { capitalize } from '@material-ui/core';
import ReactToPrint from 'react-to-print';

import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex } from '../../../../styles/Mixins';
import colors from '../../../../styles/Colors';

import { isEmpty } from '../../../../helpers/isEmpty';

import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import type { AddOnProductType } from '../../../../queries/Renter/EventForOrderCreate';
import HeadingThree from '../../../../components/Headings/HeadingThree';
import type { PaymentType } from '../../Admin/Edit/RefundModal';
import useReservationFlowRoutes from './useReservationFlowRoutes';
import { mapOrderItems, mapOrderItemsSummary } from '../../../../helpers';
import TicketOrderItem from './TicketOrderItem';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import type { OrderItemsType } from '../../../../helpers';
import PrintReceipt from '../../../../components/PrintReceipt';
import { createStripeToken } from '../../shared/sharedMethods';
import { CardNumberElement } from '@stripe/react-stripe-js';
import type { StripeTokenType } from '../../shared/sharedMethods';

export type TicketPropsType = {|
  addOnProducts: AddOnProductType[],
  addOns: { [index: string]: string },
  ccInformation?: {
    useCard: boolean
  },
  isViewDetailsPage?: boolean,
  isViewConfirmationPage?: boolean,
  className?: string,
  payments?: PaymentType[],
  rvProductId: string | null,
  rv_spot: {
    end?: Moment,
    quantity: number,
    start?: Moment
  },
  stallProductId: string,
  stalls: {
    end?: Moment,
    quantity: number,
    start?: Moment
  },
  orderFee?: Float,
  orderTotal?: Float,
  platformFee?: Float,
  printData?: any,
  stripe: StripeTokenType,
  elements: {
    getElement: CardNumberElement => string
  },
  setTotal: number
|};

type GetOrderCostsInputType = {|
  variables: {
    input: {
      selectedOrderItems: OrderItemsType[],
      useCard: boolean,
      isNonUSCard: boolean
    }
  }
|};
type GetOrderCostsCallbackParamsType = {|
  addOns: { [index: string]: string },
  ccInformation?: {
    useCard: boolean
  },
  getOrderCosts: (params: GetOrderCostsInputType) => void,
  orderItemsArray: OrderItemsType[],
  rvProductId: string | null,
  stallProductId: string | null,
  isNonUS: boolean
|};

export const getOrderCostsCallback = ({
  getOrderCosts,
  ccInformation,
  rvProductId,
  stallProductId,
  addOns,
  orderItemsArray,
  isNonUS
}: GetOrderCostsCallbackParamsType) => {
  if (!!rvProductId || !!stallProductId || !isEmpty(addOns) || orderItemsArray.length > 0) {
    getOrderCosts({
      variables: {
        input: {
          selectedOrderItems: orderItemsArray,
          useCard: ccInformation && ccInformation.useCard === false ? false : true,
          isNonUSCard: isNonUS
        }
      }
    });
  }
};

const getTotal = (payments: PaymentType[], fee: Float) => {
  const result = payments
    .map(payment => payment.amount)
    .reduce((total, num) => {
      return total + num;
    }, 0);

  if (fee > result && result !== 0) return fee.toFixed(2);

  return result.toFixed(2);
};

const Ticket = (props: TicketPropsType) => {
  const {
    className = '',
    isViewDetailsPage,
    isViewConfirmationPage,
    addOnProducts,
    ccInformation,
    stallProductId,
    rvProductId,
    addOns,
    rv_spot = {},
    stalls = {},
    payments = [],
    orderFee,
    orderTotal,
    platformFee,
    printData,
    stripe,
    elements,
    setTotal
  } = props;

  const componentRef = useRef();

  const [firstPayment] = payments;
  const { start: stallsStart, end: stallsEnd, quantity: stallsQuantity } = stalls;

  const { start: rvsStart, end: rvsEnd, quantity: rvsQuantity } = rv_spot;
  const { isStallsUrl, isRvsUrl } = useReservationFlowRoutes();
  const orderItemsArray = mapOrderItems({
    addOns,
    stallProductId,
    stallsQuantity,
    stallsStart,
    stallsEnd,
    rvProductId,
    rvsQuantity,
    rvsStart,
    rvsEnd
  });
  const [isNonUS, setIsNonUS] = useState(false);

  const [getOrderCosts, { loading, data: orderCosts }] = useLazyQuery(ORDER_CREATE_COSTS);
  orderCosts;

  const getCardIsNonUS = async () => {
    if (ccInformation && (ccInformation.nameOnCard || ccInformation.zipCode)) {
      const cardInfo = {
        card: elements.getElement(CardNumberElement),
        name: ccInformation.nameOnCard,
        zip: ccInformation.zipCode
      };
      const strToken = await createStripeToken(stripe, cardInfo);
      await setIsNonUS(strToken?.token?.card.country !== 'US');
    } else if (ccInformation && ccInformation.country) {
      await setIsNonUS(ccInformation.country !== 'US');
    }
  };

  useEffect(() => {
    if (!!orderItemsArray && orderItemsArray.length > 0) {
      getCardIsNonUS();
      getOrderCostsCallback({
        getOrderCosts,
        ccInformation,
        rvProductId,
        stallProductId,
        addOns,
        orderItemsArray,
        isNonUS
      });
    }
  }, [JSON.stringify(orderItemsArray), ccInformation, isNonUS]);

  const actualOrderCosts = orderCosts && orderCosts.orderCosts;

  const { orderItemsCostsWithDetails, serviceFee, stripeFee, total, discount } = actualOrderCosts ? actualOrderCosts : {};

  const mappedOrderItems = useMemo(
    () =>
      mapOrderItemsSummary({
        orderItems: orderItemsCostsWithDetails || [],
        addOnProducts
      }),
    [addOnProducts.length, JSON.stringify(orderItemsCostsWithDetails)]
  );

  if (!actualOrderCosts || isEmpty(actualOrderCosts) || (orderItemsArray && orderItemsArray.length === 0))
    return (
      <div className={`${className} empty-totals`}>
        {isStallsUrl
          ? 'Select dates, number of stalls, and reservation type to see your reservation total'
          : isRvsUrl
          ? 'Select dates, number of spots, and RV spot type to see your reservation total'
          : 'Select dates and stall, RV, or add on options to see reservation total'}
      </div>
    );

  // bubble up the total
  setTotal && setTotal(total.toFixed(2));

  return (
    <>
      {firstPayment && (
        <>
          {!printData && <HeadingThree label="Receipt" />}
          {printData && (
            <div className={`${className} heading-wrapper`}>
              <HeadingThree label="Receipt" />
              <ReactToPrint trigger={() => <div className="link-print-receipt">Detailed receipt</div>} content={() => componentRef.current} />
            </div>
          )}
          <div className={`${className} ticket-receipt`}>
            <div>Payment Method</div>
            <div>{!firstPayment.cardBrand ? 'Cash/Check' : `${capitalize(firstPayment.cardBrand)} -${firstPayment.last4}`}</div>
          </div>
        </>
      )}
      {!firstPayment && printData && (
        <div className={`${className} heading-wrapper without-first-payment`}>
          <ReactToPrint trigger={() => <div className="link-print-receipt">Detailed receipt</div>} content={() => componentRef.current} />
        </div>
      )}
      <div className={`${className} ticket-details`}>
        {loading && (
          <div className={`${className} ticket-overlay`}>
            <IndeterminateLoading />
          </div>
        )}
        {mappedOrderItems.map(({ by, duration, orderItemCost, quantity, quantityUnit, unit, xProductId }) => (
          <TicketOrderItem
            key={xProductId}
            by={by}
            duration={duration}
            orderItemCost={orderItemCost}
            quantity={quantity}
            quantityUnit={quantityUnit}
            unit={unit}
          />
        ))}
        {stripeFee || serviceFee || (isViewDetailsPage && orderFee && platformFee) ? (
          <>
            <div className="ticket-line">
              <p>Transaction Fee</p>
              {!isViewDetailsPage && !isViewConfirmationPage && <p>${(Number(stripeFee ? stripeFee : 0) + Number(serviceFee ? serviceFee : 0)).toFixed(2)}</p>}
              {isViewConfirmationPage && <p>${(Number(orderFee ? orderFee : 0) + Number(serviceFee ? serviceFee : 0)).toFixed(2)}</p>}
              {isViewDetailsPage && <p>{isViewDetailsPage ? (orderFee + platformFee).toFixed(2) : null}</p>}
            </div>
            {isNonUS && (
              <p className="foreign-fees-disclosure">
                <i>Additional processing fees may apply. Non-US credit cards charged an additional 1%</i>
              </p>
            )}
          </>
        ) : null}

        {discount && discount > 0 ? (
          <div className="ticket-line discount">
            <p>Discount</p>
            <p>-${discount.toFixed(2)}</p>
          </div>
        ) : null}

        <div className="ticket-line total">
          <p>{isViewDetailsPage ? 'Total Paid' : 'Total Due'}</p>
          {!isViewDetailsPage && !isViewConfirmationPage && <p>{total <= 0 ? '$0.00' : `$${total.toFixed(2)}`}</p>}
          {isViewConfirmationPage && <p>${orderTotal.toFixed(2)}</p>}
          {isViewDetailsPage && <p>${getTotal(payments, orderFee + platformFee)}</p>}
        </div>
      </div>
      {printData && (
        <div style={{ display: 'none' }}>
          <PrintReceipt order={printData.order} ref={componentRef} renterView={true} />
        </div>
      )}
    </>
  );
};

const TicketStyled = styled(Ticket)`
  &.empty-totals {
    ${paragraphReg}
    font-size: 16px;
  }

  &.heading-wrapper {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    justify-content: space-between;

    .link-print-receipt {
      font-weight: bold;
      font-size: 16px;
      line-height: 25px;
      letter-spacing: 0.704px;
      text-decoration-line: underline;
      color: #2875c3;
      cursor: pointer;
    }

    &.without-first-payment {
      margin-bottom: 10px;
    }
  }

  &&&.ticket-details {
    ${paragraphReg}
    font-size: 16px;

    .ticket-overlay {
      background-color: rgba(255, 255, 255, 0.7);
      position: absolute;
      text-align: center;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ticket-line {
      ${displayFlex}
      flex-direction: row;
      justify-content: space-between;
      padding: 0 0 10px;
      p {
        margin: 0;
      }
    }

    .foreign-fees-disclosure {
      margin: 0 0 10px;
    }

    .total {
      border-top: 1px solid ${colors.text.lightGray};
      font-weight: bold;
      padding-top: 10px;
      font-family: 'IBMPlexSans-Bold';
      p {
        font-family: 'IBMPlexSans-Bold';
      }
    }
  }

  &.ticket-receipt {
    ${displayFlex}
    flow-direction: column;
    justify-content: space-between;
    margin: 15px 0 10px;
    border-bottom: 1px solid ${colors.text.lightGray};
    padding-bottom: 10px;
    font-size: 16px;

    div {
      width: 50%;
      text-align: right;
    }
    div:first-child {
      text-align: left;
      font-weight: bolder;
      font-family: 'IBMPlexSans-Bold';
    }
  }
`;

export default TicketStyled;
