//@flow
import React from 'react';

type AddOnsReceiptPropsType = {|
  addOnsQuantities: AddOnsQuantityType[],
  addOnsTotals: AddOnTotalType[],
  className: string
|};

export type AddOnTotalType = {|
  eventAddOnId: string | number,
  id: string | number,
  name: string,
  price: number,
  priceType: string,
  quantity: number,
  unitName: string
|};

export type AddOnsQuantityType = {|
  addOnId: number | string,
  quantity: number | string
|};

const AddOnsReceipt = ({ addOnsQuantities = [], addOnsTotals = [], className }: AddOnsReceiptPropsType) => {
  return (
    <>
      {addOnsQuantities
        .map(({ addOnId, quantity }) => {
          const addOnsTotal = addOnsTotals.find(a => Number(a.id) === Number(addOnId));

          if (!addOnsTotal || Number(quantity) <= 0) return null;

          const { unitName, name, priceType, price } = addOnsTotal;
          const line = priceType === 'total' ? `${quantity} ${name}` : `${quantity} ${Number(quantity) === 1 ? `${unitName}` : `${unitName}s`} of ${name}`;
          return (
            <div className={`${className} ticket-line`} key={`addOn-${addOnId}`}>
              <p>{line}</p>
              <p>${price.toFixed(2)}</p>
            </div>
          );
        })
        .filter(i => i !== null)}
    </>
  );
};

export default AddOnsReceipt;
