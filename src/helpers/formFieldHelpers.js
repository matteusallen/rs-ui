// @flow
import type { ProductFormType } from '../types/FormTypes';

const hasSelectedRvProduct = (formValues: ProductFormType): boolean => {
  if (!formValues || !formValues.rv_spot) return false;
  return Boolean(!!formValues.rv_spot.quantity && !!formValues.rv_spot.start && !!formValues.rv_spot.end && !!formValues.rvProductId);
};

const hasSelectedStallProduct = (formValues: ProductFormType): boolean => {
  if (!formValues || !formValues.stalls) return false;
  return Boolean(!!formValues.stalls.quantity && !!formValues.stalls.start && !!formValues.stalls.end && !!formValues.stallProductId);
};

const hasSelectedAddOnProduct = (formValues: ProductFormType): boolean => {
  if (!formValues || !formValues.addOns) return false;
  const addOnValues = Object.values(formValues.addOns);
  const hasTruthyAddOnValues = addOnValues.some(addOnValue => !!addOnValue);
  return Boolean(hasTruthyAddOnValues);
};

/**
 * Returns true if user has selected at least one of stall, rv or add for purchase and has selected a rate type for each stall and rv IF they have selected them
 * @param formValues - Object from Formik with the form values
 */
const hasProductsSelectedForPurchase = (formValues: ProductFormType): boolean => {
  if (!formValues) return false;

  const addOnCount = formValues.addOns && Object.values(formValues.addOns).length;
  const stallCount = formValues.stalls?.quantity;
  const rvCount = formValues.rv_spot?.quantity;
  const hasProduct = addOnCount || stallCount || rvCount;

  return Boolean(
    hasProduct &&
      (!rvCount || hasSelectedRvProduct(formValues)) &&
      (!stallCount || hasSelectedStallProduct(formValues)) &&
      (!addOnCount || hasSelectedAddOnProduct(formValues))
  );
};

export { hasProductsSelectedForPurchase, hasSelectedAddOnProduct, hasSelectedRvProduct, hasSelectedStallProduct };
