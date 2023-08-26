//@flow
import React, { useEffect, useCallback, useState } from 'react';
import { Switch as FormCardSwitch } from '@material-ui/core';
import styled from 'styled-components';
import FormCard from '../../../../components/Cards/FormCard';
import { HeadingThree } from '../../../../components/Headings';
import colors from '../../../../styles/Colors';
import type { OrderItemType } from '../../../../mutations/OrderCheckout';
import { isEmpty } from '../../../../helpers';
import type { EventType } from '../../../../queries/Renter/EventForOrderCreate';
import type { ProductType } from '../../../../constants/productType';
import { Product } from '../../../../constants/productType';
import { SimpleMenu } from '../../../../components/SimpleMenu';

type ProductCardPropsType = {|
  children: React$Node,
  className: string,
  event: EventType,
  setIsWarningOpen?: () => void,
  isOpen: boolean,
  hasInitialProduct?: boolean,
  isReview?: boolean,
  order?: {
    orderItems?: OrderItemType[]
  },
  productType: ProductType,
  reservationEdit: boolean,
  simpleDeleteDisabled?: boolean,
  setIsOpen?: (open: boolean) => void
|};

const ProductCardBase = (props: ProductCardPropsType) => {
  const {
    className,
    reservationEdit,
    event,
    isOpen,
    isReview,
    order = {},
    productType,
    setIsOpen,
    hasInitialProduct,
    setIsWarningOpen,
    simpleDeleteDisabled
  } = props;

  const eventSelected = event && !isEmpty(event);

  const [isProductAvailableForSelectedEvent, setIsAvailableForSelectedEvent] = useState(false);

  const { orderItems = [] } = order || {};
  const reservationOrderItemArray =
    orderItems &&
    orderItems.filter(orderItem => {
      return productType === Product.ADD_ON
        ? orderItem.addOnProduct
        : orderItem.reservation &&
            // eslint-disable-next-line no-prototype-builtins
            orderItem.reservation.hasOwnProperty(productType);
    });
  const reservationOrderItem = reservationOrderItemArray ? reservationOrderItemArray[0] : {};
  const { reservation } = reservationOrderItem ? reservationOrderItem : {};

  // Gets display text from productType
  const getProductName = useCallback((productType): string => {
    switch (productType) {
      case Product.STALL:
        return 'Stall';
      case Product.RV:
        return 'RV Spot';
      case Product.ADD_ON:
        return 'Add On';
      case 'NOTES':
        return ' Admin Note';
      default:
        return '';
    }
  });

  // Gets the property on the getQuery response data from productType
  const getProductPropOnData = useCallback((productType: ProductType): 'stallProducts' | 'rvProducts' | 'addOnProducts' | 'NOTES' => {
    switch (productType) {
      case Product.STALL:
        return 'stallProducts';
      case Product.RV:
        return 'rvProducts';
      case Product.ADD_ON:
        return 'addOnProducts';
      default:
        return 'stallProducts';
    }
  });

  useEffect(() => {
    if (setIsOpen) setIsOpen(false);
  }, [event.id]);

  useEffect(() => {
    if (productType === 'NOTES') {
      setIsAvailableForSelectedEvent(true);
    } else {
      const product = getProductPropOnData(productType);
      if (event && event[product]) {
        setIsAvailableForSelectedEvent(event[product].length > 0);
      } else {
        setIsAvailableForSelectedEvent(false);
      }
    }
  }, [event]);

  const getReservationSection = () => {
    const options = [
      { label: 'Edit', onClick: () => (setIsOpen ? setIsOpen(!isOpen) : {}), dataTestId: 'simple-menu-edit', disabled: !hasInitialProduct },
      {
        label: 'Delete',
        disabled: simpleDeleteDisabled,
        dataTestId: 'simple-menu-delete',
        onClick: () => (setIsWarningOpen ? setIsWarningOpen() : {})
      }
    ];
    return (
      <div className={`${className}__edit-options-container`}>
        {!reservationEdit ? (
          <button type="button" onClick={setIsOpen ? () => setIsOpen(!isOpen) : undefined}>
            {isOpen ? 'Close' : 'Edit'}
          </button>
        ) : (
          <SimpleMenu isParentOpen={isOpen} options={options} handleParentClose={() => (setIsOpen ? setIsOpen(false) : {})} />
        )}
      </div>
    );
  };

  const getIncludeSection = productType => {
    return (
      <div className={`${className}__switch-container`} data-testid={`collapsed-section-${productType}`}>
        <p>Include {getProductName(productType)}s?</p>
        <FormCardSwitch
          color={'primary'}
          disabled={!eventSelected && !reservationEdit}
          onChange={setIsOpen ? () => setIsOpen(!isOpen) : undefined}
          size={'medium'}
          checked={isOpen}
        />
      </div>
    );
  };

  const getNoSelectionSection = productType => {
    return (
      <div className={`${className}__switch-container`} data-testid={`no-selection-${productType}`}>
        <p>Select an event to enter {getProductName(productType)} details</p>
      </div>
    );
  };

  return (
    <FormCard className={className} dataTestId={`card_${productType}`}>
      <div
        data-testid={`product-card-${productType}`}
        className={`${className}__title-row ${!isProductAvailableForSelectedEvent && (eventSelected || reservationEdit) ? 'disabled' : ''}`}>
        <HeadingThree label={`${getProductName(productType)}s`} />
        {!eventSelected && !reservationEdit && getNoSelectionSection(productType)}
        {reservationEdit && !order.canceled && isProductAvailableForSelectedEvent && getReservationSection()}
        {isProductAvailableForSelectedEvent && !reservation && !isReview && !reservationEdit && getIncludeSection(productType)}
      </div>
      {isProductAvailableForSelectedEvent && props.children}
    </FormCard>
  );
};

const ProductCard = styled(ProductCardBase)`
  &&& {
    padding: 20px;
    min-width: 400px;
    overflow: visible;
  }
  &__title-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &.disabled {
      color: #6b6e74;
      height: 57px;
    }
    h3 {
      text-transform: capitalize;
    }
  }
  &__switch-container {
    display: flex;
    justify-content: center;
    align-items: center;

    p {
      margin: 0;
    }
  }
  &__edit-options-container,
  &__switch-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .MuiSwitch-colorPrimary.Mui-checked {
    color: ${colors.white};
  }
  .MuiSwitch-colorPrimary.Mui-checked + .MuiSwitch-track {
    background-color: ${colors.button.primary.active};
    opacity: 1;
  }
  &__edit-options-container button {
    padding: 0 10px;
    background: none;
    border: none;
    font-family: 'IBMPlexSans-Regular';
    font-size: 15px;
    letter-spacing: 1.05px;
    line-height: 17px;
    text-transform: uppercase;
  }
  &__edit-options-container button:first-child {
    color: ${colors.error.primary};
  }
  &__edit-options-container button:last-child {
    color: ${colors.border.tertiary};
  }
  &__edit-options-container button:focus {
    outline: none;
  }
  &__edit-options-container button:hover {
    cursor: pointer;
  }
`;

export default ProductCard;
