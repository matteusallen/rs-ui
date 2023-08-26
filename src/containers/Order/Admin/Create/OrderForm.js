// @flow
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import { CardActions } from '@material-ui/core';
import { useFormikContext } from 'formik';
import { CardNumberElement } from '@stripe/react-stripe-js';
import AdminNotes from '../shared/AdminNotes';
import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex, isMobile } from '../../../../styles/Mixins';
import BasicInformation from '../shared/BasicInformation';
import Stalls from '../shared/Stalls';
import RvSpots from '../shared/RvSpots';
import AddOnsProductCard from '../shared/AddOnsProductCard';
import SpecialRequests from '../shared/SpecialRequests';
import PaymentDetails from '../shared/PaymentDetails';
import OrderSummary from './OrderSummary';
import ReviewOrderCreation from './ReviewOrderCreationModal';
import { createStripeToken, isPaymentInformationValid } from '../../shared/sharedMethods';
import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import { buildOrderItems } from '../../../../helpers';

import ContextSnackbar from '../../../../components/Snackbar';
import Sticky from '../../../../components/Sticky';

import { subRouteCodes as SUB_ROUTES } from '../../../../constants/routes';
import CancelLink from '../../../../components/Button/CancelLink';
import { isEmpty } from '../../../../helpers';

import type { UserType } from '../../../../pages/Admin/Users';
import type { StripeTokenType } from '../../shared/sharedMethods';

import { hasProductsSelectedForPurchase } from '../../../../helpers/formFieldHelpers';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';

import ReviewAndSaveButton from './ReviewAndSaveButton';

import { initialValues } from './index';

type OrderFormBasePropsType = {|
  adminUser: UserType,
  className: string,
  elements: {
    getElement: CardNumberElement => string
  },
  stripe: StripeTokenType
|};

