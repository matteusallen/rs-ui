import gql from 'graphql-tag';

export const EVENTS_BY_GROUP_ID = gql`
  query getEventsByGroupId($groupId: Int) {
    groupEvents(groupId: $groupId) {
      id
      name
      startDate
      endDate
    }
  }
`;
