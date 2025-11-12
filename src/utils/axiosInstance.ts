// src/utils/axiosInstance.ts
import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getTokens, setTokens, clearTokens } from "./auth";

const baseURL = "http://127.0.0.1:8004";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Intercepteur de requête : ajout du token si présent
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

// 🧩 Intercepteur de réponse
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // Si non autorisé (401) et que la requête n’a pas déjà été retentée
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const { refresh } = getTokens();

      // Aucun refresh token → probablement visiteur non connecté
      if (!refresh) {
        console.warn("Visiteur non connecté - accès refusé à une route protégée.");
        // ❌ On ne redirige pas, on laisse juste la requête échouer
        return Promise.reject(error);
      }

      // Tentative de rafraîchir le token
      try {
        const res = await axios.post(`${baseURL}/api/token/refresh/`, { refresh });
        const newAccess = (res.data as any).access;

        setTokens(newAccess, refresh);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.warn("Refresh token invalide - déconnexion...");
        clearTokens();
        // Rediriger uniquement si on était sur une page nécessitant connexion
        if (window.location.pathname.includes("/profil") || window.location.pathname.includes("/panier")) {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
