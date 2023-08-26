//@flow
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import styled from 'styled-components';
import { Check } from '@material-ui/icons';
import { useFormikContext } from 'formik';
import { paragraphBold } from '../../../styles/Typography';
import colors from '../../../styles/Colors';
import { HeadingTwo } from '../../../components/Headings';
import FormCard from '../../../components/Cards/FormCard';
import ProductRow, { getPrice } from '../../../components/ProductRow';
import { createDateRange, datesInRange } from '../../../helpers';
import type { StallProductAvailabilityType } from '../../../queries/StallProductAvailability';
import type { RvProductAvailabilityType } from '../../../queries/RvProductAvailability';
import { doMediaQuery } from '../../../styles/Mixins';
import type { RvProductListReturnType, StallProductListReturnType } from '../../../helpers';
import IndeterminateLoading from '../../../components/Loading/IndeterminateLoading';
import moment from 'moment';
import type { ReservationFormShapeType } from '../Renter/Create';
import { isMaximumAllowedExceeded } from '../../../helpers/productLimits';
import { checkMinNights } from './minNights';

type ProductSelectPropsType = {|
  className?: string,
  endDate: string | null,
  items: StallProductListReturnType[] | RvProductListReturnType[],
  loading: boolean,
  noLayout?: boolean,
  productAvailability: StallProductAvailabilityType[] | RvProductAvailabilityType[],
  productId: string,
  productType: 'stalls' | 'rvs',
  quantity: number,
  reservationEdit?: boolean,
  startDate: string | null,
  title: string,
  allowBackDateQuery?: boolean
|};

