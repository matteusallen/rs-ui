//@flow
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { CardActions } from '@material-ui/core';
import { Form, useFormikContext } from 'formik';
import { buildOrderItems } from '../../../../helpers';
import ErrorIcon from '@material-ui/icons/Error';
import AdminNotes from '../shared/AdminNotes';
import { useLazyQuery, useQuery } from 'react-apollo';
import Button from '../../../../components/Button';
import { CancelButtonAlt } from '../../../../components/Button/CancelLink';
import { paragraphReg } from '../../../../styles/Typography';
import { displayFlex } from '../../../../styles/Mixins';
import { ORDER_CREATE_COSTS } from '../../../../queries/OrderCreateCosts';
import FormCard from '../../../../components/Cards/FormCard';
import { calculateDifferencesByItem, parseDifferencesByItemWithDiscounts } from '../Edit/editCostHelpers';
import SpecialRequests from '../shared/SpecialRequests';
import ProductCard from '../shared/ProductCard';
import ReservationReviewProduct from './ReservationReviewProduct';
import OrderHistory from '../Edit/OrderHistory';
import { MONTH_DAY_YEAR_FORMAT } from '../../../../constants/dateFormats';
import { Product } from '../../../../constants/productType';
import RefundModal from '../Edit/RefundModal';
import ChargeModal from '../Edit/ChargeModal';
import GroupOrderEditModal from '../Edit/GroupOrderEditModal';
import type { Multipayment } from '../Edit/OrderEditForm';

const MODIFIED = true;
const NOT_MODIFIED = null;

export type OrderReviewFormPropsType = {|
  className: string,
  lastSavedNote: string,
  adminNotes: string,
  initialFormValues: {
    addOns: {},
    initialAddOns: [],
    initialRvProduct: {
      id: string
    },
    initialStallProduct: {
      id: string
    },
    rv_spot: {
      end: string,
      quantity: number,
      start: string
    },
    selectedRvs: [],
    selectedStalls: [],
    stalls: {
      end?: string,
      quantity: number,
      start: string
    }
  },
  toggleRefundModalVisibility: (open: boolean) => void,
  modifiedFormValues: {
    addOns: {} | null, // TODO
    rv_spot: {
      end: string,
      quantity: number,
      start: string
    },
    selectedRvs: [],
    selectedStalls: [],
    stalls: {
      end: string,
      quantity: number,
      start: string
    }
  },
  onEditReservation: () => void,
  onSubmit: (values: string, refundInformation?: {}, refundPayment?: boolean, isGroupOrder: boolean, noRefund: {}, multipayment: Multipayment) => void,
  order: {
    event: {}
  },
  hasBeenPaid: boolean
|};

