// @flow
import React from 'react';
import styled from 'styled-components';

import Modal from '../../../../components/Modal';
import Button from '../../../../components/Button';
import OrderRefund from '../../../../mutations/OrderRefund';
import type { PaymentType } from './RefundModal';

export const RefundConfirmationModalBase = ({
  isOpen,
  className = '',
  close,
  handleRefund,
  payment
}: {
  className?: string,
  close: () => void,
  handleRefund: () => void,
  isOpen: boolean,
  payment?: PaymentType
}) => {
  return (
    <Modal heading={'CASH OR CHECK REFUND'} open={isOpen} className={`${className}__refund-confirmation-modal`}>
      {!payment ? (
        'loading...'
      ) : (
        <>
          <div className={'content'}>
            Please confirm that you have paid this renter their refund of <strong>${(-1 * payment.amount).toFixed(2)} by cash or check</strong>
          </div>
          <div className={'actions'}>
            <Button data-testid="refund-cancel" secondary variant="contained" size="large" onClick={() => close()}>
              CANCEL
            </Button>
            <Button data-testid="refund-confirm" primary variant="contained" size="large" type="submit" onClick={() => handleRefund()} disabled={!payment}>
              CONFIRM REFUND PAID
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

const RefundModal = styled(RefundConfirmationModalBase)`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-around;
  background: red;

  &__refund-confirmation-modal {
    & {
      div[class^='MuiCard-root'],
      div[class*='MuiCard-root'] {
        max-width: 420px;
        font-size: 16px;
      }
      .MuiPaper-root.MuiCard-root {
        h4 {
          margin-top: 0;
          margin-bottom: 5px;
        }
      }
    }
    .actions {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      padding-top: 20px;
      button[type='button'] {
        width: 120px;
      }
      button[type='submit'] {
        width: 225px;
      }
    }
    .content {
      padding-top: 15px;
    }
  }
`;

export default OrderRefund(RefundModal);
