//@flow
import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import RefundModal from '../RefundModal';
import renderWithApollo from '../../../../../lib/testing-tools/renderWithApollo';

describe('RefundModal', () => {
  const defaultProps = {
    order: {
      payments: [
        {
          amount: 100.1,
          cardBrand: 'visa',
          cardPayment: true,
          id: 1,
          last4: '1234',
          createAt: '',
          ssRefundId: 0
        }
      ]
    },
    open: true,
    onClose: () => {},
    handleSubmit: () => {}
  };
  test('smoke test', () => {
    expect(() => renderWithApollo(<RefundModal {...defaultProps} />)).not.toThrowError();
  });

  test('UI special refund', () => {
    const { getByText } = renderWithApollo(<RefundModal {...defaultProps} specialRefund />);
    expect(getByText('Refund')).toBeTruthy();
    expect(getByText('REFUND')).toBeTruthy();
    expect(getByText('GO BACK')).toBeTruthy();
  });

  test('UI default', () => {
    const { getByText } = renderWithApollo(<RefundModal {...defaultProps} />);
    expect(getByText('Refund')).toBeTruthy();
    expect(getByText('GO BACK')).toBeTruthy();
  });

  test('valid form', async () => {
    const { getAllByRole } = renderWithApollo(<RefundModal {...defaultProps} />);
    const [refund] = getAllByRole('radio');
    act(() => {
      fireEvent.click(refund);
    });
    const [, next] = getAllByRole('button');
    act(() => {
      fireEvent.click(next);
    });
    const [refundReason] = getAllByRole('textbox');
    await act(() => userEvent.type(refundReason, 'nope'));
  });

  test('invalid form', async () => {
    const { getAllByRole } = renderWithApollo(<RefundModal {...defaultProps} />);
    const [refund] = getAllByRole('radio');
    act(() => {
      fireEvent.click(refund);
    });
    const [, next] = getAllByRole('button');
    act(() => {
      fireEvent.click(next);
    });
    const [refundReason] = getAllByRole('textbox');
    expect(refundReason).toBeTruthy();
  });
});
