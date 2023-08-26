//@flow
import { CardNumberElement, CardExpiryElement, CardCvcElement, Elements } from '@stripe/react-stripe-js';
import _omit from 'lodash.omit';
import type { ReservationFormShapeType } from '../Renter/Create';
import type { OrderCheckoutInputType, OrderItemInputType } from '../../../mutations/OrderCheckout';
import { stripNonDigits } from 'Helpers/normalize';
import type { UserType } from '../../../pages/Admin/Users';
import PRODUCT_REF_TYPE from 'Constants/productRefType';
import { DATE_FORMAT, isEmpty } from '../../../helpers';
import client from 'Lib/api';

type StripeFieldType = {|
  _complete: boolean,
  _empty: boolean,
  _invalid: boolean
|};

const isFieldValid = (field?: StripeFieldType): boolean => !!field && !field._invalid && field._complete && !field._empty;

export const isPaymentInformationValid = (values: ReservationFormShapeType, elements: Elements): boolean => {
  if (!values || !elements) return false;
  if (!values.ccInformation.useCard) return true;
  if (values.ccInformation.selectedCard) return true;
  const card = elements.getElement(CardNumberElement);
  const ccv = elements.getElement(CardCvcElement);
  const exp = elements.getElement(CardExpiryElement);
  return isFieldValid(card) && isFieldValid(ccv) && isFieldValid(exp);
};

export const isZeroRatePaymentValid = (total: Float, discount: Float, errors): boolean => {
  const parsedErrors = _omit(errors, 'ccInformation');
  return total === 0 && discount > 0 && isEmpty(parsedErrors);
};

export type StripeTokenType = {|
  createToken: (
    card: string,
    {
      address_country: string,
      address_zip: string,
      name: string
    }
  ) => Promise<void>
|};

export async function createStripeToken(stripe: StripeTokenType, cardInfo: { card: string, name: string, zip: string }): Promise<void> {
  return await stripe.createToken(cardInfo?.card, {
    name: cardInfo.name,
    address_zip: cardInfo.zip,
    address_country: 'US'
  });
}

export type OrderCheckoutPramsType = (input: OrderCheckoutInputType) => Promise<{ data: { checkout: { success: boolean } } }>;

type HandleSubmitParamsType = {|
  orderCheckout: OrderCheckoutPramsType,
  stripeToken?: { token: { id: string } },
  user: UserType,
  values: ReservationFormShapeType
|};

export const handleSubmit = async (params: HandleSubmitParamsType) => {
  const {
    stripeToken,
    values: { renterInformation, renterNotes, ccInformation, event, deferredGroupId, adminNotes, productQuestionAnswers, multipayment, group },
    orderCheckout,
    user,
    isZeroRatesForm
  } = params;
  const { venue } = event;
  const ccCountry = stripeToken?.token.card.country || ccInformation.country;
  const checkoutResponse = await orderCheckout({
    userInput: {
      id: renterInformation.id,
      email: String(renterInformation.email || '').toLocaleLowerCase(),
      firstName: String(renterInformation.firstName || '').toLocaleLowerCase(),
      lastName: String(renterInformation.lastName || '').toLocaleLowerCase(),
      phone: stripNonDigits(renterInformation.phone),
      venueId: venue.id
    },
    orderInput: {
      orderItems: getOrderItems(params),
      productQuestionAnswers,
      eventId: event.id,
      adminNotes: adminNotes || '',
      notes: String(renterNotes || '').toLocaleLowerCase(),
      userId: renterInformation.id
    },
    paymentInput: {
      token: stripeToken ? stripeToken.token.id : '',
      description: 'payment description',
      saveCard: ccInformation ? ccInformation.saveCard : false,
      selectedCard: ccInformation ? ccInformation.selectedCard : null,
      useCard: ccInformation && !isZeroRatesForm ? ccInformation.useCard : false,
      adminId: user.id,
      isNonUSCard: ccCountry !== 'US'
    },
    groupId: deferredGroupId ? Number(deferredGroupId) : group ? Number(group.id) : null,
    groupCode: group ? group.code : null,
    multipaymentInput: multipayment
  });

  if (params.values.ccInformation?.saveCard && checkoutResponse?.data.checkout.success) {
    Object.keys(client.cache.data.data)?.forEach(key => key.match(/^User/) && client.cache.data.delete(key));
  }
  return checkoutResponse;
};

const getOrderItems = ({
  values: { selectedRvs, selectedStalls, stalls, stallProductId, addOns, rvProductId, rv_spot }
}: HandleSubmitParamsType): OrderItemInputType[] => {
  const items: OrderItemInputType[] = [];
  const stallEndDate = stalls.end && stalls.end.format(DATE_FORMAT) ? stalls.end.format(DATE_FORMAT) : '';
  const stallStartDate = stalls.start && stalls.start.format(DATE_FORMAT) ? stalls.start.format(DATE_FORMAT) : '';
  const rvEndDate = rv_spot.end && rv_spot.end.format(DATE_FORMAT) ? rv_spot.end.format(DATE_FORMAT) : '';
  const rvStartDate = rv_spot.start && rv_spot.start.format(DATE_FORMAT) ? rv_spot.start.format(DATE_FORMAT) : '';
  const assignedStalls = selectedStalls && selectedStalls.map(stall => Number(stall.id));
  const assignedRvs = selectedRvs && selectedRvs.map(rv => Number(rv.id));

  if (!!stallProductId && !!stallEndDate && !!stallStartDate && Number(stalls.quantity) > 0) {
    items.push({
      xProductId: stallProductId,
      xRefTypeId: PRODUCT_REF_TYPE.STALL_PRODUCT,
      quantity: Number(stalls.quantity),
      startDate: stallStartDate,
      endDate: stallEndDate,
      assignments: assignedStalls ? assignedStalls : [],
      statusId: stalls.status ? Number(stalls.status) : 1
    });
  }

  if (!!rvProductId && !!rvEndDate && !!rvStartDate && Number(rv_spot.quantity) > 0) {
    items.push({
      xProductId: rvProductId,
      xRefTypeId: PRODUCT_REF_TYPE.RV_PRODUCT,
      quantity: Number(rv_spot.quantity),
      startDate: rvStartDate,
      endDate: rvEndDate,
      assignments: assignedRvs ? assignedRvs : [],
      statusId: rv_spot.status ? Number(rv_spot.status) : 1
    });
  }

  Object.keys(addOns).forEach(addOnId => {
    if (Number(addOns[addOnId]) < 1) return;
    items.push({
      xProductId: addOnId,
      xRefTypeId: PRODUCT_REF_TYPE.ADD_ON_PRODUCT,
      quantity: Number(addOns[addOnId])
    });
  });

  return items;
};
