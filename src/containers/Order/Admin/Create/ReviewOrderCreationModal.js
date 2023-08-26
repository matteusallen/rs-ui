// @flow
import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { useLazyQuery } from 'react-apollo';
import { useQuery } from '@apollo/react-hooks';
import { Divider, CircularProgress, capitalize } from '@material-ui/core';
import { useFormikContext } from 'formik';
import moment from 'moment';
import ReactToPrint from 'react-to-print';
import PrintReceipt from '../../../../components/PrintReceipt';
import { GROUP_BY_ID } from '../../../../queries/Admin/GetGroupById';
import { RESERVATION_STATUSES } from '../../../../queries/Admin/ReservationsStatuses';
import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import { alphaNumericComparator, mapOrderItems } from '../../../../helpers';
import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import { displayFlex } from '../../../../styles/Mixins';
import { paragraphBold, paragraphReg } from '../../../../styles/Typography';
import colors from '../../../../styles/Colors';
import { normalizePhone } from 'Helpers/normalize';
import { pluralizeName } from '../../Renter/Create/TicketOrderItem';
import type { AddOnProductType } from '../../../../queries/Renter/EventForOrderCreate';
import { createStripeToken } from '../../shared/sharedMethods';
import { CardNumberElement, useStripe, useElements } from '@stripe/react-stripe-js';

type ReviewOrderCreationPropsType = {|
  className: string,
  close: boolean,
  handleSubmit: (e: Event) => void,
  heading: string,
  open: boolean
|};

type SelectedAddOnType = {| ...AddOnProductType, quantity: number |};

const renderAddOns = (addOnProducts: AddOnProductType[] = [], addOns: { [index: string]: string } = {}): SelectedAddOnType[] => {
  const availableAddOns = addOnProducts;
  const selectedAddOnIds = Object.keys(addOns);
  return availableAddOns
    .filter(item => selectedAddOnIds.some(id => id === item.id) && Number(addOns[item.id] || 0) > 0)
    .map(item => ({
      ...item,
      quantity: Number(addOns[item.id] || 0)
    }));
};

