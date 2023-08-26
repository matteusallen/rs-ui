// @flow
import React from 'react';
import { compose } from 'recompose';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { withRouter } from 'react-router';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { handleSubmit } from '../../shared/sharedMethods';
import withStripe from '../../../../enhancers/withStripe';

import OrderForm from './OrderForm';
import ContextSnackbar from '../../../../components/Snackbar';

import { withOrderCheckout } from '../../../../mutations/OrderCheckout';
import { withUserContext } from '../../../../store/UserContext';
import { withSnackbarContextActions } from '../../../../store/SnackbarContext';

import type { ReservationPropsType } from '../../Renter/Create';
import { reportGraphqlError } from '../../../../helpers/graphqlResponseUtil';
import { isMaximumAllowedExceeded } from '../../../../helpers/productLimits';

export const initialValues = {
  availability: [],
  event: {},
  sameDates: false,
  ccInformation: {
    nameOnCard: null,
    saveCard: false,
    selectedCard: null,
    zipCode: null,
    useCard: true,
    stripeToken: null,
    groupBill: false,
    country: ''
  },
  renterInformation: {
    id: null,
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    savedCreditCard: []
  },
  addOnsQuantities: [],
  addOns: {},
  rv_spot: {
    status: '',
    start: null,
    end: null,
    quantity: null
  },
  productQuestionAnswers: [],
  stalls: {
    status: '',
    start: null,
    end: null,
    quantity: null
  },
  hasEmptyRVQuestions: {},
  hasEmptyStallQuestions: {},
  renterNotes: null,
  adminNotes: '',
  reservationEdit: false,
  selectedRvs: [],
  selectedStalls: [],
  rvProductId: '',
  stallProductId: '',
  startDate: '',
  isSubmitting: false,
  ccChange: 0,
  deferredGroupId: null,
  newCard: false,
  selectedStallMinNights: 0,
  selectedRVMinNights: 0,
  isBelowMinNights: {
    stalls: false,
    rvs: false
  }
};

function AdminCreateOrder(props: ReservationPropsType): React$Node {
  const { orderCheckout, user: adminUser } = props;
  const stripe = useStripe();
  const elements = useElements();

  const AdminOrderCreateSchema = Yup.object().shape({
    rv_spot: Yup.object().shape({
      quantity: Yup.string()
        .nullable()
        .test('match', 'Maximum exceeded', function(): boolean {
          const quantity = Number(getValueByPropPath(this, 'parent.quantity', 0));
          if (quantity >= 0 && !isMaximumAllowedExceeded(quantity, 'rvProduct')) {
            return true;
          }
          return false;
        })
    }),
    stalls: Yup.object().shape({
      quantity: Yup.string()
        .nullable()
        .test('match', 'Maximum exceeded', function(): boolean {
          const quantity = Number(getValueByPropPath(this, 'parent.quantity', 0));
          if (quantity >= 0 && !isMaximumAllowedExceeded(quantity, 'rvProduct')) {
            return true;
          }
          return false;
        })
    }),
    selectedStalls: Yup.array().test('match', 'Please finish assigning the stalls or clear all the assigned stalls to save this reservation', function(
      selectedStalls: {}[]
    ): boolean {
      const quantity = Number(getValueByPropPath(this, 'options.parent.stalls.quantity', 0));
      if (quantity > 0 && selectedStalls.length > 0) {
        return quantity === selectedStalls.length;
      }
      return true;
    }),
    selectedRvs: Yup.array().test('match', 'Please finish assigning the spots or clear all the assigned spots to save this reservation', function(
      selectedRvs: {}[]
    ): boolean {
      const quantity = Number(getValueByPropPath(this, 'options.parent.rv_spot.quantity', 0));
      if (quantity > 0 && selectedRvs.length > 0) {
        return quantity === selectedRvs.length;
      }
      return true;
    }),
    adminNotes: Yup.string()
      .max(250)
      .nullable(),
    ccInformation: Yup.object().shape({
      nameOnCard: Yup.string('Name on card is required').when(['selectedCard', 'useCard'], {
        is: (selectedCard, useCard) => !selectedCard && useCard,
        then: Yup.string()
          .min(2, 'Name on card is too short')
          .max(50, 'Name on card is too long')
          .matches(/^[^\s].*[^\s]+$/i, 'Invalid Name on card')
          .nullable()
          .required('Name on card is required'),
        otherwise: Yup.string().nullable()
      }),
      saveCard: Yup.boolean().required(),
      selectedCard: Yup.string()
        .length(4)
        .nullable(),
      zipCode: Yup.string().when(['selectedCard', 'useCard'], {
        is: (selectedCard, useCard) => !selectedCard && useCard,
        then: Yup.string()
          .nullable()
          .required('Billing zip code is required'),
        otherwise: Yup.string().nullable()
      }),
      useCard: Yup.boolean().required(),
      stripeToken: Yup.string().when(['selectedCard', 'useCard'], {
        is: (selectedCard, useCard) => !selectedCard && useCard,
        then: Yup.string().required('Credit card tokenization failed'),
        otherwise: Yup.string().nullable()
      })
    }),
    event: Yup.object().shape({
      id: Yup.number().required()
    }),
    renterInformation: Yup.object().shape({
      id: Yup.number().cast(),
      firstName: Yup.string()
        .min(2, 'First name is too short')
        .max(50, 'First name is too long')
        .required('First name is required'),
      lastName: Yup.string()
        .min(2, 'Last name is too short')
        .max(50, 'Last name is too long')
        .required('Last name is required'),
      phone: Yup.string()
        .matches('^[0-9]+$', 'Enter a valid phone number')
        .length(10, 'Enter a valid phone number')
        .required('Enter a valid phone number'),
      email: Yup.string()
        .email('PLEASE ENTER A VALID EMAIL')
        .required('Email is required')
    }),
    renterNotes: Yup.string()
      .max(250)
      .nullable(),
    startDate: Yup.string()
      .test('startDate', "Start date must be either today or after today's date", startDate => {
        if (!startDate) return true;
        return moment(startDate).isSameOrAfter(moment());
      })
      .test('startDate', "Start date can't be that far away", value => {
        if (!value) return true;
        return moment(value).isBefore(moment().add('Y', 5));
      }),
    newCard: Yup.boolean().nullable()
  });

  const onSubmit = async (values, formikBag) => {
    const { ccInformation } = values;
    const { stripeToken } = ccInformation;
    const result = await handleSubmit({
      orderCheckout,
      values,
      stripeToken,
      user: adminUser
    });

    const { data } = await result;
    const errorResponse = getValueByPropPath(result, 'data.checkout.error', '');
    if (errorResponse) {
      reportGraphqlError(props.showSnackbar, errorResponse || 'Order could not be updated');
    }
    formikBag.setFieldValue('isSubmitting', false);

    if (!data.checkout.success) throw new Error(data.checkout.error);

    formikBag.setFieldValue('multipayment', null);
  };

  return (
    <>
      <ContextSnackbar />
      <Formik enableReinitialize initialValues={initialValues} onSubmit={onSubmit} validationSchema={AdminOrderCreateSchema}>
        <OrderForm elements={elements} stripe={stripe} adminUser={adminUser} />
      </Formik>
    </>
  );
}

const AdminCreateOrderWithStripe = compose(withRouter, withStripe, withUserContext, withSnackbarContextActions, withOrderCheckout)(AdminCreateOrder);

export default AdminCreateOrderWithStripe;
