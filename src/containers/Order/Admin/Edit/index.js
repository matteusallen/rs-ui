//@flow
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { compose } from 'recompose';
import { Formik } from 'formik';
import * as Yup from 'yup';
import withStripe from '../../../../enhancers/withStripe';
import { useQuery, useMutation } from '@apollo/react-hooks';
import moment from 'moment';
import { useHistory } from 'react-router';
import OrderEditForm from './OrderEditForm';
import CancelButton from '../../../../components/Button/CancelButton';
import ContextSnackbar from '../../../../components/Snackbar';
import { subRouteCodes as SUB_ROUTES } from '../../../../constants/routes';
import withCancelOrder from '../../../../mutations/CancelOrder';
import withUpdateOrder from '../../../../mutations/UpdateOrder';
import UPDATE_ISVISITED from '../../../../mutations/UpdateIsVisited';
import withCheckoutGroupOrder from '../../../../mutations/CheckoutGroupOrder';
import { ORDER_FOR_EDIT } from '../../../../queries/Admin/OrderForEdit';
import { HeadingOne } from 'Components/Headings';
import { displayFlex } from '../../../../styles/Mixins';
import Error from '../../../../components/Alerts/Error';
import IndeterminateLoading from '../../../../components/Loading/IndeterminateLoading';
import colors from '../../../../styles/Colors';
import BackArrow from '../../../../assets/img/icons/back-arrow.png';
import ReviewReservationForm from '../Review/ReviewReservationForm';
import { buildOrderItems } from '../../../../helpers';
import { omit, cloneDeep } from 'lodash';
import { PageNotFoundSection } from '../../../../components/PageNotFound/PageNotFoundSection';
import { isErrorCode } from '../../../../utils/graphqlErrorHelper';
import { graphqlErrorCodes } from '../../../../types/enums/graphqlEnums';
import PRODUCT_REF_TYPE from 'Constants/productRefType';
import { UserContext } from '../../../../store/UserContext';
import { GROUP_LEADER } from '../../../../constants/userRoles';

type AdminEditOrderPropsType = {|
  cancelOrder: ({}) => void,
  className: string,
  history: {
    push: string => void
  },
  location: {
    pathname: string
  },
  updateOrder: ({}) => void,
  checkoutGroupOrder: ({}) => void,
  updateReservationStatus: ({}) => void
|};

