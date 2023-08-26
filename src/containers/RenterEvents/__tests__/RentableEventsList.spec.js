import React from 'react';

import RentableEventsList from '../RentableEventsList';
import renderWithStyle from '../../../lib/testing-tools/renderWithStyle';

jest.mock('react-dates/initialize');
jest.mock('react-dates/lib/css/_datepicker.css');

describe('RentableEventsList', () => {
  test('smoke test', () => {
    const { container } = renderWithStyle(<RentableEventsList />);
    expect(container).toBeTruthy();
  });
});
