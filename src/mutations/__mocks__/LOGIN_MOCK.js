import { LOGIN } from '../Login';

export default [
  {
    request: {
      query: LOGIN,
      variables: { input: { email: 'dev@mail.com', password: '123' } }
    },
    result: {
      data: {
        logIn: {
          user: {
            id: '4',
            email: 'dev@mail.com',
            role: {
              id: 1,
              name: 'venue admin'
            }
          },
          auth: {
            token:
              'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODcwNjQ4NDAsImlhdCI6MTU4NzA2Mzk0MCwic3ViIjo0fQ.86bjunbETzudfHRKnUukOTGBOmrO56Vkp5he_LFztvc',
            error: null,
            success: true
          }
        }
      },
      extensions: {}
    }
  }
];