function AdminEditOrderBase({
  cancelOrder,
  className,
  history,
  location,
  updateOrder,
  updateReservationStatus,
  checkoutGroupOrder
}: AdminEditOrderPropsType): React$Node {
  const { user } = useContext(UserContext);
  const { push } = useHistory();
  const back = () => {
    return push(+user.role.id === GROUP_LEADER ? SUB_ROUTES.GROUP_LEADER.ORDERS : SUB_ROUTES.ADMIN.ORDERS);
  };

  const [deleteModalVisible, toggleDeleteModalVisibility] = useState(false);
  const [refundModalVisible, toggleRefundModalVisibility] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [lastSavedNote, setLastSavedNote] = useState('');
  const [isReviewReservationVisible, setIsReviewReservationVisible] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState(null);
  const [modifiedFormValues, setModifiedFormValues] = useState(null);
  const [hasBeenPaid, setHasBeenPaid] = useState(true);

  const path = location.pathname;
  const orderId = path.substring(path.lastIndexOf('/') + 1);
  const { data, error, loading, refetch } = useQuery(ORDER_FOR_EDIT, {
    variables: { id: orderId },
    fetchPolicy: 'network-only'
  });

  const [setIsVisited] = useMutation(UPDATE_ISVISITED, {
    variables: { id: orderId }
  });

  useEffect(() => {
    if (data && data.order && !data.order.isVisited) {
      setIsVisited();
    }

    if (data && data.order.group && data.order.payments.length === 0) {
      return setHasBeenPaid(false);
    }

    return setHasBeenPaid(true);
  }, [data]);

  const orderWasNotFound = () => isErrorCode(error, graphqlErrorCodes.BAD_USER_INPUT);

  if (orderWasNotFound()) {
    return <PageNotFoundSection className={className} />;
  }

  if (error) {
    console.log(error);
    return <StyledError label={'There was an error fetching the order.'} />;
  }

  const order = (data && data.order) || null;

  const orderItemsThatHaveReservations =
    order && order.orderItems
      ? order.orderItems.filter(orderItem => {
          return orderItem.reservation;
        })
      : [];

  const orderItemsThatAreAddOnProducts =
    order && order.orderItems
      ? order.orderItems.filter(orderItem => {
          return !orderItem.reservation;
        })
      : [];

  const addOnsFormFieldMapping =
    order && order.orderItems
      ? order.orderItems.reduce((acc, item) => {
          if (item.addOnProduct && item.addOnProduct.id) {
            acc[item.addOnProduct.id] = item.quantity;
          }
          return acc;
        }, {})
      : [];

  const stallOrderItem = orderItemsThatHaveReservations.filter(orderItem => {
    return orderItem.quantity && orderItem.reservation.stallProduct;
  });

  const rvOrderItem = orderItemsThatHaveReservations.filter(orderItem => {
    return orderItem.quantity && orderItem.reservation.rvProduct;
  });

  const rvOrderItemReservation =
    rvOrderItem && rvOrderItem[0]
      ? rvOrderItem[0].reservation
      : {
          status: { id: null },
          rvProduct: null,
          rvSpots: [],
          startDate: null,
          endDate: null
        };

  const stallOrderItemReservation =
    stallOrderItem && stallOrderItem[0]
      ? stallOrderItem[0].reservation
      : {
          status: { id: null },
          stallProduct: null,
          stalls: [],
          startDate: null,
          endDate: null
        };

  const { stalls: selectedStalls } = stallOrderItemReservation;
  const { rvSpots: selectedRvs } = rvOrderItemReservation;

  const initQuestionAnswers = () => {
    let questionAnswers = [];
    order?.stallQuestionAnswers.forEach(el => questionAnswers.push({ question: el.question, id: el.id, answer: el.answer, productType: 'stalls' }));
    order?.rvQuestionAnswers.forEach(el => questionAnswers.push({ question: el.question, id: el.id, answer: el.answer, productType: 'rvSpots' }));
    return questionAnswers;
  };

  const initialValues = {
    initialOrder: order,
    initialRvProduct: rvOrderItem[0],
    initialStallProduct: stallOrderItem[0],
    event: order?.event,
    renterInformation: {
      id: order?.user?.id,
      firstName: order?.user?.firstName,
      lastName: order?.user?.lastName,
      phone: order?.user?.phone,
      email: order?.user?.email
    },
    initialAddOns: orderItemsThatAreAddOnProducts,
    addOns: addOnsFormFieldMapping,
    rv_spot: {
      status: rvOrderItemReservation.status && rvOrderItemReservation.status.id,
      start: rvOrderItemReservation.startDate,
      end: rvOrderItemReservation.endDate,
      quantity: (rvOrderItem[0] && rvOrderItem[0].quantity) || 0
    },
    stallQuestionAnswers: order?.stallQuestionAnswers.map(q => cloneDeep(q)),
    rvQuestionAnswers: order?.rvQuestionAnswers.map(q => cloneDeep(q)),
    productQuestionAnswers: initQuestionAnswers() || [],
    stalls: {
      status: stallOrderItemReservation.status.id,
      start: stallOrderItemReservation.startDate,
      end: stallOrderItemReservation.endDate,
      quantity: (stallOrderItem[0] && stallOrderItem[0].quantity) || 0
    },
    hasEmptyRVQuestions: {},
    hasEmptyStallQuestions: {},
    renterNotes: order?.notes,
    adminNotes: order?.adminNotes,
    reservationEdit: true,
    selectedRvs: selectedRvs,
    selectedStalls: selectedStalls,
    rvProductId: (rvOrderItemReservation.rvProduct && !!rvOrderItem[0].quantity && rvOrderItemReservation.rvProduct.id) || null,
    stallProductId: (stallOrderItemReservation.stallProduct && !!stallOrderItem[0].quantity && stallOrderItemReservation.stallProduct.id) || null,
    selectedStallMinNights: stallOrderItemReservation.stallProduct && stallOrderItemReservation.stallProduct.minNights,
    selectedRVMinNights: rvOrderItemReservation.rvProduct && rvOrderItemReservation.rvProduct.minNights,
    isBelowMinNights: {
      stalls: false,
      rvs: false
    }
  };

  const maxQtyOfUnits = 50;

  const AdminOrderEditSchema = Yup.object().shape({
    addOnsQuantities: Yup.array().of(
      Yup.object().shape({
        addOnId: Yup.number().cast(),
        quantity: Yup.number().nullable()
      })
    ),
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
        .length(10)
        .required('Enter a valid phone number'),
      email: Yup.string()
        .email('Must be a valid email')
        .required('Email is required')
    }),
    renterNotes: Yup.string()
      .max(250)
      .nullable(),
    reservationEdit: Yup.boolean().required(),
    selectedRvs: Yup.array()
      .test('selectedRvsGreaterThanAvailableQuantity', 'There are too many RV spots assigned. Unassign RV spots or adjust the quantity requested', function(
        selectedRvs: []
      ): boolean {
        if (!selectedRvs.length) return true;
        const { rv_spot } = this.parent;
        return selectedRvs.length <= parseInt(rv_spot.quantity);
      })
      .test('selectedRvsQuantityTest', 'Please finish assigning RV spots or clear all assigned RV spots to save this reservation', function(
        selectedRvs: []
      ): boolean {
        if (!selectedRvs.length) return true;
        const { rv_spot } = this.parent;
        return selectedRvs.length === parseInt(rv_spot.quantity);
      }),
    selectedStalls: Yup.array()
      .test('selectedStallsGreaterThanAvailableQuantity', `There are too many stalls assigned. Unassign stalls or adjust the quantity requested`, function(
        selectedStalls: []
      ): boolean {
        if (!selectedStalls.length) return true;
        const { stalls } = this.parent;
        return selectedStalls.length <= parseInt(stalls.quantity);
      })
      .test('selectedStallsQuantityTest', 'Please finish assigning stalls or clear all assigned stalls to save this reservation', function(
        selectedStalls: []
      ): boolean {
        if (!selectedStalls.length) return true;
        const { stalls } = this.parent;
        return selectedStalls.length === parseInt(stalls.quantity);
      }),
    rv_spot: Yup.object().shape({
      quantity: Yup.number().test('quantityBetweenZeroAndCurrentQuantityRVs', `Maximum quantity ${maxQtyOfUnits}`, function(
        quantity: string | number
      ): boolean {
        // return false
        if (!rvOrderItem[0]) return true;
        return parseInt(quantity) <= maxQtyOfUnits;
      }),
      start: Yup.string()
        .when('selectedRvs', (selectedRvs, schema) => {
          return selectedRvs ? schema.string().required() : schema;
        })
        .nullable(),
      end: Yup.string()
        .when('selectedRvs', (selectedRvs, schema) => {
          return selectedRvs ? schema.string().required() : schema;
        })
        .nullable(),
      status: Yup.string()
        .when('selectedRvs', (selectedRvs, schema) => {
          return selectedRvs ? schema.string().required() : schema;
        })
        .nullable()
    }),
    stalls: Yup.object().shape({
      quantity: Yup.number().test('quantityBetweenZeroAndCurrentQuantityStalls', `Maximum quantity ${maxQtyOfUnits}`, function(
        quantity: string | number
      ): boolean {
        if (!stallOrderItem[0]) return true;
        return parseInt(quantity) <= maxQtyOfUnits;
      }),
      start: Yup.string()
        .when('selectedStalls', (selectedStalls, schema) => {
          return selectedStalls ? schema.string().required() : schema;
        })
        .nullable(),
      end: Yup.string()
        .when('selectedStalls', (selectedStalls, schema) => {
          return selectedStalls ? schema.string().required() : schema;
        })
        .nullable(),
      status: Yup.string()
        .when('selectedStalls', (selectedStalls, schema) => {
          return selectedStalls ? schema.string().required() : schema;
        })
        .nullable()
    })
  });

  const onSubmit = async (values, refundInformation, refundPayment, isGroupOrder, noRefund, paymentInput = null, multipaymentInput) => {
    const initialRvReservationId = values.initialRvProduct?.reservation?.id;
    const initialStallReservationId = values.initialStallProduct?.reservation?.id;
    const updatedOrder = {
      orderId: values.initialOrder.id,
      refundInformation: null,
      refundPayment: false,
      groupOrderPayment: null,
      reservations: [],
      addOns: [],
      productQuestionAnswers: modifiedFormValues.productQuestionAnswers.map(el => omit(el, ['question', 'productType', 'highlight', 'questionId'])),
      assignments: [],
      orderItemsArray: buildOrderItems(modifiedFormValues || values),
      adminNotes,
      noRefund: noRefund,
      paymentInput
    };

    const getReservationProductOrders = (initialProduct, productType) => {
      const product = values[productType];
      const isStalls = productType === 'stalls';
      const initialProductQuantity = initialProduct?.quantity;
      const initialProductStartDate = initialProduct?.reservation?.startDate;
      const initialProductEndDate = initialProduct?.reservation?.endDate;
      const newProductStartDate = moment(modifiedFormValues && modifiedFormValues[productType]?.start).format('YYYY-MM-DD');
      const newProductEndDate = moment(modifiedFormValues && modifiedFormValues[productType]?.end).format('YYYY-MM-DD');
      const productId = isStalls ? values.stallProductId : values.rvProductId;
      const initialProductId = initialProduct?.reservation[isStalls ? 'stallProduct' : 'rvProduct'].id;
      const reservationId = isStalls ? initialStallReservationId : initialRvReservationId;
      const isStartDateDifferent = moment(initialProductStartDate).diff(moment(newProductStartDate), 'days') !== 0;
      const isEndDateDifferent = moment(initialProductEndDate).diff(moment(newProductEndDate), 'days') !== 0;
      const xRefTypeId = isStalls ? PRODUCT_REF_TYPE.STALL_PRODUCT : PRODUCT_REF_TYPE.RV_PRODUCT;

      if (((reservationId && !productId) || (modifiedFormValues && !modifiedFormValues[productType]?.quantity)) && initialProductQuantity) {
        updatedOrder.reservations.push({ reservationId, quantity: 0, startDate: newProductStartDate, endDate: newProductEndDate, type: 'updateQuantity' });
      } else if (!reservationId && productId) {
        updatedOrder.reservations.push({
          type: 'addReservationProduct',
          quantity: product.quantity,
          endDate: newProductEndDate,
          startDate: newProductStartDate,
          xProductId: productId,
          xRefTypeId
        });
      } else {
        if (productId != initialProductId) {
          updatedOrder.reservations.push({
            reservationId,
            xProductId: productId,
            type: 'changeProduct',
            xRefTypeId,
            startDate: newProductStartDate,
            endDate: newProductEndDate,
            quantity: product.quantity
          });
        } else {
          if (isStartDateDifferent || isEndDateDifferent) {
            updatedOrder.reservations.push({
              reservationId,
              type: 'updateDates',
              endDate: newProductEndDate,
              startDate: newProductStartDate,
              quantity: product.quantity
            });
          }
          if (initialProductQuantity != product.quantity) {
            updatedOrder.reservations.push({
              reservationId,
              type: 'updateQuantity',
              startDate: newProductStartDate,
              endDate: newProductEndDate,
              quantity: product.quantity
            });
          }
        }

        if (productId != initialProductId) {
          updatedOrder.reservations.push({
            reservationId,
            xProductId: productId,
            type: 'changeProduct',
            xRefTypeId,
            startDate: newProductStartDate,
            endDate: newProductEndDate,
            quantity: product.quantity
          });
        } else {
          if (isStartDateDifferent || isEndDateDifferent) {
            updatedOrder.reservations.push({
              reservationId,
              type: 'updateDates',
              endDate: newProductEndDate,
              startDate: newProductStartDate,
              quantity: product.quantity
            });
          }
          if (initialProductQuantity != product.quantity) {
            updatedOrder.reservations.push({
              reservationId,
              type: 'updateQuantity',
              startDate: newProductStartDate,
              endDate: newProductEndDate,
              quantity: product.quantity
            });
          }
        }
      }
    };

    const getAddOnsForOrder = () => {
      const initialAddOnsObj = {};
      const orderItemIdMap = {};

      values.initialAddOns?.forEach(addOn => {
        initialAddOnsObj[addOn.addOnProduct.id] = addOn.quantity;
        orderItemIdMap[addOn.addOnProduct.id] = addOn.id;
      });

      Object.keys(initialAddOnsObj)?.forEach(id => {
        if ((modifiedFormValues?.addOns[id] || values?.addOns[id]) && initialAddOnsObj[id] !== values.addOns[id]) {
          updatedOrder.addOns.push({ orderItemId: orderItemIdMap[id], quantity: values.addOns[id], type: 'updateQuantity' });
        }
        if (initialAddOnsObj[id] && (!values.addOns[id] || !modifiedFormValues?.addOns[id])) {
          updatedOrder.addOns.push({ orderItemId: orderItemIdMap[id], quantity: 0, type: 'updateQuantity' });
        }
      });

      Object.keys(values.addOns)?.forEach(id => {
        if (!Object.prototype.hasOwnProperty.call(initialAddOnsObj, id)) {
          updatedOrder.addOns.push({ orderItemId: orderItemIdMap[id], quantity: values.addOns[id], type: 'add', xProductId: id });
        }
      });
    };

    const getAssignmentsForOrder = (initialSpots, newSpots, productType) => {
      const initialSelectedObject = {};
      const newlySelectedObject = {};
      const reservationId = productType === 'stalls' ? initialStallReservationId : initialRvReservationId;

      initialSpots?.forEach(selectedSpot => {
        initialSelectedObject[selectedSpot.id] = true;
      });

      newSpots?.forEach(selectedSpot => {
        newlySelectedObject[selectedSpot.id] = true;
        if (initialSelectedObject[selectedSpot.id]) return;
        updatedOrder.assignments.push({ reservationId, spaceId: selectedSpot.id, type: 'add' });
      });

      initialSpots?.forEach(selectedSpot => {
        if (newlySelectedObject[selectedSpot.id]) return;
        updatedOrder.assignments.push({ reservationId, spaceId: selectedSpot.id, type: 'delete' });
      });
    };

    if (values.stallProductId || initialStallReservationId) {
      getReservationProductOrders(initialValues.initialStallProduct, 'stalls');
      getAssignmentsForOrder(values.initialStallProduct?.reservation?.stalls, values.selectedStalls, 'stalls');
    }

    if (values.rvProductId || initialRvReservationId) {
      getReservationProductOrders(initialValues.initialRvProduct, 'rv_spot');
      getAssignmentsForOrder(values.initialRvProduct?.reservation?.rvSpots, values.selectedRvs, 'rv_spot');
    }

    getAddOnsForOrder();
    updatedOrder.refundPayment = refundPayment;
    updatedOrder.refundInformation = isGroupOrder ? null : refundInformation;
    updatedOrder.groupOrderPayment = isGroupOrder ? refundInformation : null;

    updatedOrder.multipaymentInput = multipaymentInput;

    const { data } = await updateOrder(updatedOrder);

    if (data.updateOrder.success) {
      history.push(+user.role.id === GROUP_LEADER ? SUB_ROUTES.GROUP_LEADER.ORDERS : SUB_ROUTES.ADMIN.ORDERS);
    }
  };

  const handleCancelReservation = async (values, refundPayment = false, refundInformation = []) => {
    const result = await cancelOrder({
      orderId: parseInt(values.initialOrder.id),
      refundInformation: refundInformation.length
        ? refundInformation.map(refundInfo => ({
            ...refundInfo,
            orderId: parseInt(values.initialOrder.id)
          }))
        : null,
      refundPayment
    });
    if (result && result.data.cancelOrder.success) {
      history.push(+user.role.id === GROUP_LEADER ? SUB_ROUTES.GROUP_LEADER.ORDERS : SUB_ROUTES.ADMIN.ORDERS);
      return;
    }
    // If error condition, close modal, but do not navigate away to reservation list
    toggleDeleteModalVisibility(false);
  };

  const handleReviewReservation = ({ initFormValues, modFormValues }) => {
    if (!initialFormValues && !modifiedFormValues) {
      setInitialFormValues(initFormValues);
    }
    setModifiedFormValues(modFormValues);
    setIsReviewReservationVisible(true);
  };

  const handleEditReservation = () => {
    setIsReviewReservationVisible(false);
  };

  const deleteUnnecesaryProperties = userInput => {
    delete userInput.fullName;
    delete userInput.__typename;
  };

  const createInput = order => {
    const orderInput = {
      eventId: order.event.id,
      userId: order.user.id,
      orderItems: order.orderItems.map(orderItem => {
        if (orderItem.addOnProduct) {
          return {
            id: orderItem.id,
            quantity: orderItem.quantity
          };
        }

        return {
          id: orderItem.id,
          quantity: orderItem.quantity,
          startDate: orderItem.reservation.startDate,
          endDate: orderItem.reservation.endDate
        };
      })
    };
    const userInput = order.user;
    const groupId = +order.group.id;
    const orderId = +order.id;

    deleteUnnecesaryProperties(userInput);

    return {
      orderInput,
      userInput,
      groupId,
      orderId
    };
  };

  const onSubmitCheckoutGroupOrder = async (order, paymentInput, multipaymentInput) => {
    const { orderInput, userInput, groupId, orderId } = createInput(order);

    const response = await checkoutGroupOrder({
      orderInput,
      userInput,
      paymentInput,
      groupId,
      orderId,
      multipaymentInput
    });

    if (response.data.checkoutGroup.success) {
      refetch();
      if (+user.role.id === GROUP_LEADER) {
        history.push(SUB_ROUTES.GROUP_LEADER.ORDERS);
      }
    }
  };

  if (loading) return <IndeterminateLoading />;

  if (!order.isEditable && +user.role.id === GROUP_LEADER) {
    return <PageNotFoundSection className={className} />;
  }

  return (
    <section className={className}>
      <ContextSnackbar />
      {isReviewReservationVisible ? (
        <>
          <FlexWrapper>
            <div className={'heading'}>
              <HeadingOne label="REVIEW CHANGES" />
            </div>
          </FlexWrapper>
          <Formik initialValues={initialValues} enableReinitialize validationSchema={AdminOrderEditSchema} onSubmit={onSubmit}>
            {() => (
              <>
                {order && (
                  <ReviewReservationForm
                    onSubmit={onSubmit}
                    toggleRefundModalVisibility={toggleRefundModalVisibility}
                    order={order}
                    history={history}
                    adminNotes={adminNotes}
                    lastSavedNote={lastSavedNote}
                    initialFormValues={initialFormValues}
                    modifiedFormValues={modifiedFormValues}
                    onEditReservation={handleEditReservation}
                    hasBeenPaid={hasBeenPaid}
                  />
                )}
              </>
            )}
          </Formik>
        </>
      ) : (
        <>
          <FlexWrapper>
            <div className={'heading'}>
              <a role="button" tabIndex="0" onClick={back} onKeyDown={back} className={'back-button'}>
                <img src={BackArrow} alt={'BACK'} /> BACK
              </a>
              <HeadingOne label="EDIT RESERVATION" />
            </div>
            {order && !order.successorOrder && (
              <div className={`${className}__Buttons`}>
                <CancelButton type="submit" onClick={() => toggleDeleteModalVisibility(!deleteModalVisible)} disabled={order && order.canceled}>
                  CANCEL RESERVATION
                </CancelButton>
              </div>
            )}
          </FlexWrapper>
          <Formik initialValues={initialValues} enableReinitialize validationSchema={AdminOrderEditSchema} onSubmit={onSubmit}>
            {() => (
              <>
                {order && (
                  <OrderEditForm
                    order={order}
                    updateReservationStatus={updateReservationStatus}
                    refundModalVisible={refundModalVisible}
                    deleteModalVisible={deleteModalVisible}
                    toggleDeleteModalVisibility={toggleDeleteModalVisibility}
                    toggleRefundModalVisibility={toggleRefundModalVisibility}
                    handleCancelReservation={handleCancelReservation}
                    onReviewReservation={handleReviewReservation}
                    history={history}
                    setAdminNotes={setAdminNotes}
                    adminNotes={adminNotes}
                    setLastSavedNote={setLastSavedNote}
                    lastSavedNote={lastSavedNote}
                    onSubmitCheckoutGroupOrder={onSubmitCheckoutGroupOrder}
                    hasBeenPaid={hasBeenPaid}
                  />
                )}
              </>
            )}
          </Formik>
        </>
      )}
    </section>
  );
}

const StyledError = styled(Error)`
  &&& {
    display: block;
    position: absolute;
    top: 45px;
    height: 72px;
  }
`;

const AdminEditOrderStyled = styled(AdminEditOrderBase)`
  margin: 85px 50px 50px;
`;
const FlexWrapper = styled.div`
  ${displayFlex}
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  max-width: 1284px;

  .heading {
    ${displayFlex}
    flex-direction: column;
    margin: 0 0 20px;
  }

  .back-button {
    text-align: left;
    color: ${colors.border.tertiary};
    font-size: 15px;
    letter-spacing: 1.05px;
    line-height: 17px;
    margin-bottom: 8px;
    cursor: pointer;

    img {
      height: 11px;
    }
  }
`;

const AdminEditOrderWithMutations = compose(withCancelOrder, withStripe, withUpdateOrder, withCheckoutGroupOrder)(AdminEditOrderStyled);

export default AdminEditOrderWithMutations;
