export const formatTablePrice = price => {
  if (price % 1 === 0) {
    return `$${price}`;
  } else {
    return `$${parseFloat(price).toFixed(2)}`;
  }
};
