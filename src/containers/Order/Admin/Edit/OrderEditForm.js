//@flow
import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { CardActions } from '@material-ui/core';
import { Form, useFormikContext } from 'formik';
import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import { useLazyQuery, useQuery } from 'react-apollo';
import Button from '../../../../components/Button';
import { CancelButtonAlt } from '../../../../components/Button/CancelLink';
import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex } from '../../../../styles/Mixins';
import BasicInformation from '../shared/BasicInformation';
import SpecialRequests from '../shared/SpecialRequests';
import AdminNotes from '../shared/AdminNotes';
import ProductCard from '../shared/ProductCard';
import ReservationProduct from '../shared/ReservationProduct';
import OrderHistory from './OrderHistory';
import CancelReservation from './CancelReservationModal';
import { isEmpty, buildOrderItems } from '../../../../helpers';
import RefundModal from './RefundModal';
import type PaymentType from './RefundModal';
import AddOns from '../shared/AddOns';
import { getValueByPropPath } from '../../../../utils/objectHelpers';
import { Product } from '../../../../constants/productType';
import { calculateDifferencesByItem } from './editCostHelpers';
import type Order from './OrderHistory';
import { useValidateAction } from '../../../../utils/actions';
import { actions } from '../../../../constants/actions';
import { UserContext } from '../../../../store/UserContext';
import { subRouteCodes as SUB_ROUTES } from '../../../../constants/routes';
import { GROUP_LEADER } from '../../../../constants/userRoles';

export type Multipayment = {|
  isMultipayment: boolean,
  totalToCard: string,
  totalToCash: string
|};

type OrderEditFormPropsType = {|
  className: string,
  deleteModalVisible: boolean,
  handleCancelReservation: ({}, ?boolean, ?{}) => void,
  history: {|
    goBack: () => void
  |},
  onReviewReservation: ({ initFormValues: {}, modFormValues: {} }) => void,
  order: {
    event: { id: string, payments: PaymentType, addOnProducts?: [] },
    id: string,
    group?: {},
    payments: PaymentType,
    successorOrder: { id: number | string }
  },
  refundModalVisible: boolean,
  toggleDeleteModalVisibility: boolean => void,
  toggleRefundModalVisibility: boolean => void,
  setAdminNotes: string => void,
  adminNotes: string,
  setLastSavedNote: string => void,
  lastSavedNote: string,
  onSubmitCheckoutGroupOrder: (order: Order, paymentDetails: PaymentType, multipayment: Multipayment) => void,
  hasBeenPaid: boolean
|};

