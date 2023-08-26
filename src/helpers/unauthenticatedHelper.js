//@flow
export const unauthenticatedHelper = (error: { message?: string } = {}) => {
  const message = String(error.message || '');
  return message.match(/unauthenticated/i);
};
