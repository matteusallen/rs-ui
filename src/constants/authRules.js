export const ADMIN_HOME_ACCESS = 'admin_home:access';
export const ADMIN_FULL_ACCESS = 'admin_full:access';
export const IS_ADMIN = 'is_admin';
export const IS_SUPER_ADMIN = 'is_super_admin';
export const OPS_HOME_ACCESS = 'ops_home:access';
export const RENTER_HOME_ACCESS = 'renter_home:access';
export const ADMIN_EXPORT_OTHER_USERS = 'admin_export:other_users';
export const ADMIN_EXPORT_ACCOUNTING_REPORT = 'admin_export:accounting_report';
export const IS_GROUP_LEADER = 'is_group_leader';

const authRules = {
  1: {
    static: [OPS_HOME_ACCESS, ADMIN_EXPORT_ACCOUNTING_REPORT, ADMIN_EXPORT_OTHER_USERS, ADMIN_FULL_ACCESS, ADMIN_HOME_ACCESS, IS_ADMIN]
  },
  2: {
    static: [OPS_HOME_ACCESS]
  },
  3: {
    static: [RENTER_HOME_ACCESS]
  },
  4: {
    static: [ADMIN_HOME_ACCESS, IS_ADMIN, OPS_HOME_ACCESS]
  },
  5: {
    static: [IS_SUPER_ADMIN]
  },
  6: {
    static: [IS_GROUP_LEADER]
  }
};

export default authRules;
