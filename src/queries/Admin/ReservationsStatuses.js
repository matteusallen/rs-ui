import gql from 'graphql-tag';

export const RESERVATION_STATUSES = gql`
  {
    reservationStatuses {
      id
      name
    }
  }
`;
