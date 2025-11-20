// src/utils/axiosInstance.ts
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getTokens, setTokens, clearTokens } from "./auth";

const baseURL = "https://durama-project.onrender.com";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Ajouter automatiquement access token aux requêtes
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { access } = getTokens();
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh } = getTokens();

      if (!refresh) {
        console.warn("Aucun refresh token trouvé.");
        return Promise.reject(error);
      }

      try {
        const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh });
        const newAccess = (res.data as any).access;

        setTokens(newAccess, refresh);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token expiré, déconnexion…");
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
