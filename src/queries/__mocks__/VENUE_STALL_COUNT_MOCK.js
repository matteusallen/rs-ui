import { VENUE_STALL_COUNT } from '../Ops/StallsForOpsTable';

export default [
  {
    request: {
      query: VENUE_STALL_COUNT
    },
    result: {
      data: {
        venue: {
          buildings: [
            {
              id: '1',
              name: 'Barn 10',
              stallCount: {
                all: 1,
                events: null
              },
              stalls: [
                {
                  id: '130',
                  name: '250',
                  isActive: true
                }
              ]
            }
          ]
        }
      },
      extensions: {}
    }
  }
];
