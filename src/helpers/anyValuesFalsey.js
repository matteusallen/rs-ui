export const anyValuesFalsey = obj => {
  return Object.keys(obj).some(key => !obj[key]);
};
