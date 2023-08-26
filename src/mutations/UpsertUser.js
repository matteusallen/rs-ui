//@flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';

import { ApolloError } from 'apollo-client';

import { FILTERED_VENUE_RENTERS } from '../queries/Admin/FilteredVenueRenters';
import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';

const UPSERT_USER = gql`
  mutation UpsertUser($input: UserUpsertInput) {
    upsertUser(input: $input) {
      userId
      error
    }
  }
`;

const withUpsertUser = graphql(UPSERT_USER, {
  props: ({ mutate }) => ({
    upsertUser: input => {
      mutate({
        variables: { input },
        refetchQueries: [
          // @TODO orderBy should not be static
          {
            query: FILTERED_VENUE_RENTERS,
            variables: { orderBy: 'firstName_ASC' }
          }
        ]
      });
    }
  }),
  options: props => ({
    onCompleted: result => {
      const { user } = props;
      const { upsertUser = {} } = result;
      const isEditOperation = user.editable || false;

      if (upsertUser.error) {
        reportGraphqlError(
          props.showSnackbar,
          isEditOperation ? 'There was an error editing the user' : 'There was an error creating the user',
          result.upsertUser.error
        );
        return result.upsertUser.error;
      }
      props.onClose();
      props.showSnackbar(isEditOperation ? 'User successfully updated' : 'User successfully created');
      return result.upsertUser;
    },
    onError: async (error: ApolloError) => {
      reportGraphqlError(props.showSnackbar, 'There was an error updating the user', error);
    }
  })
});

// prettier-ignore
export default compose(withSnackbarContextActions,withUpsertUser)
