import {
  decodeAccessToken,
  getTokenUser,
  isTokenExpired,
} from "../../../lib/jwt.js";

const ACCESS_TOKEN_KEY = "accessToken";
const AUTH_EVENT_NAME = "auth:change";

const emitAuthChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT_NAME));
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const setAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  emitAuthChange();
};

export const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  emitAuthChange();
};

export const getAuthSession = () => {
  const token = getAccessToken();

  if (!token || isTokenExpired(token)) {
    return {
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  const user = getTokenUser(token);

  return {
    token,
    user,
    isAuthenticated: Boolean(token && user),
    isAdmin: Boolean(user?.isAdmin),
  };
};

export const getDecodedToken = (token = getAccessToken()) =>
  decodeAccessToken(token);

export const AUTH_CHANGE_EVENT = AUTH_EVENT_NAME;
