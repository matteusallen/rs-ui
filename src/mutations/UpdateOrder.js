// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { ApolloError } from 'apollo-client';

import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';

export const UPDATE_ORDER = gql`
  mutation updateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      error
      success
    }
  }
`;

export const withUpdateOrder = graphql(UPDATE_ORDER, {
  props: ({ mutate }) => ({
    // TODO: Define UpdateOrderInput
    // $FlowIgnore
    updateOrder: (input: UpdateOrderInput) => mutate({ variables: { input } })
  }),
  options: props => ({
    onCompleted: async data => {
      if (data.updateOrder && data.updateOrder.error) {
        reportGraphqlError(props.showSnackbar, data.updateOrder.error, data.updateOrder.error);
        return;
      }
      // Success condition
      props.showSnackbar('Order successfully updated');
    },
    onError: async (error: ApolloError) => {
      reportGraphqlError(props.showSnackbar, 'There was an error updating the order', error);
    }
  })
});

export default compose(withRouter, withSnackbarContextActions, withUpdateOrder);
