//@flow

const isMaximumAllowedExceeded = (value: string | number, productName: string): boolean => {
  if (!value) return false;
  return Boolean(
    value &&
      Number(value) >
        (productName === 'rvProduct' || productName === 'rvs' ? Number(process.env.REACT_APP_MAX_RVS) || 50 : Number(process.env.REACT_APP_MAX_STALLS) || 50)
  );
};

const isMaximumRvsAllowedExceeded = (value: string | number): boolean => {
  return isMaximumAllowedExceeded(value, 'rvProduct');
};

const isMaximumStallsAllowedExceeded = (value: string | number): boolean => {
  return isMaximumAllowedExceeded(value, 'stalls');
};

const isMaximumAddOnAllowedExceeded = (value: string | number): boolean => {
  return Boolean(value && Number(value) > (Number(process.env.REACT_APP_MAX_ADDONS) || 150));
};

// eslint-disable-next-line flowtype/no-weak-types
const hasProductQuantityError = (isRv: boolean, errors?: Object): boolean => {
  if (errors) {
    return (isRv && !!errors.rv_spot && !!errors.rv_spot.quantity) || (!isRv && !!errors.stalls && !!errors.stalls.quantity);
  }
  return false;
};

export { hasProductQuantityError, isMaximumAllowedExceeded, isMaximumRvsAllowedExceeded, isMaximumStallsAllowedExceeded, isMaximumAddOnAllowedExceeded };
