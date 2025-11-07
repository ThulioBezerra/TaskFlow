import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

export function setAuthToken(token: string) {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7,
    sameSite: 'Lax', // para Vite local ok; em SSO/cross-site use 'None' + secure
    path: '/',
  });
}

export function getAuthToken(): string | undefined {
  return Cookies.get(TOKEN_KEY);
}

export function clearAuthToken() {
  Cookies.remove(TOKEN_KEY, { path: '/' });
}
