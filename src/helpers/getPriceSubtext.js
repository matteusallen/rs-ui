//@flow

export const getPriceSubtext = ({
  productType,
  nightly,
  reservationDuration,
  quantity,
  price
}: {
  nightly?: boolean,
  productType: 'stalls' | 'rvs',
  quantity: number,
  price: number,
  reservationDuration: number
}): string => {
  const unit = productType === 'stalls' ? 'stall' : 'spot';
  const noQuantityOrDates = !reservationDuration || !quantity;
  const displayText = `${noQuantityOrDates ? '' : `for ${quantity} ${unit}${quantity > 1 ? 's' : ''}, `}$${
    price.toString().indexOf('.') > 0 ? price.toFixed(2) : price
  } ${nightly ? 'per night' : `flat rate per ${unit}`}`;

  return displayText;
};
