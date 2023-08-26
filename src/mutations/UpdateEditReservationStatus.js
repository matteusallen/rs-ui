// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { ApolloError } from 'apollo-client';
import { capitalize } from '@material-ui/core';
import { compose } from 'recompose';

import { reportGraphqlError } from '../helpers/graphqlResponseUtil';
import { withSnackbarContextActions } from '../store/SnackbarContext';

export type UpdateReservationStatusInputType = {|
  orderItemId: string,
  statusId: string
|};

export type UpdateReservationStatusReturnType = {|
  updateReservationStatus: {
    error?: string,
    reservation: {
      status: { name: string }
    },
    success: boolean
  }
|};

const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateReservationStatus($input: UpdateReservationStatusInput!) {
    updateReservationStatus(input: $input) {
      error
      reservation {
        status {
          name
        }
      }
      success
    }
  }
`;

export type UpdateReservationStatusType = (input: UpdateReservationStatusInputType, variables: { id: string }) => void;

export type UpdateReservationStatusPropsType = {|
  showSnackbar: (message: string, options?: { error?: boolean }) => void,
  productType: string
|};

const withUpdateReservationStatus = graphql(UPDATE_RESERVATION_STATUS, {
  props: ({ mutate }) => ({
    updateReservationStatus: (input: UpdateReservationStatusInputType) => {
      mutate({
        variables: { input }
      });
    }
  }),
  options: (props: UpdateReservationStatusPropsType) => ({
    onCompleted: async ({ updateReservationStatus }: UpdateReservationStatusReturnType) => {
      if (updateReservationStatus.success) {
        const { reservation = {} } = updateReservationStatus;
        const product = props.productType === 'rvProduct' ? 'RV spot' : 'Stall';
        props.showSnackbar(` ${product} reservation status updated to ${capitalize((reservation.status && reservation.status.name) || '')}`);
      } else {
        props.showSnackbar('Reservation update failed', { error: true });
      }
    },
    onError: async (error: ApolloError) => {
      reportGraphqlError(props.showSnackbar, 'Reservation update failed', error);
    }
  })
});

// $FlowIgnore
export default (Component: React$Element) => compose(withSnackbarContextActions, withUpdateReservationStatus)(Component);
