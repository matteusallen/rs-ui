//@flow
import React from 'react';

import { EventCard } from '../Cards/EventCard';
import { EventFormType } from '../Form';

type ReviewAddOnsPropType = {|
  formikValues: EventFormType,
  initialValues: EventFormType
|};

const ReviewAddOns = ({ formikValues, initialValues }: ReviewAddOnsPropType) => {
  const { addOns = [] } = formikValues;
  const isEditing = !!initialValues;
  const initialAddOns = initialValues?.addOns ?? [];

  addOns.map(addOn => {
    let priceWasEdited = false;
    let disableWasEdited = false;
    const isNewAddOn = !initialAddOns.some(initialAddOn => initialAddOn.id === addOn.id);

    if (!isNewAddOn) {
      const initialAddOn = initialAddOns.find(initialAddOn => initialAddOn.id === addOn.id);
      priceWasEdited = initialAddOn.price !== +addOn.price;
      disableWasEdited = initialAddOn.disabled !== addOn.disabled;
    }

    addOn.toggleLabel = addOn.disabled ? 'disabled' : 'enabled';
    addOn.highlight = (isNewAddOn || priceWasEdited || disableWasEdited) && isEditing;
  });

  return (
    <EventCard title="Add Ons" testId="review-addons">
      <div className="info-row">
        {addOns.map(addOn => (
          <div className="info-item" key={addOn.id}>
            <h3 className="capitalize">{addOn.name}</h3>
            <div className={`info ${addOn.highlight ? 'highlighted' : ''}`}>{`$${addOn.price} / ${addOn.unitName} / ${addOn.toggleLabel}`}</div>
          </div>
        ))}
      </div>
    </EventCard>
  );
};

export default ReviewAddOns;
