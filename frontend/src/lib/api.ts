import axios from "axios";
import { getAuthToken, clearAuthToken } from "../utils/authCookie";
import { Badge } from "../types";

export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// opcional: deslogar automático em 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      clearAuthToken();
      // opcional: redirecionar para /login
      // window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const getMyBadges = async (): Promise<Badge[]> => {
  const response = await api.get("/users/me/badges");
  return response.data;
};
