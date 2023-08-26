export const numericField = (e, setField) => {
  e.target.value = e.target.value.replace(/[^0-9\\.]+/g, '');
  setField(e);
};
