// @flow
import React, { useMemo, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { useFormikContext } from 'formik';
import moment from 'moment';
import { cloneDeep } from 'lodash';

import { DATE_FORMAT, mapStallProductList } from '../../../helpers';
import { STALL_PRODUCT_AVAILABILITY } from '../../../queries/StallProductAvailability';
import type { StallProductAvailabilityReturnType } from '../../../queries/StallProductAvailability';
import ProductSelect from './ProductSelect';

import type { ReservationFormShapeType } from '../Renter/Create';

type StallProductSelectPropsType = {|
  className?: string,
  noLayout?: boolean,
  reservationEdit?: boolean,
  allowBackDateQuery?: boolean
|};

const StallProductSelect = (props: StallProductSelectPropsType) => {
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
  const {
    values: {
      initialStallProduct,
      stalls: { end, start, quantity },
      event: { id: eventId, stallProducts },
      stallProductId
    }
  } = useFormikContext<ReservationFormShapeType>();

  const [stallProductAvailability, setStallProductAvailability] = useState([]);

  const startDate = start ? moment(start).format(DATE_FORMAT) : null;
  const endDate = end ? moment(end).format(DATE_FORMAT) : null;

  const [getStallProductAvailability, { loading: loadingAvailability, data: stallProductAvailabilityData }] = useLazyQuery<StallProductAvailabilityReturnType>(
    STALL_PRODUCT_AVAILABILITY,
    { fetchPolicy: 'network-only' }
  );

  useEffect(() => {
    if (startDate && endDate && eventId) {
      getStallProductAvailability({
        variables: {
          input: {
            eventId,
            startDate,
            endDate,
            reservationId: reservationEdit && +initialStallProduct?.reservation?.id,
            includeCurrentReservation: hasQuantityDiff ? false : hasDatesDifference ? true : false
          }
        }
      });
    }
  }, [startDate, endDate, eventId, quantity]);

  useEffect(() => {
    loadingHandler && loadingHandler(loadingAvailability);

    if (!loadingAvailability && stallProductAvailabilityData && stallProductAvailabilityData.stallProductAvailability) {
      setStallProductAvailability(stallProductAvailabilityData.stallProductAvailability);
      handleProductAvailability && handleProductAvailability(stallProductAvailabilityData.stallProductAvailability);
    } else {
      setStallProductAvailability([]);
      handleProductAvailability && handleProductAvailability([]);
    }
  }, [stallProductAvailabilityData, stallProductAvailabilityData?.stallProductAvailability, loadingAvailability]);

  const items = useMemo(() => mapStallProductList(stallProducts), [JSON.stringify(stallProducts)]);

  return (
    <ProductSelect
      allowBackDateQuery={allowBackDateQuery}
      className={className}
      endDate={endDate}
      items={items}
      productAvailability={cloneDeep(stallProductAvailability)}
      productId={stallProductId}
      productType={'stalls'}
      quantity={quantity}
      reservationEdit={reservationEdit}
      startDate={startDate}
      title="Stall Reservation Type"
      loading={loadingAvailability}
      noLayout={noLayout}
    />
  );
};

export default StallProductSelect;
