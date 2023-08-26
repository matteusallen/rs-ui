import React from 'react';
import { render } from '@testing-library/react';

import cloneComponent from './cloneComponent';

export default function renderWithStyle(component) {
  return {
    ...render(<div className={'tests-root'}>{cloneComponent(component)}</div>)
  };
}
