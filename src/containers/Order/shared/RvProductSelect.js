// @flow
import React, { useMemo, useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { useLazyQuery } from '@apollo/react-hooks';
import { RV_PRODUCT_AVAILABILITY } from '../../../queries/RvProductAvailability';

import { DATE_FORMAT, mapRvProductList } from '../../../helpers';
import ProductSelect from './ProductSelect';

import type { ReservationFormShapeType } from '../Renter/Create';

type RvProductSelectPropsType = {|
  className?: string,
  noLayout?: boolean,
  reservationEdit?: boolean,
  allowBackDateQuery?: boolean
|};

const RvProductSelect = (props: RvProductSelectPropsType) => {
  const {
    className = '',
    noLayout,
    reservationEdit,
    allowBackDateQuery,
    hasQuantityDiff,
    hasDatesDifference,
    handleProductAvailability,
    loadingHandler
  } = props;
  const { values } = useFormikContext<ReservationFormShapeType>();

  const [rvProductAvailability, setRvProductAvailability] = useState([]);

  const { event, rv_spot, rvProductId, initialRvProduct } = values;
  const { id: eventId, rvProducts } = event;
  const { quantity } = rv_spot;
  const startDate = rv_spot.start ? moment(rv_spot.start).format(DATE_FORMAT) : null;
  const endDate = rv_spot.end ? moment(rv_spot.end).format(DATE_FORMAT) : null;

  const [getRvProductAvailability, { loading: loadingAvailability, data: rvProductAvailabilityData }] = useLazyQuery<RvProductAvailabilityReturnType>(
    RV_PRODUCT_AVAILABILITY,
    {
      fetchPolicy: 'network-only'
    }
  );

  useEffect(() => {
    if (startDate && endDate && eventId) {
      getRvProductAvailability({
        variables: {
          input: {
            eventId,
            startDate,
            endDate,
            reservationId: reservationEdit && +initialRvProduct?.reservation?.id,
            includeCurrentReservation: hasQuantityDiff ? false : hasDatesDifference ? true : false
          }
        }
      });
    }
  }, [startDate, endDate, eventId, quantity]);

  useEffect(() => {
    loadingHandler && loadingHandler(loadingAvailability);

    if (!loadingAvailability && rvProductAvailabilityData && rvProductAvailabilityData.rvProductAvailability) {
      setRvProductAvailability(rvProductAvailabilityData.rvProductAvailability);
      handleProductAvailability && handleProductAvailability(rvProductAvailabilityData.rvProductAvailability);
    } else {
      setRvProductAvailability([]);
      handleProductAvailability && handleProductAvailability([]);
    }
  }, [rvProductAvailabilityData, rvProductAvailabilityData?.rvProductAvailability, loadingAvailability]);

  const items = useMemo(() => mapRvProductList(rvProducts), [JSON.stringify(rvProducts)]);

  return (
    <ProductSelect
      allowBackDateQuery={allowBackDateQuery}
      className={className}
      endDate={endDate}
      items={items}
      productAvailability={cloneDeep(rvProductAvailability)}
      productId={rvProductId}
      productType={'rvs'}
      quantity={quantity}
      startDate={startDate}
      title="RV Spot Type"
      loading={loadingAvailability}
      noLayout={noLayout}
      reservationEdit={reservationEdit}
    />
  );
};

export default RvProductSelect;
