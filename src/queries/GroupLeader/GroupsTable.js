import gql from 'graphql-tag';

export const GROUP_LEADER_GROUPS = gql`
  query GetLeaderGroupGroups($groupLeaderId: String, $allowDeferred: Boolean) {
    groups: groupLeaderGroups(groupLeaderId: $groupLeaderId, allowDeferred: $allowDeferred) {
      id
      contactName
      name
    }
  }
`;

export const GROUP_LEADERS = gql`
  query GetGroupLeaders {
    groupLeaders {
      id
      firstName
      lastName
      email
      phone
    }
  }
`;