export const ReviewOrderCreationBase = (props: ReviewOrderCreationPropsType) => {
  const { className, close, handleSubmit, heading, open } = props;
  const { values, isSubmitting } = useFormikContext();
  const {
    addOns,
    ccInformation,
    event,
    renterInformation,
    renterNotes,
    adminNotes,
    rv_spot,
    rvProductId,
    selectedStalls,
    selectedRvs,
    stalls,
    stallProductId,
    deferredGroupId,
    multipayment
  } = values;

  const rvProducts = event.rvProducts || [];
  const rvProduct = rvProducts.find(rvProduct => rvProductId && rvProductId === rvProduct.id) || {};
  const rvLot = (rvProduct.rvLot && rvProduct.rvLot.name) || '';
  const { start: stallsStart, end: stallsEnd, quantity: stallsQuantity } = stalls;
  const { start: rvsStart, end: rvsEnd, quantity: rvsQuantity } = rv_spot;
  const componentRef = useRef();
  const orderItemsArray = useMemo(
    () =>
      mapOrderItems({
        addOns,
        stallProductId,
        stallsQuantity,
        stallsStart,
        stallsEnd,
        rvProductId,
        rvsQuantity,
        rvsStart,
        rvsEnd
      }),
    [JSON.stringify(addOns), stallProductId, stallsQuantity, stallsStart, stallsEnd, rvProductId, rvsQuantity, rvsStart, rvsEnd]
  );
  const stripe = useStripe();
  const elements = useElements();
  const [isNonUS, setIsNonUS] = useState(false);

  const handlePrint = async (resolve, reject, e) => {
    if (await handleSubmit(e)) {
      resolve();
      return;
    }
    reject();
  };

  const { data: reservationStatusesData } = useQuery(RESERVATION_STATUSES);
  let reservationStatuses = [];
  if (reservationStatusesData) {
    reservationStatuses = reservationStatusesData.reservationStatuses.map(status => {
      return { value: status.id, label: status.name };
    });
  }

  const [getOrderCosts, { data: orderCosts }] = useLazyQuery(ORDER_CREATE_COSTS);
  const [getGroupById, { data: group }] = useLazyQuery(GROUP_BY_ID);

  const getCardIsNonUS = async () => {
    if (ccInformation.nameOnCard || (ccInformation.zipCode && elements)) {
      const cardInfo = {
        card: elements.getElement(CardNumberElement),
        name: ccInformation.nameOnCard,
        zip: ccInformation.zipCode
      };
      const strToken = await createStripeToken(stripe, cardInfo);
      await setIsNonUS(strToken?.token?.card.country !== 'US');
    } else if (ccInformation.country) {
      await setIsNonUS(ccInformation.country !== 'US');
    }
  };
  useEffect(() => {
    if (!!orderItemsArray && orderItemsArray.length > 0) {
      getCardIsNonUS();
      getOrderCosts({
        variables: {
          input: {
            selectedOrderItems: orderItemsArray,
            useCard: ccInformation && ccInformation.useCard,
            isNonUSCard: isNonUS
          }
        }
      });
    }
  }, [JSON.stringify(orderItemsArray), ccInformation, isNonUS]);

  useEffect(() => {
    if (deferredGroupId) {
      getGroupById({ variables: { id: deferredGroupId } });
    }
  }, [group, deferredGroupId]);

  const actualOrderCosts = orderCosts?.orderCosts;

  const { total } = actualOrderCosts ? actualOrderCosts : {};
  const { firstName, lastName, email, phone } = renterInformation;
  const { selectedCard, selectedCardBrand, stripeToken, useCard } = ccInformation;

  const getStatusName = statusId => {
    const match = reservationStatuses.filter(status => status.value === statusId);
    return match[0].label;
  };

  const getSelected = selectedItems => {
    let selected = selectedItems.map(item => item.name).sort(alphaNumericComparator);
    if (selected.length > 1) {
      return selected.join(', ');
    }
    return selected;
  };

  const getOrderItems = () => {
    const orderItems = [];
    Object.keys(addOns).forEach(addOn => {
      const item = event.addOnProducts.find(product => product.id === addOn);
      const buildAddOn = {
        id: addOn,
        quantity: addOns[addOn],
        addOnProduct: {
          addOn: { ...item.addOn },
          price: item.price
        }
      };
      orderItems.push(buildAddOn);
    });
    const matchingStallProduct = event.stallProducts?.find(stall => stall.id == stallProductId);
    const matchingRvProduct = event.rvProducts?.find(rv => rv.id == rvProductId);

    const stallReservation = {
      id: stallProductId,
      reservation: {
        id: stallProductId,
        endDate: stallsEnd,
        startDate: stallsStart,
        stalls: selectedStalls,
        status: { name: stalls.status ? getStatusName(stalls.status) : 'Reserved' },
        stallProduct: {
          nightly: matchingStallProduct?.nightly,
          price: matchingStallProduct?.price,
          name: matchingStallProduct?.name
        }
      },
      quantity: stallsQuantity
    };
    const rvReservation = {
      id: rvProductId,
      reservation: {
        id: rvProductId,
        endDate: rvsEnd,
        startDate: rvsStart,
        rvSpots: selectedRvs,
        status: { name: rv_spot.status ? getStatusName(rv_spot.status) : 'Reserved' },
        rvProduct: {
          nightly: matchingRvProduct?.nightly,
          price: matchingRvProduct?.price,
          name: rvProduct?.name,
          rvLot: {
            name: rvLot
          }
        }
      },
      quantity: rvsQuantity
    };
    if (stallsStart) orderItems.push(stallReservation);
    if (rvsStart) orderItems.push(rvReservation);
    return orderItems;
  };

  const orderForPrintPayments = multipayment?.isMultipayment
    ? [
        {
          amount: Number(multipayment.totalToCard),
          cardPayment: useCard,
          cardBrand: selectedCard ? selectedCardBrand : stripeToken?.token?.card.brand,
          last4: selectedCard ? selectedCard : stripeToken?.token?.card.last4
        },
        {
          amount: Number(multipayment.totalToCash),
          cardPayment: false,
          cardBrand: null,
          last4: null
        }
      ]
    : [
        {
          id: 1,
          amount: total,
          cardPayment: useCard,
          cardBrand: selectedCard ? selectedCardBrand : stripeToken?.token?.card.brand,
          last4: selectedCard ? selectedCard : stripeToken?.token?.card.last4
        }
      ];

  const buildOrderHistory = () => {
    const orderHistory = [];
    const payment = {
      id: 1,
      amount: total,
      cardPayment: useCard,
      cardBrand: selectedCard ? selectedCardBrand : stripeToken?.token?.card.brand,
      last4: selectedCard ? selectedCard : stripeToken?.token?.card.last4
    };
    const payments = orderForPrintPayments;
    if (values.stallProductId) {
      const stallProduct = values.event.stallProducts.find(sp => sp.id == values.stallProductId);

      const stallOrderHistory = {
        createdAt: moment(),
        endDate: moment(values.stalls.end).format('YYYY-MM-DD'),
        startDate: moment(values.stalls.start).format('YYYY-MM-DD'),
        quantity: values.stalls.quantity,
        nightly: stallProduct?.nightly,
        groupOrderBill: { id: group?.group.id, amount: total },
        productName: stallProduct?.name,
        productType: 'stalls',
        ...(multipayment?.isMultipayment ? { payments } : { payment })
      };
      orderHistory.push(stallOrderHistory);
    }
    if (values.rvProductId) {
      const rvProduct = values.event.rvProducts.find(sp => sp.id == values.rvProductId);
      const rvOrderHistory = {
        createdAt: moment(),
        endDate: moment(values.rv_spot.end).format('YYYY-MM-DD'),
        startDate: moment(values.rv_spot.start).format('YYYY-MM-DD'),
        quantity: values.rv_spot.quantity,
        nightly: rvProduct?.nightly,
        groupOrderBill: { id: group?.group.id, amount: total },
        productName: rvProduct?.name,
        productType: 'rvs',
        ...(multipayment?.isMultipayment ? { payments } : { payment })
      };
      orderHistory.push(rvOrderHistory);
    }
    Object.keys(values.addOns)?.forEach(id => {
      const addOnProduct = values.event.addOnProducts.find(addOn => addOn.id == id);
      const addOnOrderHistory = {
        createdAt: moment(),
        quantity: values.addOns[id],
        groupOrderBill: { id: group?.group.id, amount: total },
        productName: addOnProduct?.addOn.name,
        productType: 'addOns',
        ...(multipayment?.isMultipayment ? { payments } : { payment })
      };
      orderHistory.push(addOnOrderHistory);
    });
    return orderHistory;
  };

  const orderForPrint = {
    event,
    addOns,
    orderHistory: buildOrderHistory(),
    total,
    fee: actualOrderCosts?.stripeFee,
    platformFee: actualOrderCosts?.serviceFee,
    notes: renterNotes,
    orderItems: getOrderItems(),
    group: group?.group,
    payments: orderForPrintPayments,
    user: {
      fullName: `${firstName} ${lastName}`,
      email: `${email}`,
      phone: `${phone}`
    }
  };

  const getPaymentText = () => {
    if (values.deferredGroupId) return 'Deferred';
    if (multipayment?.isMultipayment) {
      return (
        <>
          <p>Credit Card</p>
          <p>Cash/Check</p>
        </>
      );
    }
    return ccInformation.useCard ? 'Credit Card' : 'Cash/Check';
  };

  const showTotal = () => {
    if (multipayment?.isMultipayment) {
      return (
        <>
          <p>${Number(multipayment.totalToCard).toFixed(2)}</p>
          <p>${Number(multipayment.totalToCash).toFixed(2)}</p>
          <p>
            <strong>{`${total ? (total <= 0 ? '$0.00' : `$${total.toFixed(2)}`) : '$0.00'}`}</strong>
          </p>
        </>
      );
    }
    return (
      <p>
        <strong>{`${total ? (total <= 0 ? '$0.00' : `$${total.toFixed(2)}`) : '$0.00'}`}</strong>
      </p>
    );
  };

  const mappedAddOns = renderAddOns(event.addOnProducts, addOns);
  return (
    <Modal className={`${className}__order-details-modal`} heading={heading} open={open} dataTestId="review_modal">
      <FlexWrapper>
        <RenterDetailsWrapper>
          <FlexRow>
            <FlexColumn>
              <ContactItem>
                <p>Email</p>
                <p className={`${className}__renter-email`}>{`${email}`}</p>
              </ContactItem>
            </FlexColumn>
            <FlexColumn>
              <ContactItem>
                <p>Phone number</p>
                <p>{`${normalizePhone(phone)}`}</p>
              </ContactItem>
            </FlexColumn>
            <FlexColumn>
              <Item>
                <p>Renter Name</p>
                <p className={`${className}__proper-name`}>{`${firstName} ${lastName}`}</p>
              </Item>
            </FlexColumn>
          </FlexRow>
          <FlexRow>
            <FlexColumn>
              <Item>
                <p>Event</p>
                <p>{`${event.name}`}</p>
              </Item>
            </FlexColumn>
            <FlexColumn>
              <Item>
                <p>Total Due</p>
                {showTotal()}
              </Item>
            </FlexColumn>
            <FlexColumn>
              <Item>
                <p>Payment Method</p>
                {getPaymentText()}
              </Item>
            </FlexColumn>
          </FlexRow>
        </RenterDetailsWrapper>

        {stallProductId && (
          <>
            <SectionHeader>
              <span className={`${className}__header_text`}>Stalls</span>
              <Divider className={`${className}__divider`} />
            </SectionHeader>

            <FlexRow>
              <FlexColumn>
                <Item>
                  <p>Dates</p>
                  <p>{stalls.start && stalls.end ? `${moment(stalls.start).format('MM/DD/YY')} - ${moment(stalls.end).format('MM/DD/YY')}` : '-'}</p>
                </Item>
              </FlexColumn>
              <FlexColumn>
                <Item>
                  <p>Stalls</p>
                  <p>{selectedStalls.length > 0 ? getSelected(selectedStalls) : '-'}</p>
                </Item>
              </FlexColumn>
              <FlexColumn>
                <Item>
                  <p>Status</p>
                  <p className={`${className}__status`}>{stalls && stalls.status ? getStatusName(stalls.status) : 'Reserved'}</p>
                </Item>
              </FlexColumn>
            </FlexRow>
          </>
        )}

        {rvProductId && (
          <>
            <SectionHeader>
              <span className={`${className}__header_text`}>RV Spots</span>
              <Divider className={`${className}__divider`} />
            </SectionHeader>

            <FlexRow>
              <FlexColumn>
                <Item>
                  <p>Dates</p>
                  <p>{rv_spot.start && rv_spot.end ? `${moment(rv_spot.start).format('MM/DD/YY')} - ${moment(rv_spot.end).format('MM/DD/YY')}` : '-'}</p>
                </Item>
              </FlexColumn>
              <FlexColumn>
                <Item>
                  <p>Spots</p>
                  <p>
                    {rvLot} <br />
                    {selectedRvs.length > 0 ? getSelected(selectedRvs) : `${rv_spot.quantity} ${pluralizeName('spot', rv_spot.quantity)}`}
                  </p>
                </Item>
              </FlexColumn>
              <FlexColumn>
                <Item>
                  <p>Status</p>
                  <p className={`${className}__status`}>{rv_spot && rv_spot.status ? getStatusName(rv_spot.status) : 'Reserved'}</p>
                </Item>
              </FlexColumn>
            </FlexRow>
          </>
        )}

        {mappedAddOns.length > 0 && (
          <>
            <SectionHeader>
              <span className={`${className}__header_text`}>Add Ons</span>
              <Divider className={`${className}__divider`} />
            </SectionHeader>

            <FlexRow>
              {mappedAddOns.map(addOn => {
                return (
                  <FlexColumn key={addOn.addOn.id}>
                    <Item>
                      <p className={`${className}__addon-name`}>{capitalize(addOn.addOn.name)}</p>
                      <p>{`${addOn.quantity} ${capitalize(pluralizeName(addOn.addOn.unitName, addOn.quantity))}`}</p>
                    </Item>
                  </FlexColumn>
                );
              })}
            </FlexRow>
          </>
        )}

        {renterNotes && (
          <>
            <SectionHeader>
              <span className={`${className}__header_text`}>Special Requests</span>
              <Divider className={`${className}__divider`} />
            </SectionHeader>

            <FlexRow>
              <Item>
                <span className={`${className}__renter_notes`}>{renterNotes ? renterNotes : '-'}</span>
              </Item>
            </FlexRow>
          </>
        )}

        {adminNotes && (
          <>
            <SectionHeader>
              <span className={`${className}__header_text`}>Admin Notes</span>
              <Divider className={`${className}__divider`} />
            </SectionHeader>

            <FlexRow>
              <Item>
                <span className={`${className}__renter_notes`}>{adminNotes ? adminNotes : '-'}</span>
              </Item>
            </FlexRow>
          </>
        )}

        <div style={{ display: 'none' }}>
          <PrintReceipt order={orderForPrint} saveAndPrint ref={componentRef} />
        </div>

        <FormButton
          className={`${className}__edit-details-button`}
          data-testid="review-and-save-edit-button"
          secondary
          variant="contained"
          size="large"
          onClick={close}>
          EDIT
        </FormButton>
        <FlexButtonWrapper>
          <ReactToPrint
            trigger={() => (
              <FormButton
                className={`${className}__print-button`}
                data-testid="review-and-save-print-button"
                secondary
                variant="contained"
                size="large"
                disabled={isSubmitting}>
                SAVE & PRINT
              </FormButton>
            )}
            content={() => componentRef.current}
            onBeforePrint={async e => {
              await new Promise((resolve, reject) => {
                handlePrint(resolve, reject, e);
              });
            }}
          />
          <FormButton data-testid="review-and-save-save-button" primary variant="contained" size="large" onClick={e => handleSubmit(e)} disabled={isSubmitting}>
            SAVE
          </FormButton>
          {isSubmitting && <CircularProgress size={24} className={`${className}__progress-spinner`} />}
        </FlexButtonWrapper>
      </FlexWrapper>
    </Modal>
  );
};