function OrderFormBase(props: OrderFormBasePropsType): React$Element<'div'> {
  const { adminUser, className, elements, stripe } = props;
  const { dirty, errors, isSubmitting, setFieldValue, submitForm, values, setValues } = useFormikContext();
  const eventId = (values.event && values.event.id) || null;

  const [isModalOpen, setModalOpen] = useState(false);
  const [isStallsOpen, setStallsOpen] = useState(false);
  const [isRVsOpen, setRVsOpen] = useState(false);
  const [isAddOnsOpen, setAddOnsOpen] = useState(false);
  const [noPaymentRequired, setNoPaymentRequired] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState({ card: true });
  const [totalWithFee, setTotalWithFee] = useState(0);
  const [stallQuestionsAreValid, setStallQuestionsAreValid] = useState(true);
  const [rvQuestionsAreValid, setRvQuestionsAreValid] = useState(true);

  const hasFormikErrors = errors => {
    const errorsBlockingSubmit = { ...errors };

    if (values.isBelowMinNights.stalls || values.isBelowMinNights.rvs) {
      return true;
    }

    if (
      errorsBlockingSubmit.ccInformation &&
      errorsBlockingSubmit.ccInformation.nameOnCard &&
      errorsBlockingSubmit.ccInformation.stripeToken &&
      errorsBlockingSubmit.ccInformation.zipCode &&
      !values.newCard
    ) {
      delete errorsBlockingSubmit.ccInformation;
    }

    if (errorsBlockingSubmit.ccInformation && Object.keys(errorsBlockingSubmit.ccInformation).length === 1 && errorsBlockingSubmit.ccInformation.stripeToken) {
      delete errorsBlockingSubmit.ccInformation;
    }

    return !isEmpty(errorsBlockingSubmit);
  };

  const buildStripeToken = async values => {
    const cardInfo = {
      card: elements.getElement(CardNumberElement),
      name: values.ccInformation.nameOnCard,
      zip: values.ccInformation.zipCode
    };
    const stripeToken = await createStripeToken(stripe, cardInfo);
    setFieldValue('ccInformation.stripeToken', stripeToken);
  };

  const openReviewModalClicked = async () => {
    if (values.ccInformation.useCard && !values.ccInformation.selectedCard) {
      await buildStripeToken(values);
    } else {
      setFieldValue('ccInformation.stripeToken', null);
    }
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    window.scrollTo(0, 0);
    setFieldValue('isSubmitting', true);
    await Promise.resolve();
    let completed = await submitForm()
      .then(() => {
        setModalOpen(false);
        return true;
      })
      .catch(() => {
        setModalOpen(false);
        return false;
      });
    return completed;
  };

  const checkOpenTabs = () => {
    return Boolean(
      (isStallsOpen && !values.stalls.quantity) || (isAddOnsOpen && Object.keys(values.addOns).length === 0) || (isRVsOpen && !values.rv_spot.quantity)
    );
  };

  const isCheckoutDisabled =
    (values.ccInformation.groupBill && !values.deferredGroupId) ||
    !dirty ||
    !hasProductsSelectedForPurchase(values) ||
    hasFormikErrors(errors) ||
    isSubmitting ||
    !isPaymentInformationValid(values, elements) ||
    checkOpenTabs() ||
    Object.keys(values.hasEmptyStallQuestions)?.length ||
    Object.keys(values.hasEmptyRVQuestions)?.length ||
    !stallQuestionsAreValid ||
    !rvQuestionsAreValid;

  useEffect(() => {
    if (eventId) {
      setValues(
        {
          ...initialValues,
          event: values.event,
          renterInformation: values.renterInformation,
          ccInformation: values.ccInformation
        },
        true
      );
    }
  }, [eventId]);

  const orderItemsArray = buildOrderItems(values);
  const { data: orderCosts, loading: orderCostsLoading } = useQuery(ORDER_CREATE_COSTS, {
    variables: {
      input: {
        selectedOrderItems: orderItemsArray,
        useCard: false,
        isNonUSCard: false
      }
    },
    skip: !orderItemsArray.length,
    fetchPolicy: 'network-only'
  });

  const actualOrderCosts = orderCosts && orderCosts.orderCosts;
  const { total, discount, serviceFee } = actualOrderCosts ? actualOrderCosts : {};

  useEffect(() => {
    if (!total && !discount) return;
    if (total === 0 && discount > 0 && !orderCostsLoading && !noPaymentRequired) {
      setFieldValue('deferredGroupId', null);
      setFieldValue('ccInformation.useCard', false);
      setFieldValue('ccInformation.groupBill', false);
      setNoPaymentRequired(true);
    } else if (!(total === 0 && discount > 0) && noPaymentRequired) {
      setNoPaymentRequired(false);
      setFieldValue('ccInformation.useCard', true);
    }
  }, [total, discount, orderCostsLoading]);

  useEffect(() => {
    if (paymentOptions && paymentOptions.card && paymentOptions.cash) {
      setFieldValue('multipayment.isMultipayment', true);
    } else {
      setFieldValue('multipayment.isMultipayment', false);
    }
  }, [paymentOptions]);

  const canAddAdminNotes = useValidateAction('orders', actions.ADMIN_NOTES);

  return (
    <div className={className}>
      <ContextSnackbar />
      <section className={`${className}__form-section`}>
        <div className={`${className}__form-container`}>
          <div className={`${className}__form-column-left`}>
            <BasicInformation adminUser={adminUser} />
            <Stalls setStallsOpen={setStallsOpen} setStallQuestionsAreValid={setStallQuestionsAreValid} />
            <RvSpots setRVsOpen={setRVsOpen} isStallsOpen={isStallsOpen} setRvQuestionsAreValid={setRvQuestionsAreValid} />
            <AddOnsProductCard setAddOnsOpen={setAddOnsOpen} />
            {canAddAdminNotes && <AdminNotes adminNotes={values.adminNotes} setAdminNotes={e => setFieldValue('adminNotes', e)} isOpen />}
            <SpecialRequests />
            <PaymentDetails
              total={total}
              totalWithFee={totalWithFee}
              discount={discount}
              orderCostsLoading={orderCostsLoading}
              stripe={stripe}
              paymentOptions={paymentOptions}
              setPaymentOptions={setPaymentOptions}
              serviceFee={serviceFee}
            />
          </div>
          {isMobile() ? (
            <div className={`${className}__form-column-right`}>
              <OrderSummary />
              <CardActionsBase>
                <CancelLink secondary variant="contained" size="large" to={SUB_ROUTES.ADMIN.ORDERS}>
                  CANCEL
                </CancelLink>
                <ReviewAndSaveButton disabled={isCheckoutDisabled} onClick={openReviewModalClicked} />
              </CardActionsBase>
            </div>
          ) : (
            <Sticky>
              <div className={`${className}__form-column-right`}>
                <OrderSummary key={eventId} stripe={stripe} elements={elements} setTotal={setTotalWithFee} />
                <CardActionsBase>
                  <CancelLink secondary variant="contained" size="large" to={SUB_ROUTES.ADMIN.ORDERS}>
                    CANCEL
                  </CancelLink>
                  <ReviewAndSaveButton disabled={isCheckoutDisabled} onClick={openReviewModalClicked} />
                </CardActionsBase>
              </div>
            </Sticky>
          )}
        </div>
      </section>
      <ReviewOrderCreation close={() => setModalOpen(false)} handleSubmit={handleSubmit} heading={'Review Reservation Details'} open={isModalOpen} />
    </div>
  );
}

const OrderForm = styled(OrderFormBase)`
  &__form-section {
    max-width: 1305px;
  }
  &__form-container {
    ${displayFlex}
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    @media screen and (min-width: 960px) {
      ${displayFlex}
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
    p {
      ${paragraphReg}
    }
    h5 {
      margin: 12px 0 20px;
    }
  }
  &__form-column-left {
    ${displayFlex}
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 700px;
    margin-right: 10px;
  }
  &__form-column-right {
    &&& {
      align-self: baseline;
      margin-left: 0px;
    }
    @media screen and (min-width: 960px) {
      ${displayFlex}
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 584px;
      padding-left: 10px;
      margin-left: 10px;
    }
  }
`;

const CardActionsBase = styled(CardActions)`
  ${displayFlex}
  flex-direction: row;
  justify-content: flex-end;
  align-self: flex-end;
  width: 100%;
  &&& {
    padding: 8px 0;
  }
`;

export default OrderForm;
