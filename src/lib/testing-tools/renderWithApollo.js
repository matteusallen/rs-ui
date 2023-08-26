import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/react-testing';
import { BrowserRouter } from 'react-router-dom';

import cloneComponent from './cloneComponent';
import { SnackbarProvider } from '../../store/SnackbarContext';

export default function renderWithApollo(component, mocks = []) {
  return {
    ...render(
      <BrowserRouter>
        <MockedProvider mocks={mocks} addTypename={false}>
          <SnackbarProvider>
            <div className={'tests-root'}>{cloneComponent(component)}</div>
          </SnackbarProvider>
        </MockedProvider>
      </BrowserRouter>
    )
  };
}
