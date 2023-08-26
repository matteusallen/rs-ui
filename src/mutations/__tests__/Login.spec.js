import React from 'react';
import userEvent from '@testing-library/user-event';

import Login from '../Login';
import { clearConsoleNoise, renderWithApollo } from '../../lib/testing-tools';
import LOGIN_MOCK from '../__mocks__/LOGIN_MOCK';

clearConsoleNoise();

describe('Login', () => {
  function Component({ loginUser }) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={() => loginUser({ email: 'dev@mail.com', password: '123' })}
        onKeyPress={() => loginUser({ email: 'dev@mail.com', password: '123' })}>
        click here
      </div>
    );
  }

  test('smoke test', () => {
    const ComponentController = Login(Component);
    const { getByText } = renderWithApollo(<ComponentController />, LOGIN_MOCK);
    expect(getByText('click here')).toBeTruthy();
  });
  test.skip('no apollo errors', () => {
    const ComponentController = Login(Component);
    const { getByText } = renderWithApollo(<ComponentController onLogin={jest.fn()} />, LOGIN_MOCK);
    expect(() => userEvent.click(getByText('click here'))).not.toThrowError();
  });
});
