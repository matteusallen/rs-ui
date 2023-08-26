import gql from 'graphql-tag';

export const RV_SOLD_OUT_STATUS = gql`
  query RvSoldOutStatus($id: ID) {
    event(id: $id) {
      id
      rvSoldOut
    }
  }
`;
