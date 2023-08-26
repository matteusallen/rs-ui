//@flow
import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { sortArrayOfObj } from 'Utils/arrayHelpers';
import { Separator } from '../../../../components/Separator';
import { Product } from '../../../../constants/productType';
import _upperFirst from '../../../../utils/upperFirst';
import { displayFlex } from '../../../../styles/Mixins';

type ReservationReviewProductPropsType = {|
  // eslint-disable-next-line flowtype/no-weak-types
  addOnsDifferences?: Array<Object>,
  className: string,
  dateDifferences?: boolean,
  order: {
    orderItems: {
      // eslint-disable-next-line flowtype/no-weak-types
      filter: ({}) => any
    }
  },
  currentProduct: { name: string, nightly: boolean },
  product: {
    end: string,
    quantity: number | string,
    start: string
  },
  productType: string,
  quantityDifferences?: boolean,
  hasRateTypeDifferences?: boolean,
  selectedProducts: [],
  newAddOnProducts: []
|};

const HIGHLIGHTED = 'highlighted';

const ReservationReviewProductBase = (props: ReservationReviewProductPropsType): React$Node => {
  const {
    addOnsDifferences,
    className,
    dateDifferences,
    order,
    product,
    productType,
    quantityDifferences,
    selectedProducts,
    hasRateTypeDifferences,
    currentProduct,
    questionDifferences,
    newAddOnProducts
  } = props;
  const { orderItems } = order;
  const quantity = Number(product.quantity);
  const reservationOrderItemArray =
    productType !== Product.ADD_ON
      ? orderItems.filter(orderItem => {
          return orderItem.reservation && orderItem.reservation[productType];
        })
      : [];
  const reservationOrderItem = reservationOrderItemArray[0] || [];
  const { reservation } = reservationOrderItem ? reservationOrderItem : {};

  const hasStallOrSpotDiff = () => {
    if ((reservation || quantityDifferences) && (productType === 'stallProduct' || productType === 'rvProduct')) {
      const initialStallsOrSpotsString = sortArrayOfObj(reservation[productType === 'stallProduct' ? 'stalls' : 'rvSpots'], 'id').reduce(
        (acc, curr) => (acc += curr.id),
        ''
      );
      const currentStallsOrSpotsString = sortArrayOfObj(selectedProducts, 'id').reduce((acc, curr) => (acc += curr.id), '');
      return initialStallsOrSpotsString !== currentStallsOrSpotsString;
    }
  };

  const addOnOrderItems =
    productType === Product.ADD_ON
      ? orderItems
          .filter(orderItem => {
            return !!orderItem.addOnProduct;
          })
          .concat(newAddOnProducts)
      : [];

  const getDatesColumn = () => {
    const { start, end } = product;
    return (
      <>
        <p>Dates</p>
        <p>
          <span className={dateDifferences || (quantityDifferences && quantity === 0) ? HIGHLIGHTED : ''}>
            {quantity > 0 ? `${moment(start).format('MM/DD/YY')} - ${moment(end).format('MM/DD/YY')}` : '-'}
          </span>
        </p>
      </>
    );
  };

  const getAddOnColumn = addOnsDifferences => {
    const addOnElements = [];
    addOnOrderItems.forEach(orderItem => {
      let isDiff = false;
      let quantity = orderItem.quantity;
      const id = orderItem.addOnProduct.id;
      if (addOnsDifferences) {
        addOnsDifferences.forEach(addOnDiff => {
          if (addOnDiff.id === id) {
            isDiff = true;
            quantity = addOnDiff.quantity || '-';
          }
        });
      }
      addOnElements.push(
        <div className="column" key={`add-on-${id}`} id={`add-on-column-${id}`}>
          <h4>{_upperFirst(orderItem.addOnProduct.addOn.name)}</h4>
          <div className={isDiff ? HIGHLIGHTED : ''}>
            {quantity > 0 ? `${quantity} ${_upperFirst(orderItem.addOnProduct.addOn.unitName)}${quantity > 1 ? 's' : ' '}` : '-'}
          </div>
        </div>
      );
    });
    return addOnElements;
  };

  const getTypeColumn = productType => {
    if (productType === Product.STALL) {
      return (
        <>
          <p>Rate Type</p>
          <p className={((quantityDifferences && quantity === 0) || hasRateTypeDifferences) && HIGHLIGHTED}>
            {quantity > 0 ? (currentProduct?.nightly ? 'Nightly' : 'Flat Rate') : '-'}
          </p>
        </>
      );
    }
    if (productType === Product.RV) {
      return (
        <div className="column">
          <p>Spot Type</p>
          <p className={((quantityDifferences && quantity === 0) || hasRateTypeDifferences) && HIGHLIGHTED}>{quantity > 0 ? currentProduct?.name : '-'}</p>
        </div>
      );
    }
    return null;
  };

  const getSpacesColumn = () => {
    const selectedProductNames = selectedProducts.map(p => p.name);
    if (productType === Product.STALL) {
      return (
        <>
          <p>Stalls</p>
          <p>
            <span className={quantityDifferences || hasStallOrSpotDiff() ? HIGHLIGHTED : ''}>
              {quantity > 0
                ? !selectedProducts.length
                  ? `${quantity} stall${parseInt(quantity) === 1 ? '' : 's'}`
                  : `${selectedProductNames.sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).join(', ')}`
                : '-'}
            </span>
          </p>
        </>
      );
    }
    if (productType === Product.RV) {
      return (
        <>
          <p>Spots</p>
          <p>
            <span className={quantityDifferences || hasStallOrSpotDiff() ? HIGHLIGHTED : ''}>
              {quantity > 0
                ? !selectedProducts.length
                  ? `${quantity} spot${parseInt(quantity) === 1 ? '' : 's'}`
                  : `${selectedProductNames.sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).join(', ')}`
                : '-'}
            </span>
          </p>
        </>
      );
    }
    return null;
  };

  const showQuestions = questionAns => {
    return (
      <>
        <p className="question">{questionAns.question}</p>
        <p className={questionAns.highlight ? HIGHLIGHTED : ''}>{questionAns.answer.join(', ')}</p>
      </>
    );
  };

  return (
    <div className={className}>
      {(reservation || productType === Product.STALL || productType === Product.RV) && (
        <>
          <Separator />
          {
            <div className={`${className}__reservation-info`}>
              <div>{getDatesColumn()}</div>
              <div>{getTypeColumn(productType)}</div>
              <div>{getSpacesColumn()}</div>
              <div className={`${className}__question-answers`}>{questionDifferences.length > 0 && questionDifferences.map(qa => showQuestions(qa))}</div>
            </div>
          }
        </>
      )}
      {!reservation && productType !== Product.ADD_ON && (
        <>
          <Separator />-
        </>
      )}
      {!reservation && productType === Product.ADD_ON && !addOnOrderItems.length && (
        <>
          <Separator />-
        </>
      )}
      {!reservation && !!addOnOrderItems.length && (
        <>
          <Separator />
          <div className={`${className}__card-content`}>
            <div className="add-on-row">{getAddOnColumn(addOnsDifferences)}</div>
            {JSON.stringify(quantityDifferences)}
          </div>
        </>
      )}
    </div>
  );
};

