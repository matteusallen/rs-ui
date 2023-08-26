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
      assignmentConfirmed: string,
      endDate: string,
      id: string,
      rvProduct: { id: string },
      stallProduct: { id: string },
      startDate: string,
      status: { id: string, name: string }
    },
    success: boolean
  }
|};

const UPDATE_RESERVATION_STATUS = gql`
  mutation UpdateReservationStatus($input: UpdateReservationStatusInput!) {
    updateReservationStatus(input: $input) {
      error
      success
      reservation {
        id
        status {
          id
          name
        }
        startDate
        endDate
        assignmentConfirmed
        stallProduct {
          id
        }
        rvProduct {
          id
        }
      }
    }
  }
`;

export type UpdateReservationStatusType = (input: UpdateReservationStatusInputType, variables: { id: string }) => void;

export type UpdateReservationStatusPropsType = {|
  showSnackbar: (message: string, options?: { error?: boolean }) => void
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
        const { rvProduct } = reservation;
        const product = rvProduct ? 'RV spot' : 'Stall';
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
