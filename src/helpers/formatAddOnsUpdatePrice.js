//@flow
export const formatAddOnsUpdatePrice = (updatedAddOnQuantities: {}, orderItems: []): string => {
  const addOnItems = orderItems.filter(item => !item.reservation);

  let updatedAddOnPrice = 0;
  for (const item of addOnItems) {
    if (!item.addOnProduct) continue;
    const { id, price } = item.addOnProduct;
    const quantityDiff = updatedAddOnQuantities[+id] - item.quantity;
    updatedAddOnPrice += quantityDiff * price;
  }
  return parseFloat(updatedAddOnPrice).toFixed(2);
};
