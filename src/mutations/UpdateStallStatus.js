// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { STALLS_FOR_OPS_TABLE } from '../queries/Ops/StallsForOpsTable';
import type { VariablesType } from '../containers/Tables/Ops/OperationsTable';

export type StallStatusUpdateType = {|
  id: number | string,
  status: string
|};

const UPDATE_STALL_STATUS = gql`
  mutation UpdateStallStatus($input: StallStatusUpdateInput!) {
    updateStallStatus(input: $input) {
      error
      success
      stall {
        id
        status
      }
    }
  }
`;

const withUpdateStallStatus = graphql(UPDATE_STALL_STATUS, {
  props: ({ mutate }) => ({
    updateStallStatus: (input: StallStatusUpdateType, variables: VariablesType) => {
      mutate({
        variables: { input },
        refetchQueries: [{ query: STALLS_FOR_OPS_TABLE, variables }]
      });
    }
  })
});

export default withUpdateStallStatus;
