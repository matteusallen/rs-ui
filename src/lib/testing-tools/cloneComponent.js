import React from 'react';

// @see https://github.com/styled-components/styled-components/issues/2159
export default function cloneComponent(component) {
  return React.cloneElement(component, {
    suppressClassNameWarning: true
  });
}
