import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';

import colors from '../../styles/Colors';

const styles = {
  root: {
    cursor: 'text',
    width: '100%',
    backgroundColor: `${colors.background.primary}`,
    color: `${colors.text.primary}`,
    fontFamily: 'IBMPlexSans-Regular !important',
    fontSize: '15px',
    height: '100%',
    lineHeight: '25px',
    letterSpacing: '0',
    paddingTop: '22px',
    paddingLeft: '12px'
  }
};

const stripeStyles = {
  placeholder: '',
  style: {
    base: {
      color: `${colors.text.primary}`,
      fontFamily: 'IBM Plex Sans',
      fontSize: '15px',
      lineHeight: '25px',
      letterSpacing: '0'
    }
  }
};

function StripeInput(props) {
  const { classes: c, component: Component, onFocus, onBlur, onChange, inputRef } = props;

  const [mountNode, setMountNode] = useState(null);

  React.useImperativeHandle(
    inputRef,
    () => ({
      focus: () => mountNode.focus()
    }),
    [mountNode]
  );
  return <Component onReady={setMountNode} className={c.root} onFocus={onFocus} onBlur={onBlur} onChange={onChange} options={stripeStyles} />;
}

export default withStyles(styles, { withTheme: true })(StripeInput);
