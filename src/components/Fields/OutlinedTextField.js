import React from 'react';
import styled from 'styled-components';
import { TextField } from '@material-ui/core';

import { paragraphReg } from '../../styles/Typography';

function OutlinedTextField({ className, ...otherProps }) {
  return <TextField id="outlined-text-field" className={className} margin="dense" variant="outlined" {...otherProps} />;
}

export default styled(OutlinedTextField)`
  &&& {
    margin: 0 16px 0 0;
    height: 40px;
    width: 200px;
    * {
      ${paragraphReg}
      /* line-height: 1em; */
      font-size: 0.9375rem;
    }
    label {
      font-size: 0.9375rem;
    }
    label[class^='MuiInputLabel-outlined'],
    label[class*='MuiInputLabel-outlined'] {
      top: -4px;
    }
    label[class^='MuiInputLabel-outlined Mui-focused'],
    label[class*='MuiInputLabel-outlined Mui-focused'] {
      top: -8px;
    }
    label[class^='MuiInputLabel-outlined MuiFormLabel-filled'],
    label[class*='MuiInputLabel-outlined MuiFormLabel-filled'] {
      top: -8px;
    }
    label[class^='MuiInputLabel-shrink'],
    label[class*=' MuiInputLabel-shrink'] {
      transform: translate(14px, 1px) scale(0.75);
      top: -8px;
    }
    div {
      height: 100%;
      text-align: left;
    }
    div[class^='MuiSelect-selectMenu'] {
      padding-top: 0;
    }
    svg {
      top: calc(50% - 6px);
      right: 4px;
    }
  }
`;
