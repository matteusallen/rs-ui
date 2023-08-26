//@flow
import gql from 'graphql-tag';

import type { OrderType } from '../../mutations/OrderCheckout';
import type { EventType } from '../Renter/EventForOrderCreate';

export type EventReportReturnType = {|
  event: EventReportEventType
|};

export type EventReportEventType = {|
  ...EventType,
  orders: OrderType[]
|};

export const EVENT_REPORT = gql`
  query EventReport($id: ID) {
    event(id: $id) {
      id
      name
      startDate
      endDate
      orders {
        id
        fee
        total
        orderItems {
          id
          price
          quantity
          addOnProduct {
            id
            price
            addOn {
              id
              name
            }
          }
          reservation {
            id
            status {
              id
              name
            }
            startDate
            endDate
            stallProduct {
              id
              nightly
              startDate
              endDate
              name
              description
              price
            }
            rvProduct {
              id
              startDate
              endDate
              nightly
              price
              name
              description
            }
          }
        }
      }
      stallProducts {
        id
        name
        price
        nightly
      }
      rvProducts {
        id
        name
        nightly
        price
        rvLot {
          id
          name
        }
      }
      addOnProducts {
        id
        price
        addOn {
          description
          id
          name
          unitName
        }
      }
    }
  }
`;
