//@flow
import type { PaymentType } from '../containers/Order/Admin/Edit/RefundModal';

export default (payments: PaymentType[], currentPayment: PaymentType): boolean => {
  if (currentPayment.success) {
    return false;
  }
  return !payments.some(
    p =>
      p.amount === currentPayment?.amount &&
      currentPayment.cardPayment !== p.cardPayment &&
      currentPayment.success !== p.success &&
      currentPayment.cardBrand !== p.cardBrand
  );
};
