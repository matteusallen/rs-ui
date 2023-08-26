import React from 'react';
import { withStyles } from '@material-ui/core';
import Radio from '@material-ui/core/Radio';

import colors from '../../../styles/Colors';

const RadioThemed = withStyles({
  root: {
    color: 'rgba(0, 0, 0, 0.54)',
    opacity: 0.54,
    '&$checked': {
      color: colors.icons.blue,
      opacity: 1
    }
  },
  checked: {}
})(props => <Radio color="default" {...props} />);

export default RadioThemed;
