export const formatPhoneNumber = phone => {
  if (!phone) return undefined;
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  const formattedPhone = '(' + match[1] + ') ' + match[2] + '-' + match[3];
  return formattedPhone;
};
