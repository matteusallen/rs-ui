//@flow
export const Product = {
  STALL: 'stallProduct',
  RV: 'rvProduct',
  ADD_ON: 'addOnProduct'
};

export const PRODUCTS_TYPES = {
  STALLS: 'stalls',
  RVS: 'rvs',
  ADDONS: 'addOns',
  GROUPS: 'groups',
  ORDERS: 'orders'
};

export type ProductType = 'stallProduct' | 'rvProduct' | 'addOnProduct';
