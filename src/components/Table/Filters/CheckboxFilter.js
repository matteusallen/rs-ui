import React from 'react';
import styled from 'styled-components';
import { Checkbox } from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';

// eslint-disable-next-line
const CheckboxFilterBase = ({ field, form, ...props }) => {
  return <FormControlLabel control={<Checkbox classes={{ checked: 'state-checked' }} {...field} />} {...props} />;
};

const CheckboxFilter = styled(CheckboxFilterBase)`
  &.MuiFormControlLabel-root {
    display: flex;

    .MuiCheckbox-root {
      color: #8395a7;
      padding: 4px 9px;
    }

    .state-checked {
      color: #2875c3;
    }

    .MuiTypography-root {
      font-size: 15px;
      padding-top: 2px;
    }
  }
`;

export default CheckboxFilter;
