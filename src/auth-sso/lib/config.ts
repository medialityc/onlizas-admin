export const MAX_COOKIES_AGE = 60 * 60 * 24 * 7;
export const COOKIE_SESSION_NAME = "session";
export const COOKIE_PERMISSIONS_NAME = "prm"; // cookie ligera de permisos (joined codes)

export const ENDPOINTS = {
  login: `https://api.zasdistributor.com/api/auth/login`,
  refresh: `https://api.zasdistributor.com/api/auth/refresh`,
  me: `https://api.zasdistributor.com/api/users/me`,
};
