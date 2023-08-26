import { FORGOT_PASSWORD } from '../ForgotPassword';

const FORGOT_PASSWORD_MOCK_SUCCESS = [
  {
    request: {
      query: FORGOT_PASSWORD,
      variables: { input: { email: 'dev@mail.com' } }
    },
    result: {
      data: {
        forgotPassword: {
          success: true,
          error: false
        }
      },
      extensions: {}
    }
  }
];

const FORGOT_PASSWORD_MOCK_FAILURE = [
  {
    request: {
      query: FORGOT_PASSWORD,
      variables: { input: { email: 'dev@mail.com' } }
    },
    result: {
      data: {
        forgotPassword: {
          success: false,
          error: '123'
        }
      },
      extensions: {}
    }
  }
];

export { FORGOT_PASSWORD_MOCK_SUCCESS, FORGOT_PASSWORD_MOCK_FAILURE };
