//@flow
export const getRefundableAmount = (payments: { amount: number, success: boolean }[] = []): number =>
  payments.reduce((val, item) => {
    if (!item.success) return val;
    return item.amount * 100 + val;
  }, 0) / 100;
