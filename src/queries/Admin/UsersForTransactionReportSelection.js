import gql from 'graphql-tag';

export const USERS_FOR_TRANSACTION_REPORT_SELECTION = gql`
  query UsersForTransactionReportSelection($filterBy: UserFilterInput) {
    venue {
      users(filterBy: $filterBy) {
        id
        email
        fullName
      }
    }
  }
`;
