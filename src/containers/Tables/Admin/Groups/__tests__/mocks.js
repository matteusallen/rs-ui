import { GROUPS_TABLE } from '../../../../../queries/Admin/GroupsTable';

const mocks = [
  {
    request: {
      query: GROUPS_TABLE
    },
    result: {
      data: {
        groups: [{ id: 1, name: 'Mocked Group 1', contactName: 'Helen Robertson' }]
      }
    }
  }
];

export default mocks;
