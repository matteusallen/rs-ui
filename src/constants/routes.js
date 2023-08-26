export const base = '/';

const routeCodes = {
  LOGIN: `${base}login`,
  CREATE_ACCOUNT: `${base}create-account`,
  EMAIL_SENT: `${base}email-sent`,
  FORGOT_PASSWORD: `${base}forgot-password`,
  RESET_PASSWORD: `${base}reset-password`,
  CREATE_PASSWORD: `${base}create-password`,
  ABOUT: `${base}about`,
  TERMS: `${base}terms`,
  ENDUSER: `${base}end-user-agreement`,
  PRIVACY: `${base}privacy`,
  ADMIN: `${base}admin/`,
  SUPER_ADMIN: `${base}super-admin/`,
  OPS: `${base}ops/`,
  GROUP_LEADER: `${base}group-leader/`,
  ROOT: base
};

// eslint-disable-next-line
const { ADMIN, ROOT, OPS, SUPER_ADMIN, GROUP_LEADER } = routeCodes;
export const subRouteCodes = {
  RENTER: {
    CREATE_ORDER: [
      `${ROOT}reservation/:eventId/checkout`,
      `${ROOT}reservation/:eventId/rvs`,
      `${ROOT}reservation/:eventId`,
      `${ROOT}reservation/:eventId/stalls`
    ],
    CONFIRM_RESERVATION: `${ROOT}reservation/confirmation/:orderId`,
    EVENTS: `${ROOT}events`,
    RESERVATIONS: `${ROOT}reservations`,
    HELP: `${ROOT}help`,
    VIEW_RESERVATION: `${ROOT}reservation/details/:orderId`
  },
  ADMIN: {
    EVENTS: `${ADMIN}events`,
    CREATE_EVENT: `${ADMIN}events/new`,
    EDIT_EVENT: `${ADMIN}events/edit/:eventId`,
    ORDERS: `${ADMIN}orders`,
    CREATE_ORDER: `${ADMIN}order/new`,
    EDIT_ORDER: `${ADMIN}order/edit/:orderId`,
    GROUPS: `${ADMIN}groups`,
    REPORTS: `${ADMIN}reports`,
    USERS: `${ADMIN}users`,
    PUSH_DEMO: `${base}push-notifications-demo`
  },
  OPS: {
    STALLS: `${OPS}stalls`,
    RVS: `${OPS}rvs`
  },
  SUPER_ADMIN: {
    CREATE_VENUE: `${SUPER_ADMIN}venues/new`,
    MAIN: `${SUPER_ADMIN}`,
    VENUES: `${SUPER_ADMIN}venues`
  },
  GROUP_LEADER: {
    ORDERS: `${GROUP_LEADER}orders`,
    GROUPS: `${GROUP_LEADER}groups`,
    CREATE_ORDER: `${GROUP_LEADER}order/new`,
    EDIT_ORDER: `${GROUP_LEADER}order/edit/:orderId`
  }
};

export default routeCodes;
