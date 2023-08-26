//@flow
import gql from 'graphql-tag';

import type { EventType } from '../Renter/EventForOrderCreate';
import type { OrderItemType } from '../../mutations/OrderCheckout';

export type UserSavedCreditCardType = {|
  address_zip: string,
  brand: string,
  exp_month: string,
  exp_year: string,
  fingerprint: string,
  id: string,
  last4: string,
  name: string
|};

export type UserRoleType = {|
  id: string,
  name: string
|};

type OrderUserType = {|
  firstName: string,
  id: string,
  lastName: string,
  phone: string
|};

export type OrderReturnType = {|
  order: OrderType
|};

export type OrderType = {|
  canceled: string,
  createdAt: string,
  updatedAt: string,
  event: EventType,
  fee: number,
  id: string,
  notes: string,
  orderItems: OrderItemType[],
  successor: string,
  total: number,
  user: OrderUserType
|};

export const ORDER_FOR_ORDER_TABLE_DETAIL = gql`
  query OrderForOrderTableDetail($id: ID) {
    order(id: $id) {
      id
      isVisited
      notes
      canceled
      updatedAt
      isEditable
      orderItems {
        id
        quantity
        addOnProduct {
          id
          addOn {
            id
            name
            unitName
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
          rvProduct {
            id
            rvLot {
              id
              name
            }
            name
          }
          stallProduct {
            id
            name
          }
          stalls {
            id
            name
            status
            building {
              id
              name
            }
          }
          rvSpots {
            id
            name
            rvLot {
              id
              name
            }
          }
        }
      }
      user {
        firstName
        id
        lastName
        phone
      }
      event {
        id
        name
        description
      }
    }
  }
`;