function OrderReviewFormBase(props: OrderReviewFormPropsType): React$Node {
  const {
    className,
    initialFormValues,
    modifiedFormValues,
    onEditReservation,
    order,
    toggleRefundModalVisibility,
    onSubmit,
    adminNotes,
    lastSavedNote,
    hasBeenPaid
  } = props;
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [chargeModalVisible, setChargeModalVisible] = useState<boolean>(false);
  const [groupOrderEditModalVisible, setGroupOrderEditModalVisible] = useState<boolean>(false);
  const { values, isSubmitting, setSubmitting } = useFormikContext();
  const [getOrderCosts, { data: orderCosts, loading: orderCostsLoading }] = useLazyQuery(ORDER_CREATE_COSTS);
  const [currentCharges, setCurrentCharges] = useState(0);
  const [reservationAdded, setReservationAdded] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState({ card: true });
  const { initialStallProduct, initialRvProduct } = values;

  const handleDiscard = async e => {
    e.preventDefault();
    onEditReservation();
  };

  useEffect(() => {
    if (!initialStallProduct && !initialRvProduct && (values.stallProductId || values.rvProductId)) {
      setReservationAdded(true);
    }
  }, [values]);

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

  const differencesByItem = calculateDifferencesByItem(values, orderCosts);

  useEffect(() => {
    if (differencesByItem && differencesByItem.length && initialOrderCosts && orderCosts) {
      const parsedDifferencesByItem = parseDifferencesByItemWithDiscounts(differencesByItem, initialOrderCosts.orderCosts, orderCosts.orderCosts).filter(
        priceAdjustment => !priceAdjustment[2]
      );
      setCurrentCharges(parsedDifferencesByItem.length ? parsedDifferencesByItem.reduce((acc, curr) => acc + curr[1], 0) : 0);
    } else {
      setCurrentCharges(0);
    }
  }, [differencesByItem, initialOrderCosts, orderCosts]);

  // Stalls dates calculation
  const initialStallStartDate = moment(initialFormValues.stalls.start).format(MONTH_DAY_YEAR_FORMAT);
  const initialStallEndDate = moment(initialFormValues.stalls.end).format(MONTH_DAY_YEAR_FORMAT);
  const modifiedStallStartDate = moment(modifiedFormValues.stalls.start).format(MONTH_DAY_YEAR_FORMAT);
  const modifiedStallEndDate = moment(modifiedFormValues.stalls.end).format(MONTH_DAY_YEAR_FORMAT);
  const diffBetweenStallStartDates = moment(initialStallStartDate).diff(moment(modifiedStallStartDate), 'days');
  const diffBetweenStallEndDates = moment(initialStallEndDate).diff(moment(modifiedStallEndDate), 'days');
  const numberOfStallNights = moment(modifiedStallStartDate).diff(moment(modifiedStallEndDate), 'days');

  // RV dates calculation
  const initialRvStartDate = moment(initialFormValues.rv_spot.start).format(MONTH_DAY_YEAR_FORMAT);
  const initialRvEndDate = moment(initialFormValues.rv_spot.end).format(MONTH_DAY_YEAR_FORMAT);
  const modifiedRvStartDate = moment(modifiedFormValues.rv_spot.start).format(MONTH_DAY_YEAR_FORMAT);
  const modifiedRvEndDate = moment(modifiedFormValues.rv_spot.end).format(MONTH_DAY_YEAR_FORMAT);
  const diffBetweenRVStartDates = moment(initialRvStartDate).diff(moment(modifiedRvStartDate), 'days');
  const diffBetweenRVEndDates = moment(initialRvEndDate).diff(moment(modifiedRvEndDate), 'days');
  const numberOfRVNights = moment(modifiedRvStartDate).diff(moment(modifiedRvEndDate), 'days');
  let newAddOnProducts = [];

  const handleSubmit = async e => {
    if (values.initialOrder.group && !hasBeenPaid && currentCharges != 0) {
      setGroupOrderEditModalVisible(true);
    } else if (currentCharges < 0) {
      setRefundModalVisible(true);
    } else if (currentCharges > 0) {
      setChargeModalVisible(true);
    } else {
      e.preventDefault();
      setSubmitting(true);
      window.scrollTo(0, 0);
      await onSubmit(values, {}, false, false, {});
    }

    setSubmitting(false);
  };

  const getDateDifferences = (startDateDifferences: number, endDateDifferences: number) => {
    if (startDateDifferences !== 0 || endDateDifferences !== 0) {
      return MODIFIED;
    }

    return NOT_MODIFIED;
  };

  const getNewAddOns = additions => {
    const newAddOns = additions.map(el => {
      const currAddOn = initialFormValues.event.addOnProducts.find(i => i.id === el);
      return {
        addOnProduct: {
          id: currAddOn.id,
          addOn: currAddOn.addOn
        },
        reservation: null
      };
    });
    return (newAddOnProducts = newAddOns);
  };

  const buildAddOnChangesSource = () => {
    const addOnValues = [];
    const modAddOns = Object.keys(modifiedFormValues.addOns);
    initialFormValues.initialAddOns.forEach(el => {
      if (modAddOns.some(modId => modId === el.addOnProduct.id)) addOnValues.push(el), modAddOns.splice(modAddOns.indexOf(el.addOnProduct.id), 1);
    });
    getNewAddOns(modAddOns);
    return [...addOnValues, ...newAddOnProducts];
  };

  const getAddOnsDifferences = () => {
    const diff = [];
    buildAddOnChangesSource().forEach(addOnOriginal => {
      for (const id in modifiedFormValues.addOns) {
        if (addOnOriginal && addOnOriginal.addOnProduct.id === id && addOnOriginal.quantity !== modifiedFormValues.addOns[id]) {
          const quantityOriginal = initialFormValues.addOns[id] || 0;
          const quantityNew = modifiedFormValues.addOns[id] || 0;
          const quantityDiff = Number(quantityNew) - Number(quantityOriginal);
          diff.push({
            id,
            quantity: quantityNew,
            description: `${quantityDiff} ${addOnOriginal.addOnProduct.addOn.unitName}${quantityDiff > 1 ? 's' : ''} of ${
              addOnOriginal.addOnProduct.addOn.name
            }`
          });
        }
      }
    });
    return diff;
  };

  const handleSubmitUpdateOrder = async (refundInformation, refundPayment, isGroupOrder, noRefund, paymentInput = null, multipayment) => {
    await onSubmit(values, refundInformation, refundPayment, isGroupOrder, noRefund, paymentInput, multipayment);
  };

  const checkProductTypeQuantityDifferences = type => {
    const isStallProduct = type === Product.STALL;
    const initialProductType = isStallProduct ? initialFormValues.stalls : initialFormValues.rv_spot;
    const modifiedProductType = isStallProduct ? modifiedFormValues.stalls : modifiedFormValues.rv_spot;

    if (initialProductType && initialProductType.quantity !== modifiedProductType.quantity) {
      const quantityDifference = Math.abs(initialProductType.quantity - modifiedProductType.quantity);
      const isStallProduct = type === Product.STALL;
      const product = isStallProduct ? 'stall' : 'spot';
      if (quantityDifference > 0) {
        const productQuantity = quantityDifference === 1 ? `${quantityDifference} ${product}` : `${quantityDifference} ${product}s`;
        const dateDifference = isStallProduct ? Math.abs(numberOfStallNights) : Math.abs(numberOfRVNights);
        const productNights = dateDifference === 1 ? '1 night' : `${dateDifference} nights`;
        return {
          id: isStallProduct ? initialFormValues.initialStallProduct?.id : initialFormValues.initialRvProduct?.id,
          type: 'Remove',
          message: `${productQuantity} x ${productNights}`,
          newQuantity: Number(modifiedProductType.quantity)
        };
      }
    }

    return null;
  };

  const getQuestionDifferences = prodType => {
    let initQA = initialFormValues.productQuestionAnswers;
    let modQA = modifiedFormValues.productQuestionAnswers;
    let compare = (m, i, ix) => {
      if (m.id === i.id && JSON.stringify(m.answer) !== JSON.stringify(i.answer)) {
        modQA[ix].highlight = true;
        return true;
      }
      return false;
    };

    if (initQA !== modQA) {
      modQA.map((modAns, idx) => initQA.some(initAns => compare(modAns, initAns, idx)));
    }
    return modQA.filter(qa => qa.productType === prodType);
  };

  const checkProductRateDifferences = type => {
    const productType = type === Product.STALL ? 'stallProduct' : 'rvProduct';
    const initialProduct =
      type === Product.STALL ? initialFormValues.initialStallProduct?.reservation[productType] : initialFormValues.initialRvProduct?.reservation[productType];
    const currentProductId = type === Product.STALL ? values.stallProductId : values.rvProductId;
    const currentSelectedProduct = values.event[type === Product.STALL ? 'stallProducts' : 'rvProducts'].find(prod => prod.id === currentProductId);
    const hasDiff = currentSelectedProduct?.id !== initialProduct?.id;

    return [hasDiff, currentSelectedProduct];
  };

  const [rvProductTypeDifferences, currentRvProduct] = checkProductRateDifferences(Product.RV);
  const [stallProductTypeDifferences, currentStallProduct] = checkProductRateDifferences(Product.STALL);
  const stallDateDifferences = getDateDifferences(diffBetweenStallStartDates, diffBetweenStallEndDates);
  const stallQuantityDifferences = checkProductTypeQuantityDifferences(Product.STALL);
  const stallQuestionDifferences = getQuestionDifferences('stalls');
  const RVDateDifferences = getDateDifferences(diffBetweenRVStartDates, diffBetweenRVEndDates);
  const RVQuantityDifferences = checkProductTypeQuantityDifferences(Product.RV);
  const RVQuestionDifferences = getQuestionDifferences('rvSpots');

  const addOnDifferences = getAddOnsDifferences();

  return (
    <>
      <section>
        <ChargeModal
          handleSubmit={handleSubmitUpdateOrder}
          cancelWithRefund={false}
          className={className}
          order={order}
          open={chargeModalVisible}
          onClose={() => {
            setChargeModalVisible(false);
          }}
          currentCharges={currentCharges}
          reservationAdded={reservationAdded}
          paymentOptions={paymentOptions}
          setPaymentOptions={setPaymentOptions}
        />
        <RefundModal
          handleSubmit={handleSubmitUpdateOrder}
          cancelWithRefund={false}
          className={className}
          history={history}
          order={order}
          open={refundModalVisible}
          onClose={() => {
            setRefundModalVisible(false);
          }}
          priceAdjustments={differencesByItem}
          currentCharges={currentCharges}
        />
        <GroupOrderEditModal
          handleSubmit={handleSubmitUpdateOrder}
          className={className}
          order={order}
          open={groupOrderEditModalVisible}
          onClose={() => {
            setGroupOrderEditModalVisible(false);
          }}
          currentCharges={currentCharges}
        />
        <Form className={`${className}__form-container`}>
          <div className={`${className}__form-column-left`}>
            <StyledReviewInstructionsCard>
              <ReviewInstructions>
                <ErrorIcon style={{ position: 'relative', top: '15px', left: '-5px' }} />
                <p>
                  Items that have been modified are
                  <HighlightedParagraph>{` highlighted `}</HighlightedParagraph>
                </p>
              </ReviewInstructions>
            </StyledReviewInstructionsCard>
            {!!values.event.stallProducts.length && (
              <ProductCard className={className} isOpen={false} order={order} event={order.event} productType={Product.STALL} reservationEdit={false} isReview>
                <ReservationReviewProduct
                  className={className}
                  order={order}
                  currentProduct={currentStallProduct}
                  hasRateTypeDifferences={stallProductTypeDifferences}
                  productType={Product.STALL}
                  product={modifiedFormValues.stalls}
                  selectedProducts={modifiedFormValues.selectedStalls}
                  dateDifferences={stallDateDifferences}
                  quantityDifferences={stallQuantityDifferences}
                  questionDifferences={stallQuestionDifferences}
                />
              </ProductCard>
            )}
            {!!values.event.rvProducts.length && (
              <ProductCard className={className} isOpen={false} order={order} event={order.event} productType={Product.RV} reservationEdit={false} isReview>
                <ReservationReviewProduct
                  className={className}
                  order={order}
                  currentProduct={currentRvProduct}
                  hasRateTypeDifferences={rvProductTypeDifferences}
                  productType={Product.RV}
                  product={modifiedFormValues.rv_spot}
                  selectedProducts={modifiedFormValues.selectedRvs}
                  dateDifferences={RVDateDifferences}
                  quantityDifferences={RVQuantityDifferences}
                  questionDifferences={RVQuestionDifferences}
                />
              </ProductCard>
            )}
            {!!values.event.addOnProducts.length && (
              <ProductCard className={className} isOpen={false} order={order} event={order.event} productType={Product.ADD_ON} reservationEdit={false} isReview>
                <ReservationReviewProduct
                  className={className}
                  order={order}
                  productType={Product.ADD_ON}
                  product={modifiedFormValues.addOns}
                  selectedProducts={modifiedFormValues.addOns}
                  addOnsDifferences={addOnDifferences}
                  newAddOnProducts={newAddOnProducts}
                />
              </ProductCard>
            )}
            {adminNotes !== lastSavedNote && <AdminNotes adminNotes={adminNotes} setAdminNotes={() => {}} isReview />}
          </div>
          <div className={`${className}__form-column-right`}>
            <OrderHistory
              order={order}
              isReviewPage
              toggleRefundModalVisibility={() => toggleRefundModalVisibility(true)}
              reservationEdit
              loading={orderCostsLoading}
              priceAdjustments={differencesByItem}
              orderCosts={orderCosts && orderCosts.orderCosts}
              initialOrderCosts={initialOrderCosts && initialOrderCosts.orderCosts}
              reservationAdded={reservationAdded}
            />
            <SpecialRequests order={order} />
            <CardActionsBase>
              <CancelButtonAlt variant="contained" size="large" onClick={e => handleDiscard(e)}>
                DISCARD EDITS
              </CancelButtonAlt>
              <ReviewButtonBase primary variant="contained" size="large" disabled={isSubmitting} onClick={e => handleSubmit(e)}>
                NEXT
              </ReviewButtonBase>
            </CardActionsBase>
          </div>
        </Form>
      </section>
    </>
  );
}

const StyledReviewInstructionsCard = styled(FormCard)`
  padding: 0px 0px 0px 25px !important;
`;

const ReviewInstructions = styled.div`
  display: inline-flex;
  font-size: 16px;
  line-height: 25px;
`;

const HighlightedParagraph = styled.span`
  background-color: #f7e569;
`;

const ReviewReservationForm = styled(OrderReviewFormBase)`
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
      align-items: center;
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
    margin-right: 10px;
    min-width: 700px;
    align-self: flex-start;
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

  button {
    width: 225px !important;
  }
`;

const ReviewButtonBase = styled(Button)`
  &&& {
    width: 225px;
    margin-left: 20px;
    letter-spacing: 0.7px;
    line-height: normal;
  }
`;

export default ReviewReservationForm;
