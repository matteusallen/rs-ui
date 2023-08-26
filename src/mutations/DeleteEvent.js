// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { subRouteCodes as SUB_ROUTES } from '../constants/routes';

export type DeleteEventType = {|
  id: string | number
|};

export const DELETE_EVENT = gql`
  mutation DeleteEvent($input: EventDeleteType) {
    deleteEvent(input: $input) {
      success
      error
    }
  }
`;

export const withDeleteEvent = graphql(DELETE_EVENT, {
  props: ({ mutate }) => ({
    deleteEvent: (input: DeleteEventType) => mutate({ variables: { input } })
  }),
  options: props => ({
    onCompleted: async data => {
      if (!data.deleteEvent.error) {
        return props.history.push(SUB_ROUTES.ADMIN.EVENTS);
      }
    }
  })
});

// eslint-disable-next-line prettier/prettier
export default compose(withRouter, withDeleteEvent);
