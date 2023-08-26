import React from 'react';
import userEvent from '@testing-library/user-event';

import DeleteEvent from '../DeleteEvent';
import { clearConsoleNoise, renderWithApollo } from '../../lib/testing-tools';
import DELETE_EVENT_MUTATION_MOCK from '../__mocks__/DELETE_EVENT_MUTATION_MOCK';

clearConsoleNoise();

describe('DeleteEvent', () => {
  function Component({ deleteEvent }) {
    return (
      <div role="button" tabIndex={0} onClick={() => deleteEvent({ id: 1 })} onKeyPress={() => deleteEvent({ id: 1 })}>
        click here
      </div>
    );
  }

  test('smoke test', () => {
    const ComponentController = DeleteEvent(Component);
    const { getByText } = renderWithApollo(<ComponentController />, DELETE_EVENT_MUTATION_MOCK);
    expect(getByText('click here')).toBeTruthy();
  });
  test('no apollo errors', () => {
    const ComponentController = DeleteEvent(Component);
    const { getByText } = renderWithApollo(<ComponentController />, DELETE_EVENT_MUTATION_MOCK);
    // if this fails it means the mock is not correct
    // @see DELETE_EVENT_MUTATION
    expect(() => userEvent.click(getByText('click here'))).not.toThrowError();
  });
  test('deleteEvent should have been called', () => {
    const mock = jest.fn();
    const { getByText } = renderWithApollo(<Component deleteEvent={mock} />, DELETE_EVENT_MUTATION_MOCK);
    expect(() => userEvent.click(getByText('click here'))).not.toThrowError();
    expect(mock.mock.calls.length).toBe(1);
  });
});
