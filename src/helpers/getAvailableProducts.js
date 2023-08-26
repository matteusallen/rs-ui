//@flow
import type { RvProductAvailabilityType } from '../queries/RvProductAvailability';
import type { StallProductAvailabilityType } from '../queries/StallProductAvailability';
import { useFormikContext } from 'formik';

type UseAvailableRvProductsReturnType = {|
  capacitySelectedItem: boolean,
  getAvailability: (id: string) => number,
  getProductButtonLabel: (id: string, outOfRange?: boolean) => string,
  hasCapacity: (id: string) => boolean
|};

type UseAvailableRvProductsParamsType = {|
  endDate: string | null,
  items?: RvProductAvailabilityType[] | StallProductAvailabilityType[],
  quantity: number,
  selected: string | null,
  startDate: string | null,
  productType: string
|};

export const getAvailableProducts = ({
  items = [],
  quantity,
  startDate,
  endDate,
  selected,
  productType
}: UseAvailableRvProductsParamsType): UseAvailableRvProductsReturnType => {
  const { values } = useFormikContext();
  const initialProduct = productType === 'stalls' ? 'initialStallProduct' : 'initialRvProduct';
  const initialProductId = values[initialProduct]?.reservation[productType === 'stalls' ? 'stallProduct' : 'rvProduct'].id;
  const initialProductQuantity = values[initialProduct]?.quantity;

  const getAvailability = (id: string): number => {
    const capacity = items.find(({ productId }) => productId === id);
    if (capacity && id === initialProductId) capacity.available += +initialProductQuantity;
    return capacity ? capacity.available : 0;
  };

  const hasCapacity = (id: string): boolean => {
    if (!quantity || !startDate || !endDate) return false;
    const availability = getAvailability(id);
    return availability >= Number(quantity) && availability !== 0;
  };

  const getProductButtonLabel = (id: string, outOfRange?: boolean): string => {
    if (!quantity || !startDate || !endDate || items.length === 0) {
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
  };

  const capacitySelectedItem = hasCapacity(selected || '');

  return {
    getAvailability,
    getProductButtonLabel,
    hasCapacity,
    capacitySelectedItem
  };
};
