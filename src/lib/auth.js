// @flow
import Cookies from 'universal-cookie';

type CookiesType = {|
  get: (name: string) => ?string,
  remove: (name: string, config: {}) => void,
  set: (name: string, token: string, config: {}) => void
|};

class Auth {
  cookies: CookiesType;
  constructor() {
    this.cookies = new Cookies();
  }

  // read cookies
  getToken = (): ?string => {
    return this.cookies.get('rolo-jwt', { path: '/' });
  };
  // write to cookies
  setToken = (token: string) => {
    /** @todo maxAge should be from env */
    return this.cookies.set('rolo-jwt', token, { maxAge: 100000, path: '/' });
  };

  // clear cookies
  clearToken = () => {
    return this.cookies.remove('rolo-jwt', { path: '/' });
  };
}

export default new Auth();