const ProductSelect = (props: ProductSelectPropsType): React$Element<'div'> => {
  const {
    className = '',
    startDate,
    endDate,
    quantity,
    items,
    productAvailability,
    productId,
    productType,
    title,
    loading,
    noLayout,
    reservationEdit,
    allowBackDateQuery
  } = props;
  const isStalls = productType === 'stalls';
  const { values, setFieldValue } = useFormikContext<ReservationFormShapeType>();

  const [selected, setSelected] = useState<string | null>(productId || null);
  const [isBelowMinNights, setIsBelowMinNights] = useState(false);

  const [reservationDuration] = useMemo(
    () =>
      createDateRange({
        eventStartDate: startDate,
        eventEndDate: endDate
      }),
    [startDate, endDate]
  );

  const getAvailability = useCallback(
    (id: string): number => {
      if (productAvailability.length) {
        const capacity = productAvailability.find(({ productId }) => productId === id);
        return capacity ? capacity.available : 0;
      } else {
        return 0;
      }
    },
    [productAvailability]
  );

  const hasCapacity = useCallback(
    (id: string): boolean => {
      if (!quantity || !startDate || !endDate) return false;
      const availability = getAvailability(id);
      return availability >= Number(quantity) && availability !== 0;
    },
    [quantity, startDate, endDate, getAvailability]
  );

  const getProductButtonLabel = useCallback(
    (id: string, outOfRange?: boolean): string => {
      if (!quantity || !startDate || !endDate || productAvailability.length === 0) {
        return `SELECT`;
      }

      if (outOfRange) {
        return 'N/A';
      }

      if (hasCapacity(id)) {
        return 'SELECT';
      }

      if (getAvailability(id) === 0) {
        return `SOLD OUT`;
      }

      return `ONLY ${getAvailability(id)} LEFT`;
    },
    [quantity, startDate, endDate, productAvailability, getAvailability]
  );

  const capacitySelectedItem = useCallback(hasCapacity(selected || ''), [hasCapacity, selected]);

  useEffect(() => {
    if (productAvailability.length > 0 && selected && !capacitySelectedItem && !reservationEdit) {
      setSelected(null);
    }
  }, [capacitySelectedItem, quantity, startDate, endDate, selected]);

  useEffect(() => {
    if ((!quantity || isMaximumAllowedExceeded(quantity, productType)) && !reservationEdit) {
      setSelected(null);
    } else {
      setSelected(productId);
    }
  }, [quantity, productId]);

  useEffect(() => {
    setFieldValue(isStalls ? 'stallProductId' : 'rvProductId', selected);
  }, [selected]);

  useEffect(() => {
    if (selected && !capacitySelectedItem && !reservationEdit) {
      setSelected(null);
    }
  }, [capacitySelectedItem]);

  useEffect(() => {
    setFieldValue(`isBelowMinNights.${isStalls ? 'stalls' : 'rvs'}`, isBelowMinNights);
  }, [isBelowMinNights]);

  const itemsList = items.map(({ id, header, key, power, price, sewer, subheader, water, nightly, startDate: start, endDate: end, description }, index) => {
    const queryStart =
      allowBackDateQuery || (reservationEdit && moment(startDate).isBefore(moment()))
        ? moment(start)
            .subtract('1', 'days')
            .format('YYYY-MM-DD')
        : start;

    const isDatesInRange = datesInRange({
      start: queryStart,
      end,
      selected: { start: startDate, end: endDate }
    });

    const handleSelectedProduct = id => {
      const productType = isStalls ? values.stalls : values.rv_spot;
      const dates = {
        startDate: typeof productType.start === 'string' ? moment(productType.start) : productType.start,
        endDate: typeof productType.end === 'string' ? moment(productType.end) : productType.end
      };
      const [selectedProduct] = items.filter(product => product.id === id);
      setFieldValue(`selected${isStalls ? 'Stall' : 'RV'}MinNights`, selectedProduct.minNights);
      checkMinNights(dates, selectedProduct.minNights, setIsBelowMinNights);
      setSelected(id);
    };

    return (
      <ProductRow
        startDate={start}
        endDate={end}
        id={`product-row-${index}`}
        key={`product-row-${key}`}
        className={className}
        disabled={isMaximumAllowedExceeded(quantity, productType) || !hasCapacity(id) || !isDatesInRange}
        header={header}
        label={
          selected === id && getAvailability(id) !== 0 ? (
            <div className={'selected-item'} data-testid={`selected-item${index}`}>
              <Check />
              <span>Selected</span>
            </div>
          ) : (
            getProductButtonLabel(id, !isDatesInRange)
          )
        }
        onClick={() => handleSelectedProduct(id)}
        power={power}
        availability={getAvailability(id)}
        price={
          !!startDate && !!endDate && !!quantity && isDatesInRange && quantity <= getAvailability(id)
            ? getPrice({
                quantity,
                reservationDuration: reservationDuration.length,
                price,
                nightly
              })
            : price
        }
        unitPrice={price}
        reservationDuration={reservationDuration.length}
        quantity={isDatesInRange ? quantity : 0}
        selected={selected === id && getAvailability(id) !== 0}
        sewer={sewer}
        subheader={subheader}
        water={water}
        nightly={nightly}
        productType={productType}
        description={description}
      />
    );
  });

  if (noLayout) {
    return (
      <div className={`${className}__products_container`} data-testid={`${productType}_reservation_type`}>
        {loading && (
          <div className={`${className}__products_container_overlay`}>
            <IndeterminateLoading />
          </div>
        )}
        <div className={`${className}__products_grid`}>{itemsList}</div>
      </div>
    );
  }
  return (
    <div className={`${className}__products_container`} data-testid={`${productType}_reservation_type`}>
      {loading && (
        <div className={`${className}__products_container_overlay`}>
          <IndeterminateLoading />
        </div>
      )}
      <FormCard className={className}>
        <div className={`${className}__card_headline_wrapper`}>
          <HeadingTwoStyled label={title} />
          <strong className={`${className}__required_text`}>(Required)</strong>
        </div>
        <div className={`${className}__products_grid`}>{itemsList}</div>
      </FormCard>
    </div>
  );
};

const ProductSelectStyled = styled(ProductSelect)`
  &__products_container {
    position: relative;
    width: 100%;
    height: 100%;
    margin-bottom: 20px;
    .selected-item {
      position: relative;
      top: -2px;
      margin: 0;
      padding: 0;
      svg {
        top: 5px;
        position: relative;
      }
    }
  }
  &__products_container_overlay {
    background-color: rgba(255, 255, 255, 0.7);
    position: absolute;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__card_headline_wrapper {
    margin: 0 0 15px 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: baseline;
    ${doMediaQuery(
      'SMALL_TABLET_WIDTH',
      `
      flex-direction: row;
    `
    )}
  }
  &__required_text {
    ${paragraphBold}
    font-size: 16px;
    letter-spacing: 0.7px;
    margin: 0 0 0 5px;
    color: ${colors.text.lightGray2};
  }
`;

const HeadingTwoStyled = styled(HeadingTwo)`
  margin: 0;
  font-size: 25px !important;
  letter-spacing: 1.1px !important;
  line-height: 25px !important;
`;

export default ProductSelectStyled;
