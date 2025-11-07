import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export const tokenStore = {
  get: () => Cookies.get(TOKEN_KEY) ?? '',
  set: (t: string) => Cookies.set(TOKEN_KEY, t, { sameSite: 'Lax', secure: false, expires: 7 }),
  clear: () => Cookies.remove(TOKEN_KEY),
};