const ReviewOrderCreationModal = styled(ReviewOrderCreationBase)`
  display: flex;
  flex-direction: column;
  margin-top: 32px;
  height: 100%;
  justify-content: space-around;

  &__order-details-modal {
    .MuiCard-root {
      overflow-y: scroll;
      max-height: 100%;
      padding: 20px 20px 0;
    }

    button {
      margin-bottom: 20px;
    }
  }

  &__edit-details-button {
    position: absolute !important;
    right: 20px;
    top: 20px;
  }

  &__print-button {
    background: white !important;
    color: black !important;
    border: 1px solid black !important;
  }

  &__addon-name {
    font-weight: bold;
  }

  &__renter_notes {
    padding-top: 20px;
    font-family: IBMPlexSans-Regular;
    font-size: 16px;
    font-weight: 400;
    letter-spacing: normal;
    line-height: 25px;
  }

  &__status {
    text-transform: capitalize;
  }

  &__progress-spinner {
    &&& {
      bottom: 4%;
      color: ${colors.primary};
      left: 82%;
      position: absolute;
    }
  }

  &__renter-email {
    line-break: anywhere;
  }

  &__proper-name {
    text-transform: capitalize;
  }

  &__event-details-modal {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        height: auto;
        max-height: 100% !important;
        overflow: scroll !important;
      }
    }
    h4 {
      margin-bottom: 30px;
    }
  }

  &__divider {
    width: 100%;
    background-color: ${colors.border.primary};
  }

  &__header_text {
    margin-right: 10px;
    font-family: IBMPlexSans-SemiBold;
    font-size: 22px;
    letter-spacing: 0.97px;
    line-height: 25px;
    white-space: nowrap;
  }
`;

