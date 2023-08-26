import React from 'react';
import { Checkbox, withStyles } from '@material-ui/core';

import colors from '../../../styles/Colors';

const CheckboxThemed = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    '&$checked': {
      color: colors.secondary
    }
  },
  checked: {}
})(props => <Checkbox color="default" {...props} />);

export default CheckboxThemed;
