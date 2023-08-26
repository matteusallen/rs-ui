/* global STRIPE_PUBLIC_KEY */
import React, { Component } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import isTestEnv from '../lib/testing-tools/isTestEnv';

const stripePromise = loadStripe(isTestEnv() ? 1 : STRIPE_PUBLIC_KEY);

const withStripe = ComposedComponent => {
  // eslint-disable-next-line react/prefer-stateless-function
  return class WithStripe extends Component {
    render() {
      const fonts = [{ cssSrc: 'https://fonts.googleapis.com/css?family=IBM+Plex+Sans' }];
      return (
        <Elements stripe={stripePromise} options={{ fonts }}>
          <ComposedComponent {...this.props} />
        </Elements>
      );
    }
  };
};

export default withStripe;