const SectionHeader = styled.div`
  ${displayFlex}
  width: 100%;
  align-items: center;
  overflow: hidden;
`;

const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  &:first-child {
    margin: 0 0 30px 0;
  }
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    &:first-child {
      margin: 0 0 30px 0;
    }
  }

  p:nth-child(1) {
    ${paragraphBold}
    align-self: flex-start;
    margin: 0;
    padding: 20px 0 0;
  }
  p:not(:nth-child(1)) {
    ${paragraphReg}
    margin: 5px 0 0;
    width: 170px;
  }
`;

const RenterDetailsWrapper = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FlexRow = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

const FlexColumn = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 230px;
`;

const Item = styled.div`
  ${displayFlex}
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0 20px 20px 0;
`;

const ContactItem = styled(Item)`
  margin: 0 20px 0 0;
`;

const FlexButtonWrapper = styled(FlexWrapper)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-end;
  align-self: flex-end;
  width: 100%;
  position: unset;
  margin-top: 20px;
  @media screen and (max-width: 601px) {
    ${displayFlex}
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    margin: 20px 0 0;
  }
`;

const FormButton = styled(Button)`
  &&& {
    line-height: 0;
    width: 175px;
    margin-left: ${props => (props.primary ? 20 : 0)}px;
  }
`;

export default ReviewOrderCreationModal;
