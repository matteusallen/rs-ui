import React from 'react';
import { withRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { compose } from 'recompose';

import { withUpdateOrder } from '../UpdateOrder';
import { clearConsoleNoise, renderWithApollo } from '../../lib/testing-tools';
import UPDATE_ORDER_MOCK from '../__mocks__/UPDATE_ORDER_MOCK';

clearConsoleNoise();

describe('UpdateOrder', () => {
  function Component({ updateOrder }) {
    const action = () =>
      updateOrder({
        orderId: '34',
        orderItems: [
          {
            xProductId: '226',
            xRefTypeId: 1,
            quantity: 2,
            assignments: [3, 4]
          }
        ]
      });
    return (
      <div role="button" tabIndex={0} onClick={action} onKeyPress={action}>
        click here
      </div>
    );
  }
  const ComponentController = compose(withRouter, withUpdateOrder)(Component);

  test('updateOrder calls showSnackbar', async () => {
    const showSnackbar = jest.fn();
    const { getByText } = renderWithApollo(<ComponentController showSnackbar={showSnackbar} />, UPDATE_ORDER_MOCK);
    expect(() => userEvent.click(getByText('click here'))).not.toThrowError();
  });
});