function OrderEditFormBase(props: OrderEditFormPropsType): React$Node {
  const {
    className,
    deleteModalVisible,
    handleCancelReservation,
    history,
    order,
    setAdminNotes,
    adminNotes,
    setLastSavedNote,
    lastSavedNote,
    refundModalVisible,
    toggleDeleteModalVisibility,
    toggleRefundModalVisibility,
    onReviewReservation,
    onSubmitCheckoutGroupOrder,
    hasBeenPaid
  } = props;

  const { values, dirty, errors, isSubmitting } = useFormikContext();
  const [isRvsOpen, setIsRvsOpen] = useState(false);
  const [isAddOnsOpen, setAddOnsOpen] = useState(false);
  const [isStallsOpen, setIsStallsOpen] = useState(false);
  const [isAdminNotesOpen, setIsAdminNotesOpen] = useState(false);
  const [isStallWarningOpen, setIsStallWarningOpen] = useState(false);
  const [isRvWarningOpen, setIsRvWarningOpen] = useState(false);
  const [isAddOnWarningOpen, setIsAddOnWarningOpen] = useState(false);
  const [initialFormValues] = useState(values);
  const [cancelWithRefund, setCancelWithRefund] = useState(null);
  const [getOrderCosts, { data: orderCosts, loading: orderCostsLoading }] = useLazyQuery(ORDER_CREATE_COSTS);
  const [reservationAdded, setReservationAdded] = useState(false);
  const { initialStallProduct, initialRvProduct } = values;
  const [stallIsBelowMinNights, setStallIsBelowMinNights] = useState(false);
  const [rvIsBelowMinNights, setRvIsBelowMinNights] = useState(false);
  const [stallQuestionsAreValid, setStallQuestionsAreValid] = useState(true);
  const [rvQuestionsAreValid, setRvQuestionsAreValid] = useState(true);

  const { user } = useContext(UserContext);

  const initialOrderItemsArray = buildOrderItems(initialFormValues);
  const { data: initialOrderCosts } = useQuery(ORDER_CREATE_COSTS, {
    variables: {
      input: {
        selectedOrderItems: initialOrderItemsArray,
        useCard: false,
        isNonUSCard: false
      }
    },
    fetchPolicy: 'network-only'
  });

  const { hasEmptyRVQuestions, hasEmptyStallQuestions } = values;
  const handleWarningClose = () => {
    setIsStallWarningOpen(false);
    setIsRvWarningOpen(false);
    setIsAddOnWarningOpen(false);
  };
  const hasFormikErrors = () => {
    /*
      Weird Yup behavior in the schema where there
      is no error but still returns a
      key and an empty value:
      {
        stalls: '' -> No error
      }
      so below script will make sure we dont have empty string as errors
    */
    for (const error in errors) {
      if (!errors[error]) {
        delete errors[error];
      }
    }

    const errorsBlockingSubmit = { ...errors };
    return !isEmpty(errorsBlockingSubmit);
  };

  let hasInitialAddOns = false,
    hasOnlyEventAddOns = true;
  Object.keys(values.initialAddOns)?.forEach(addOn => {
    if (values.initialAddOns[addOn].quantity || values.initialAddOns[addOn].quantity === 0) return (hasInitialAddOns = true);
  });

  if (!Object.keys(values.initialAddOns).length && order?.event?.addOnProducts.length) {
    hasOnlyEventAddOns = false;
    hasInitialAddOns = true;
  }

  const noDeletedAddons = Object.values(values.initialAddOns).find(addOn => addOn.quantity !== 0);
  hasOnlyEventAddOns = noDeletedAddons ? true : false;

  const handleSubmit = async e => {
    e.preventDefault();
    window.scrollTo(0, 0);
    onReviewReservation({
      initFormValues: initialFormValues,
      modFormValues: values
    });
  };

  const handleDiscard = async e => {
    e.preventDefault();
    history.push(+user.role.id === GROUP_LEADER ? SUB_ROUTES.GROUP_LEADER.ORDERS : SUB_ROUTES.ADMIN.ORDERS);
  };

  const orderItems = getValueByPropPath(order, 'orderItems', []);
  const addOnProducts = orderItems.filter(({ addOnProduct }) => addOnProduct);

  const newProductSubmitting = () => {
    let isValid = false;
    if ((values.stallProductId || values.stalls.quantity) && (!values.stallProductId || !values.stalls.quantity)) isValid = true;
    if ((values.rvProductId || values.rv_spot.quantity) && (!values.rvProductId || !values.rv_spot.quantity)) isValid = true;

    return isValid;
  };

  useEffect(() => {
    const orderItemsArray = buildOrderItems(values);
    getOrderCosts({
      variables: {
        input: {
          selectedOrderItems: orderItemsArray,
          useCard: false,
          isNonUSCard: false
        }
      }
    });
  }, [values]);

  useEffect(() => {
    if (!initialStallProduct && !initialRvProduct && (values.stallProductId || values.rvProductId)) {
      setReservationAdded(true);
    }
  }, [values]);

  if (order?.successorOrder && order?.successorOrder?.id) {
    return (
      <>
        <span>This order is outdated. To view the latest related order, click</span> <Link to={`/admin/order/edit/${order?.successorOrder?.id}`}>here</Link>
      </>
    );
  }

  const hasMinNightError = () => {
    return stallIsBelowMinNights || rvIsBelowMinNights;
  };

  const isButtonDisabled = () => {
    const isDisabled =
      !dirty ||
      Object.keys(hasEmptyStallQuestions)?.length ||
      Object.keys(hasEmptyRVQuestions)?.length ||
      hasFormikErrors() ||
      isSubmitting ||
      newProductSubmitting() ||
      hasMinNightError() ||
      !stallQuestionsAreValid ||
      !rvQuestionsAreValid;

    return isDisabled;
  };

  const canEditAdminNotes = useValidateAction('orders', actions.ADMIN_NOTES);

  return (
    <>
      <section className={`${className}__form-section`}>
        <Form className={`${className}__form-container`}>
          <div className={`${className}__form-column-left`}>
            {order && <BasicInformation order={order} />}
            {order && !!values.event?.stallProducts.length && (
              <ProductCard
                className={className}
                isOpen={isStallsOpen}
                order={order}
                event={order.event}
                setIsWarningOpen={() => setIsStallWarningOpen(true)}
                hasInitialProduct={true}
                productType={Product.STALL}
                reservationEdit
                simpleDeleteDisabled={!values.stalls?.quantity}
                setIsOpen={setIsStallsOpen}>
                <ReservationProduct
                  toggleDeleteModalVisibility={() => toggleDeleteModalVisibility(true)}
                  isWarningOpen={isStallWarningOpen}
                  setIsWarningOpen={() => setIsStallWarningOpen(!isStallWarningOpen)}
                  className={className}
                  isOpen={isStallsOpen}
                  handleWarningClose={handleWarningClose}
                  order={order}
                  productType={Product.STALL}
                  questionAnswers={order.stallQuestionAnswers}
                  reservationEdit
                  isBelowMinNights={stallIsBelowMinNights}
                  setIsBelowMinNights={setStallIsBelowMinNights}
                  setProductQuestionsAreValid={setStallQuestionsAreValid}
                />
              </ProductCard>
            )}
            {order && !!values.event?.rvProducts.length && (
              <ProductCard
                className={className}
                isOpen={isRvsOpen}
                order={order}
                event={order.event}
                setIsWarningOpen={() => setIsRvWarningOpen(true)}
                hasInitialProduct={true}
                productType={Product.RV}
                reservationEdit
                simpleDeleteDisabled={!values.rv_spot?.quantity}
                setIsOpen={setIsRvsOpen}>
                <ReservationProduct
                  toggleDeleteModalVisibility={() => toggleDeleteModalVisibility(true)}
                  isWarningOpen={isRvWarningOpen}
                  handleWarningClose={handleWarningClose}
                  setIsWarningOpen={() => setIsRvWarningOpen(!isRvWarningOpen)}
                  className={className}
                  isOpen={isRvsOpen}
                  order={order}
                  productType={Product.RV}
                  questionAnswers={order.rvQuestionAnswers}
                  reservationEdit
                  isBelowMinNights={rvIsBelowMinNights}
                  setIsBelowMinNights={setRvIsBelowMinNights}
                  setProductQuestionsAreValid={setRvQuestionsAreValid}
                />
              </ProductCard>
            )}
            {order && !!values.event?.addOnProducts.length && (
              <ProductCard
                className={className}
                isOpen={isAddOnsOpen}
                order={order}
                simpleDeleteDisabled={!hasOnlyEventAddOns}
                setIsWarningOpen={() => setIsAddOnWarningOpen(!isAddOnWarningOpen)}
                event={order.event}
                productType={Product.ADD_ON}
                hasInitialProduct={hasInitialAddOns}
                reservationEdit
                setIsOpen={setAddOnsOpen}>
                <AddOns
                  reservationEdit
                  toggleDeleteModalVisibility={() => toggleDeleteModalVisibility(true)}
                  eventAddOns={order.event.addOnProducts}
                  isOpen={isAddOnsOpen}
                  isWarningOpen={isAddOnWarningOpen}
                  handleWarningClose={handleWarningClose}
                  addOnProducts={addOnProducts}
                  currentAddOns={values.addOns}
                  editView
                />
              </ProductCard>
            )}
            {canEditAdminNotes && (
              <ProductCard
                className={className}
                isOpen={isAdminNotesOpen}
                order={order}
                simpleDeleteDisabled={!adminNotes}
                event={order.event}
                productType={'NOTES'}
                hasInitialProduct={true}
                reservationEdit
                setIsWarningOpen={() => {
                  setAdminNotes('');
                  setIsAdminNotesOpen(true);
                }}
                setIsOpen={setIsAdminNotesOpen}>
                <AdminNotes
                  isEdit
                  setAdminNotes={setAdminNotes}
                  adminNotes={adminNotes}
                  isOpen={isAdminNotesOpen}
                  setIsOpen={setIsAdminNotesOpen}
                  setLastSavedNote={setLastSavedNote}
                  lastSavedNote={lastSavedNote}
                />
              </ProductCard>
            )}
          </div>
          <div className={`${className}__form-column-right`}>
            {order && (
              <>
                <OrderHistory
                  order={order}
                  toggleRefundModalVisibility={() => toggleRefundModalVisibility(true)}
                  reservationEdit
                  loading={orderCostsLoading}
                  priceAdjustments={calculateDifferencesByItem(values, orderCosts)}
                  orderCosts={orderCosts && orderCosts.orderCosts}
                  initialOrderCosts={initialOrderCosts && initialOrderCosts.orderCosts}
                  reservationAdded={reservationAdded}
                  onSubmitCheckoutGroupOrder={onSubmitCheckoutGroupOrder}
                  hasBeenPaid={hasBeenPaid}
                />
                <SpecialRequests order={order} />
              </>
            )}
            <CardActionsBase>
              <CancelButtonAlt secondary variant="contained" size="large" onClick={e => handleDiscard(e)}>
                DISCARD CHANGES
              </CancelButtonAlt>
              <FormButtonBase primary variant="contained" size="large" disabled={isButtonDisabled()} onClick={e => handleSubmit(e)}>
                REVIEW & SAVE CHANGES
              </FormButtonBase>
            </CardActionsBase>
          </div>
        </Form>
      </section>

      <CancelReservation
        heading={'Cancel Entire Reservation'}
        history={history}
        groupOrder={!!order?.group}
        refundToggle={setCancelWithRefund}
        cancelWithRefund={cancelWithRefund}
        className={className}
        order={order}
        open={deleteModalVisible}
        hasBeenPaid={hasBeenPaid}
        close={() => toggleDeleteModalVisibility(false)}
        handleSubmit={() => {
          if (cancelWithRefund) {
            toggleDeleteModalVisibility(false);
            toggleRefundModalVisibility(true);
          } else handleCancelReservation(values, false, {});
        }}
      />

      {/* RefundModal is not a full REACtive component  */}
      {/* so we need to avoid the modal being mount in the DOM  */}
      {/* this way the modal will work after deferred payments  */}
      {refundModalVisible && (
        <RefundModal
          specialRefund
          cancelWithRefund={cancelWithRefund}
          className={className}
          history={history}
          order={order}
          open={refundModalVisible}
          handleCancelReservation={refundInformation => handleCancelReservation(values, true, refundInformation)}
          onClose={() => {
            setCancelWithRefund(null);
            toggleRefundModalVisibility(false);
          }}
          priceAdjustments={calculateDifferencesByItem(values, orderCosts)}
        />
      )}
    </>
  );
}

const OrderEditForm = styled(OrderEditFormBase)`
  &__form-section {
    max-width: 1284px;
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
      justify-content: center;
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
    width: 100%;
    margin-right: 30px;
    min-width: 700px;
  }
  &__form-column-right {
    position: -webkit-sticky; /* Safari */
    position: sticky;
    top: 70px;

    &&& {
      align-self: baseline;
      margin-left: 0px;
    }
    @media screen and (min-width: 960px) {
      ${displayFlex}
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
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

const FormButtonBase = styled(Button)`
  &&& {
    width: auto;
    margin-left: 20px;
    letter-spacing: 0.7px;
    line-height: normal;
  }
`;

export default OrderEditForm;
