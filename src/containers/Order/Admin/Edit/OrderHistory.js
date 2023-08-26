//@flow
import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { ORDER_EDIT_COSTS } from '../../../../queries/OrderEditCosts';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingThree } from '../../../../components/Headings';
import colors from '../../../../styles/Colors';
import type { OrderItemsType } from '../../../../helpers';
import OrderRefund from '../../../../mutations/OrderRefund';
import RefundConfirmationModal from './RefundConfirmationModal';
import type { PaymentType } from './RefundModal';
import type { RefundInputType } from '../../../../mutations/OrderRefund';
import IndeterminateLoading from 'Components/Loading/IndeterminateLoading';
import cliTruncate from 'cli-truncate';
import { formatPriceInformation } from '../../../../helpers/formatPriceInformation';
import { SimpleMenu } from 'Components/SimpleMenu';
import { UserContext } from 'Store/UserContext';
import type { UserContextType } from '../../../../store/UserContextType';
import USER_ROLES from 'Constants/userRoles';
import OrderHistoryDetails from './OrderHistoryDetails';
import { useLazyQuery } from 'react-apollo';
import { parseDifferencesByItemWithDiscounts } from './editCostHelpers';
import ChargeModal from './ChargeModal';
import type { Multipayment } from './OrderEditForm';

type GroupType = {|
  id: string | number,
  name: string
|};

export type Order = {
  id: string,
  orderItems: Array<OrderItemsType>,
  platformFee: number,
  group: GroupType,
  total: number,
  createdAt: Date,
  payments?: Array<PaymentType>
};

