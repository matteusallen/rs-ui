// @flow
import React, { createContext, useState, useCallback } from 'react';

export type SnackbarContextActionsType = {|
  hideSnackbar: () => void,
  showSnackbar: (message: string, options: { duration?: number, error?: boolean }) => void
|};

// $FlowIgnore
export const SnackbarContext = createContext({
  message: '',
  open: false,
  options: {},
  showSnackbar: () => {},
  hideSnackbar: () => {}
});

const { Provider, Consumer } = SnackbarContext;

export type SnackbarProviderPropsType = {|
  children: React$Node
|};

type ShowSnackbarOptionsType = {|
  duration?: number,
  error?: boolean
|};

export type ShowSnackbarType = (message: string, options?: ShowSnackbarOptionsType) => void;

const SnackbarProvider = (props: SnackbarProviderPropsType) => {
  const { children } = props;
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState({});

  const showSnackbar = (message, options = {}) => {
    if (!isOpen) {
      setMessage(message);
      setOptions(options);
      setIsOpen(true);
    }
  };

  const hideSnackbar = useCallback(() => {
    setIsOpen(false);
  });

  return (
    <Provider
      value={{
        snackbarOpen: isOpen,
        snackbarMessage: message,
        showSnackbar,
        hideSnackbar,
        options
      }}>
      {children}
    </Provider>
  );
};

//$FlowIgnore
const withSnackbarContextActions = ComposedComponent => {
  //$FlowIgnore
  const WithSnackbarContext = props => {
    return (
      <Consumer>
        {contextValues => {
          const { hideSnackbar, showSnackbar } = contextValues;
          return <ComposedComponent {...props} hideSnackbar={hideSnackbar} showSnackbar={showSnackbar} />;
        }}
      </Consumer>
    );
  };
  WithSnackbarContext.displayName = 'WithSnackbarContext';
  return WithSnackbarContext;
};

export { SnackbarProvider, withSnackbarContextActions };
