// src/utils/auth.ts
export const ACCESS_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";

export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
};

export const getTokens = () => ({
  access: localStorage.getItem(ACCESS_KEY),
  refresh: localStorage.getItem(REFRESH_KEY),
});

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
};

export const isLoggedIn = () => Boolean(localStorage.getItem(ACCESS_KEY));
