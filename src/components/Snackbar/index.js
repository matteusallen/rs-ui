//@flow
import React, { useContext, useEffect } from 'react';
import { Snackbar, Button } from '@material-ui/core';

import { SnackbarContext } from '../../store/SnackbarContext';
import SnackbarStyles from './SnackbarStyles';

type ContextSnackbarPropsType = {|
  horizontal?: string
|};

const ContextSnackbar = (props: ContextSnackbarPropsType) => {
  const { snackbarMessage, snackbarOpen, hideSnackbar, options } = useContext(SnackbarContext);
  const Action = () => (
    <Button size="small" onClick={() => hideSnackbar()}>
      {options.action}
    </Button>
  );

  useEffect(() => {
    let id = setTimeout(() => {
      if (snackbarOpen) hideSnackbar();
    }, Number(options.duration || 6000));
    return () => {
      if (id) {
        clearTimeout(id);
      }
    };
  }, [snackbarOpen]);

  return (
    <SnackbarStyles isError={options.error} isInfo={options.info}>
      <Snackbar
        className="rolo-snackbar"
        data-testid="snackbar-instance"
        {...props}
        anchorOrigin={{
          vertical: 'top',
          horizontal: props.horizontal || 'center'
        }}
        open={snackbarOpen}
        autoHideDuration={options.duration || 6000}
        message={snackbarMessage}
        onClose={() => (options.action ? '' : hideSnackbar())}
        action={options.action && <Action />}
      />
    </SnackbarStyles>
  );
};

export default ContextSnackbar;
