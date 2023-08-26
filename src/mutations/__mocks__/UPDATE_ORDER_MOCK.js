import { UPDATE_ORDER } from '../UpdateOrder';

export default [
  {
    request: {
      query: UPDATE_ORDER,
      variables: {
        input: {
          orderId: '34',
          orderItems: [
            {
              xProductId: '226',
              xRefTypeId: 1,
              quantity: 2,
              assignments: [3, 4]
            }
          ]
        }
      }
    },
    result: {
      data: {
        updateOrder: {
          error: null,
          success: true,
          order: {
            id: '34',
            orderItems: [
              {
                reservation: {
                  id: '226',
                  stalls: [
                    {
                      id: 3
                    },
                    {
                      id: 4
                    }
                  ]
                }
              }
            ]
          }
        }
      }
    }
  }
];
