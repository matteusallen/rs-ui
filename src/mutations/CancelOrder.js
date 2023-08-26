// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { ApolloError } from 'apollo-client';

import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';

import type RefundInputType from './OrderRefund';

type CancelOrderInputType = {|
  orderId: string | number,
  refundInformation: [RefundInputType],
  refundPayment: boolean
|};

export const CANCEL_ORDER = gql`
  mutation cancelOrder($input: CancelOrderInput!) {
    cancelOrder(input: $input) {
      error
      order {
        id
        createdAt
        fee
        notes
        successor
        total
      }
      success
    }
  }
`;

export const withCancelOrder = graphql(CANCEL_ORDER, {
  props: ({ mutate }) => ({
    cancelOrder: (input: CancelOrderInputType) => mutate({ variables: { input } })
  }),
  options: props => ({
    onCompleted: async data => {
      if (data.cancelOrder && data.cancelOrder.error) {
        reportGraphqlError(props.showSnackbar, 'There was an error cancelling the order', data.cancelOrder.error);
        return;
      }
      props.showSnackbar('Order successfully cancelled');
    },
    onError: async (error: ApolloError) => {
      reportGraphqlError(props.showSnackbar, 'There was an error cancelling the order', error);
    }
  })
});

// pretter-ignore
export default compose(withRouter, withSnackbarContextActions, withCancelOrder);
