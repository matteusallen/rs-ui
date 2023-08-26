// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';
import { ApolloError } from 'apollo-client';

import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';

export const CHECKOUT_GROUP_ORDER = gql`
  mutation CheckoutGroup($input: OrderCheckoutInput) {
    checkoutGroup(input: $input) {
      success
      error
    }
  }
`;

export const withCheckoutGroupOrder = graphql(CHECKOUT_GROUP_ORDER, {
  props: ({ mutate }) => ({
    // TODO: Define UpdateOrderInput
    // $FlowIgnore
    checkoutGroupOrder: (input: OrderCheckoutInput) => mutate({ variables: { input } })
  }),
  options: props => ({
    onCompleted: async data => {
      if (data.checkoutGroup && data.checkoutGroup.error) {
        reportGraphqlError(props.showSnackbar, data.checkoutGroup.error, data.checkoutGroup.error);
        return;
      }

      props.showSnackbar('Payment successful');
    },
    onError: async (error: ApolloError) => {
      reportGraphqlError(props.showSnackbar, 'There was an error paying the order', error);
    }
  })
});

export default compose(withRouter, withSnackbarContextActions, withCheckoutGroupOrder);
