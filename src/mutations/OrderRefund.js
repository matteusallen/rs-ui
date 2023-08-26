//@flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { ApolloError } from 'apollo-client';

import { ORDER_FOR_EDIT } from '../queries/Admin/OrderForEdit';
import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';
import { unauthenticatedHelper } from '../helpers/unauthenticatedHelper';
import routeCodes from '../constants/routes';

export type RefundInputType = {|
  amount: number,
  cardBrand: string,
  cardPayment: boolean,
  last4: string,
  notes: string,
  orderId: number,
  ssChargeId: string
|};

const ORDER_REFUND = gql`
  mutation OrderRefund($input: [RefundInput]!) {
    refund(input: $input) {
      error
      refunds {
        id
        amount
        cardBrand
        cardPayment
        last4
        notes
        ssChargeId
        ssRefundId
        updatedAt
      }
      success
    }
  }
`;

const withOrderRefund = graphql(ORDER_REFUND, {
  props: ({ mutate }) => ({
    orderRefund: (input: [RefundInputType]) => {
      return mutate({
        variables: { input },
        refetchQueries: [
          {
            query: ORDER_FOR_EDIT,
            variables: { id: input.orderId }
          }
        ]
      });
    }
  }),
  options: props => ({
    onCompleted: async data => {
      const { refund } = data || {};
      if (refund && refund.success) {
        props.showSnackbar('Refund successfully issued');
        return;
      }
      reportGraphqlError(props.showSnackbar, 'There was a problem processing the refund');
    },
    onError: async (error: ApolloError) => {
      if (unauthenticatedHelper(error) && props.push) {
        props.showSnackbar('Session expired', { error: true });
        setTimeout(() => {
          props.push(routeCodes.LOGIN);
        }, 3000);
      }
      reportGraphqlError(props.showSnackbar, 'There was a problem processing the refund', error);
    }
  })
});

// prettier-ignore
export default compose(withSnackbarContextActions, withOrderRefund)
