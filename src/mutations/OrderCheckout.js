// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { compose } from 'recompose';
import { withRouter } from 'react-router';

import { withSnackbarContextActions } from '../store/SnackbarContext';
import { reportGraphqlError } from '../helpers/graphqlResponseUtil';

import { withUserContext } from '../store/UserContext';
import type { AddOnProductType, EventType, RVProductType, RVSpotType, StallProductType } from '../queries/Renter/EventForOrderCreate';
import { IS_ADMIN, IS_GROUP_LEADER } from '../constants/authRules';
import { check } from '../components/Can';
import { subRouteCodes as SUB_ROUTES } from '../constants/routes';
import type { UserType } from '../pages/Admin/Users';
import type { ReservationPropsType } from '../containers/Order/Renter/Create';
import type { PaymentType } from '../containers/Order/Admin/Edit/RefundModal';

type StallType = {|
  id: string,
  name: string
|};

type QuestionAnswerType = {|
  id: string[]
|};

export type ReservationType = {|
  assignmentConfirmed: string,
  endDate: string,
  id: number,
  rvProduct: RVProductType | null,
  rvSpots: RVSpotType[],
  stallProduct: StallProductType | null,
  stalls: StallType[],
  startDate: string
|};

export type OrderItemType = {|
  addOnProduct?: AddOnProductType,
  id: number,
  price: number,
  quantity: number,
  reservation?: ReservationType
|};

export type OrderType = {|
  createdAt: string,
  event: EventType,
  fee: number,
  id: string,
  notes: string,
  adminNotes: string,
  orderItems: OrderItemType[],
  payments: PaymentType[],
  reservation: {
    assignmentConfirmed: string,
    endDate: string,
    id: string,
    startDate: string
  },
  successor: string,
  total: number,
  user: UserType
|};

export type OrderCheckoutReturnType = {|
  error: string,
  order: OrderType,
  success: boolean
|};

type UserUpsertInputType = {|
  city?: string,
  email: string,
  firstName: string,
  id: string,
  lastName: string,
  phone: string,
  roleId?: string,
  state?: string,
  street?: string,
  street2?: string,
  venueId?: string,
  zip?: string
|};

export type OrderItemInputType = {|
  assignments?: number[],
  endDate?: string,
  push?: () => void,
  quantity: number,
  startDate?: string,
  statusId?: number,
  xProductId: string,
  xRefTypeId: string
|};

type OrderUpsertInputType = {|
  eventId: string,
  productQuestionAnswers: QuestionAnswerType[],
  notes: string,
  adminNotes: string,
  orderItems: OrderItemInputType[],
  successor?: string,
  userId: string
|};

type NewPaymentInputType = {|
  adminId: string,
  description: string,
  saveCard: boolean,
  selectedCard: string,
  token: string,
  useCard: boolean,
  isNonUSCard: boolean
|};

export type OrderCheckoutInputType = {|
  orderInput: OrderUpsertInputType,
  paymentInput: NewPaymentInputType,
  userInput: UserUpsertInputType,
  groupId: string | number,
  orderId: number,
  multipayment: boolean
|};

export const ORDER_CHECKOUT = gql`
  mutation OrderCheckout($input: OrderCheckoutInput) {
    checkout(input: $input) {
      success
      order {
        payments {
          last4
          cardBrand
        }
        orderItems {
          id
          price
          quantity
          addOnProduct {
            id
            price
            addOn {
              description
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
            assignmentConfirmed
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
              price
              nightly
              rvLot {
                id
                name
                description
                sewer
                water
                power
              }
              name
              description
            }
          }
        }
        createdAt
        fee
        id
        notes
        successor
        total
        user {
          id
        }
        event {
          id
          name
          startDate
          endDate
          checkInTime
          checkOutTime
          venue {
            city
            description
            id
            name
            phone
            state
            street
            street2
            timeZone
            zip
          }
          stallProducts {
            description
            endDate
            id
            name
            nightly
            price
            startDate
          }
          addOnProducts {
            id
            price
            addOn {
              id
              name
              description
              unitName
            }
          }
          rvProducts {
            id
            name
            description
            startDate
            endDate
            price
            nightly
            rvLot {
              id
              name
              description
              sewer
              water
              power
            }
          }
        }
      }
      error
    }
  }
`;

type OrderItemsGroupsType = {|
  addOnProduct: boolean,
  rvProduct: boolean,
  stallProduct: boolean
|};

const orderItemGroups = (orderItems: OrderItemType[] = []): OrderItemsGroupsType =>
  orderItems.reduce(
    (state, curr) => {
      if (curr.addOnProduct) {
        return {
          ...state,
          addOnProduct: true
        };
      }
      if (curr.reservation && curr.reservation.stallProduct) {
        return {
          ...state,
          stallProduct: true
        };
      }
      if (curr.reservation && curr.reservation.rvProduct) {
        return {
          ...state,
          rvProduct: true
        };
      }
      return state;
    },
    {
      addOnProduct: false,
      stallProduct: false,
      rvProduct: false
    }
  );

const successMessage = (order: OrderType): string => {
  const groups = orderItemGroups(order.orderItems);

  if (groups.rvProduct && groups.stallProduct && !groups.addOnProduct) {
    return 'Stall and RV spot reservation has been successfully created';
  }
  if (groups.rvProduct && !groups.stallProduct && !groups.addOnProduct) {
    return 'RV spot reservation has been successfully created';
  }
  if (!groups.rvProduct && groups.stallProduct && !groups.addOnProduct) {
    return 'Stall reservation has been successfully created';
  }
  if (!groups.rvProduct && !groups.stallProduct && groups.addOnProduct) {
    return 'Add on order has been successfully created';
  }
  return 'Reservation/order has been successfully created';
};

export const withOrderCheckout = graphql(ORDER_CHECKOUT, {
  props: ({ mutate }) => ({
    orderCheckout: async (input: OrderCheckoutInputType) => {
      return mutate({ variables: { input } });
    }
  }),
  options: (props: ReservationPropsType) => ({
    onCompleted: ({ checkout }: { checkout: OrderCheckoutReturnType }) => {
      if (checkout.success) {
        if (props.user.id === checkout.order.user.id) {
          props.onUpdate(props.user);
        }
        if (check(props.user.role.id, IS_ADMIN)) {
          props.history.push(SUB_ROUTES.ADMIN.ORDERS);
          props.showSnackbar(successMessage(checkout.order), {
            success: true,
            duration: 5000
          });
        } else if (check(props.user.role.id, IS_GROUP_LEADER)) {
          props.history.push(SUB_ROUTES.GROUP_LEADER.ORDERS);
          props.showSnackbar(successMessage(checkout.order), {
            success: true,
            duration: 5000
          });
        } else {
          props.history.push({
            pathname: SUB_ROUTES.RENTER.CONFIRM_RESERVATION.replace(':orderId', checkout.order.id),
            state: checkout
          });
        }
      }

      if (checkout.error) {
        reportGraphqlError(props.showSnackbar, checkout.error, checkout.error, props.user.role.name);
      }
    },
    onError: error => {
      reportGraphqlError(props.showSnackbar, `${error && typeof error == 'string' ? error : 'Order could not be created'}`, error);
    }
  })
});

export default compose(withSnackbarContextActions, withRouter, withUserContext, withOrderCheckout);
