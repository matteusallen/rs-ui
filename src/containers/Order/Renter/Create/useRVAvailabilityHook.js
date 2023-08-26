// @flow
import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';

import type { RvProductAvailabilityReturnType, RvProductAvailabilityType } from '../../../../queries/RvProductAvailability';
import { RV_PRODUCT_AVAILABILITY } from '../../../../queries/RvProductAvailability';
import type { RvProductType } from '../../../../helpers';

type UseAvailabilityHookInputType = {|
  quantity?: number,
  endDate?: string | null,
  eventId?: string,
  rvProducts: RvProductType[],
  startDate?: string | null
|};

type UseAvailabilityHookReturnType = {|
  createLazyQueryCallback: (eventId: string) => (startDate: string, endDate: string) => void,
  loading: boolean,
  rvProductAvailability: RvProductAvailabilityType[]
|};

const useRVAvailabilityHook = (props: UseAvailabilityHookInputType): UseAvailabilityHookReturnType => {
  const { endDate, startDate, eventId, rvProducts } = props;
  const [rvProductAvailability, setRvProductAvailability] = useState([]);
  const [getRvProductAvailability, { loading, data: rvProductAvailabilityData }] = useLazyQuery<RvProductAvailabilityReturnType>(RV_PRODUCT_AVAILABILITY, {
    fetchPolicy: 'network-only'
  });

  useEffect(() => {
    if (startDate && endDate && eventId && rvProducts.length > 0) {
      getRvProductAvailability({
        variables: {
          input: { eventId, startDate, endDate }
        }
      });
    }
  }, [startDate, endDate, eventId]);

  useEffect(() => {
    if (!loading && rvProductAvailabilityData && rvProductAvailabilityData.rvProductAvailability) {
      setRvProductAvailability(rvProductAvailabilityData.rvProductAvailability);
    } else {
      setRvProductAvailability([]);
    }
  }, [rvProductAvailabilityData, loading]);

  return {
    loading,
    rvProductAvailability,
    createLazyQueryCallback: (eventId: string) => (startDate: string, endDate: string) =>
      getRvProductAvailability({
        variables: {
          input: { eventId, startDate, endDate }
        }
      })
  };
};

export default useRVAvailabilityHook;
