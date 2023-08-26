//@flow
export const formatPriceInformation = (price: number, noDecimals?: boolean): string => {
  if (noDecimals && price % 1 === 0) {
    return price.toFixed(0);
  }
  return parseFloat(price).toFixed(2);
};
