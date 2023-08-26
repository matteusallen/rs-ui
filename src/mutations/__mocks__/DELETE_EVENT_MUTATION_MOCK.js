import { DELETE_EVENT } from '../DeleteEvent';

export default [
  {
    request: {
      query: DELETE_EVENT,
      variables: { input: { id: 1 } }
    },
    result: {
      data: {
        deleteEvent: {
          success: null,
          error: null
        }
      },
      extensions: {}
    }
  }
];
