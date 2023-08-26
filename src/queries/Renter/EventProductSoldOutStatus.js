import gql from 'graphql-tag';

export const EVENT_SOLD_OUT_STATUS = gql`
  query EventProductSoldOutStatus($id: ID) {
    event(id: $id) {
      id
      rvSoldOut
      stallSoldOut
    }
  }
`;
