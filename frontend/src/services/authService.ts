// src/services/authService.ts
import { api } from "../lib/api";
import { setAuthToken, clearAuthToken } from "../utils/authCookie";

export const register = (userData: { email: string; password: string }) =>
  api.post("/auth/register", userData);

export const login = async (userData: { email: string; password: string }) => {
  const { data } = await api.post("/auth/login", userData);
  // exemplo: backend responde { token, user? }
  if (data?.token) setAuthToken(data.token);
  return data;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout"); // se tiver endpoint
  } catch {
    /* ignore */
  } finally {
    clearAuthToken();
  }
};

export const forgotPassword = (emailData: { email: string }) =>
  api.post("/auth/forgot-password", emailData);

export const resetPassword = (resetData: { token: string; password: string }) =>
  api.post("/auth/reset-password", resetData);