const ReservationReviewProduct = styled(ReservationReviewProductBase)`
  .highlighted {
    background-color: #f7e569;
    width: fit-content;
  }
  &__reservation-info {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20px;

    > div p:first-child {
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 18px;
      letter-spacing: 0.79px;
      line-height: 23px;
    }

    p {
      margin: 0;
    }
  }
  &__card-content {
    .add-on-row {
      ${displayFlex}
      flex-flow: row nowrap;
      justify-content: flex-start;
      font-family: 'IBMPlexSans-Regular';
      font-size: 1rem;
      line-height: 25px;
      -webkit-letter-spacing: 0;
      -moz-letter-spacing: 0;
      -ms-letter-spacing: 0;
      letter-spacing: 0;
      .column {
        font-size: 1rem;
        margin-right: 20px;
        &:last-child {
          margin-right: unset;
        }
        width: 30%;
        max-width: 33%;
      }

      h4 {
        font-family: 'IBMPlexSans-SemiBold';
        font-size: 18px;
        -webkit-letter-spacing: 0.79px;
        -moz-letter-spacing: 0.79px;
        -ms-letter-spacing: 0.79px;
        letter-spacing: 0.79px;
        line-height: 23px;
        margin-bottom: 0;
        margin-block-start: 0;
      }
    }

    .separator {
      margin-top: 15px;
      height: 1px;
      width: 660px;
      background-color: #c8d6e5;
    }
  }
  h4 {
    font-family: 'IBMPlexSans-SemiBold';
    font-size: 18px;
    -webkit-letter-spacing: 0.79px;
    -moz-letter-spacing: 0.79px;
    -ms-letter-spacing: 0.79px;
    letter-spacing: 0.79px;
    line-height: 23px;
    margin-bottom: 0;
  }
  &__question-answers {
    p {
      margin: 16px 0;
    }
    .question {
      font-family: 'IBMPlexSans-SemiBold';
      font-size: 18px;
      letter-spacing: 0.79px;
      line-height: 23px;
    }
  }
`;
export default ReservationReviewProduct;
