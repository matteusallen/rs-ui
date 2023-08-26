import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

import ProductCard from './ProductCard';

import { initialValues } from '../Create';
import AddOnStyles from './AddOnStyles';
import AddOns from './AddOns';

const AddOnsProductCard = props => {
  const { className, setAddOnsOpen } = props;
  const { setFieldValue, values } = useFormikContext();
  const { event, reservationEdit } = values;
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setAddOnsOpen(isOpen);
    if (!isOpen) {
      setFieldValue('addOns', initialValues.addOns);
    }
  }, [isOpen]);

  return (
    <ProductCard className={className} edit={reservationEdit} event={event} isOpen={isOpen} productType={'addOnProduct'} setIsOpen={setIsOpen}>
      <AddOns isOpen={isOpen} />
    </ProductCard>
  );
};

export default AddOnStyles(AddOnsProductCard);