const PaymentHistory = (props: {
  className?: string,
  toggleRefundModalVisibility: () => void,
  priceAdjustments: [],
  loading?: Boolean,
  isReviewPage?: Boolean,
  order: Order,
  orderRefund: (input: RefundInputType) => Promise<void>,
  discount: Float | null,
  onSubmitCheckoutGroupOrder: (order: Order, paymentDetails: PaymentType, multipayment: Multipayment) => void,
  hasBeenPaid: boolean
}) => {
  const {
    className = '',
    order = {},
    orderRefund,
    loading,
    priceAdjustments,
    toggleRefundModalVisibility,
    isReviewPage,
    orderCosts,
    initialOrderCosts,
    reservationAdded,
    onSubmitCheckoutGroupOrder,
    hasBeenPaid
  } = props;
  // eslint-disable-next-line react/prop-types
  const { id: orderId, groupPayments } = order;
  const { user } = useContext<UserContextType>(UserContext);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [payReservationModal, setPayReservationModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentType | null>(null);
  const [currentCharges, setCurrentCharges] = useState(0);
  const [discount, setDiscount] = useState(0);
  const totalPaidMinusRefunds = Math.abs(Number(order.payments?.reduce((acc, curr) => (acc += isNoRefund(curr)), 0)));
  const [fees, setCostFees] = useState(0);
  const [paymentOptions, setPaymentOptions] = useState({ card: true });
  let totalPaidForGroupMinusRefunds = 0;

  if (groupPayments) totalPaidForGroupMinusRefunds = Math.abs(Number(groupPayments?.reduce((acc, curr) => (acc += curr.amount), 0)));

  function isNoRefund(curr) {
    if (curr.notes && curr.notes.includes('NO REFUND:')) {
      return 0;
    }
    return curr.amount;
  }

  const [getFees, { data: costFees }] = useLazyQuery(ORDER_EDIT_COSTS);

  useEffect(() => {
    if (orderCosts && orderCosts.discount && priceAdjustments) {
      const parsedPriceAdjustments = priceAdjustments.filter(priceAdjustment => !priceAdjustment[2]);
      setDiscount(parsedPriceAdjustments.reduce((acc, curr) => acc + curr[0].discount, 0));
    }
  }, [orderCosts, priceAdjustments]);

  useEffect(() => {
    if (priceAdjustments && priceAdjustments.length && initialOrderCosts && orderCosts) {
      const parsedPriceAdjustments = parseDifferencesByItemWithDiscounts(priceAdjustments, initialOrderCosts, orderCosts).filter(
        priceAdjustment => !priceAdjustment[2]
      );
      setCurrentCharges(parsedPriceAdjustments.length ? parsedPriceAdjustments.reduce((acc, curr) => acc + curr[1], 0) : 0);
    } else {
      setCurrentCharges(0);
    }
  }, [priceAdjustments, initialOrderCosts, orderCosts]);

  useEffect(() => {
    getFees({
      variables: {
        input: {
          orderId: +order.id,
          isNonUSCard: false,
          useCard: !order.group ? true : false,
          amount: currentCharges,
          reservationAdded: reservationAdded
        }
      }
    });
    if (costFees) {
      //if (!order.group) {
      setCostFees(costFees.orderCostsFee.fee);
      //}
    }
  }, [currentCharges, costFees]);

  const closeModal = () => {
    setConfirmationModalOpen(false);
    setDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  const doRefund = (payment: PaymentType | null) => () => {
    if (!payment) {
      return;
    }
    orderRefund({
      amount: Number(payment.amount),
      cardBrand: payment.cardBrand,
      cardPayment: payment.cardPayment,
      last4: payment.last4,
      orderId: Number(orderId),
      ssChargeId: payment.ssChargeId,
      notes: payment.notes
    });
    closeModal();
  };

  const formatPrice = price => {
    if (price < 0) return `-$${Math.abs(price).toFixed(2)}`;
    return `$${price.toFixed(2)}`;
  };

  const handleSubmitCheckoutGroupOrder = async (_refundInformation, _refundPayment, _isGroupOrder, _noRefund, paymentInput = null, multipaymentInput) => {
    await onSubmitCheckoutGroupOrder(order, paymentInput, multipaymentInput);
  };

  const options = [
    { label: 'View Details', onClick: () => setDetailsModalOpen(true), dataTestId: 'simple-menu-details' },
    ...(!hasBeenPaid && order.group && !isReviewPage
      ? [{ label: 'Pay Reservation', onClick: () => setPayReservationModal(true), dataTestId: 'simple-menu-make-payment' }]
      : []),
    ...(user.role.name === USER_ROLES.VENUE_ADMIN && !isReviewPage && hasBeenPaid
      ? [{ label: 'Special Refund', onClick: () => toggleRefundModalVisibility(), dataTestId: 'simple-menu-refund' }]
      : [])
  ];

  return (
    <FormCard className={className}>
      <div className={`${className}__header`}>
        <HeadingThree label="Order History" />
        <SimpleMenu options={options} />
      </div>

      {loading ? (
        <IndeterminateLoading />
      ) : (
        <>
          {order.group && !hasBeenPaid && (
            <div className={`${className}__deferred-group-history`}>
              <div className={`deferred-amount-container`}>
                <p>{cliTruncate(`Deferred to ${order.group.name}`, 50)}</p>
                <p>${formatPriceInformation(totalPaidForGroupMinusRefunds)}</p>
              </div>
            </div>
          )}
          <div className={`${className}__transaction_history_row`}>
            {hasBeenPaid && (
              <div className={`information `}>
                <div className={`${className}__payment-line${priceAdjustments.length ? '' : ' to-date'}`}>Paid to date</div>
                <div>${totalPaidMinusRefunds?.toFixed(2) || order.total.toFixed(2)}</div>
              </div>
            )}
            <div className={`${className}__price-adjustments`}>
              {parseDifferencesByItemWithDiscounts(priceAdjustments, initialOrderCosts, orderCosts)?.map((change, i) => {
                return (
                  <div key={`price-change-${i}`} className="itemized-container">
                    <div className="item-change">{change[0]}</div>
                    <div>{formatPrice(change[1])}</div>
                  </div>
                );
              })}
            </div>
            <div className={`information `}>
              <div className={`${className}__payment-line`}>Current charges</div>
              <div>{formatPrice(currentCharges)}</div>
            </div>
            {discount > 0 && currentCharges > 0 && (
              <div className={`information `}>
                <div className={`${className}__payment-line`}>Discount</div>
                <div>{`-$${discount.toFixed(2)}`}</div>
              </div>
            )}
            <div className={`information `}>
              <div className={`${className}__payment-line`}>Total including fees</div>
              <div className={`total${currentCharges < 0 ? ' refund' : currentCharges > 0 ? ' charge' : ''}`}>
                {currentCharges < 0 ? formatPrice(currentCharges) : currentCharges === 0 ? formatPrice(0) : formatPrice(currentCharges + fees)}
              </div>
            </div>
          </div>
          <RefundConfirmationModal
            className={className}
            isOpen={confirmationModalOpen}
            close={closeModal}
            payment={selectedTransaction}
            handleRefund={doRefund(selectedTransaction)}
          />
          <ChargeModal
            handleSubmit={handleSubmitCheckoutGroupOrder}
            cancelWithRefund={false}
            className={className}
            order={order}
            open={payReservationModal}
            onClose={() => setPayReservationModal(false)}
            currentCharges={totalPaidForGroupMinusRefunds}
            reservationAdded={reservationAdded}
            paymentOptions={paymentOptions}
            setPaymentOptions={setPaymentOptions}
          />
          <OrderHistoryDetails className={className} orderID={order.id} open={detailsModalOpen} close={closeModal} group={order.group ? order.group : {}} />
        </>
      )}
    </FormCard>
  );
};

const PaymentHistoryStyled = styled(PaymentHistory)`
  &__header {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    border-bottom: 1px solid ${colors.border.primary};
  }
  &__payment-line {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    &.to-date {
      margin-bottom: 10px;
    }
  }

  &__price-adjustments {
    border-bottom: 1px solid ${colors.border.primary};

    .itemized-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 16px;
      margin: 10px 0;
    }
    .item-change {
      margin-left: 15px;
    }
  }
  &__deferred-group-history {
    margin-top: 10px;

    .deferred-amount-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 20px 0 -10px !important;

      p {
        margin: 0;
      }

      &:first-child {
        font-family: IBMPlexSans-Regular;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      &:last-child {
        margin: 0;
        font-family: IBMPlexSans-Regular;
      }
    }
  }
  &__transaction_history_row {
    padding-bottom: 15px;
    margin-top: 20px;
    .date {
      font-size: 12px;
      color: gray;
    }

    .paymentPopper button {
      top: -8px;
      left: -5px;
    }

    .information {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      margin-bottom: 0;
      padding-top: 10px;

      &:first-child {
        border-top: none !important
        padding-top: 0 !important;
      }

      .total {
        font-weight: 700;

        &.refund {
          color: ${colors.error.primary};
        }

        &.charge {
          color: ${colors.button.primary.active};
        }
      }
    }

    .information {
      svg {
        font-size: 14px;
        position: relative;
      }

      .refund-link {
        a {
          color: ${colors.text.link};
          text-decoration: underline;
          font-size: 16px;
          cursor: pointer;
        }
      }
    }
  }

  .refund-failed {
    color: ${colors.error.primary}
    font-size: 11px;

    svg {
      color: ${colors.error.primary}
      position: relative;
      top: 3px;
      font-size: 16px;
    }
  }
`;

export default OrderRefund(PaymentHistoryStyled);
