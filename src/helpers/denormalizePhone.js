//@flow

// eslint-disable-next-line
export default (val: any) => {
  const str = String(val || '');
  return str
    .replace(' ', '')
    .replace('-', '')
    .replace('(', '')
    .replace(')', '');
};
