// src/store/authStore.ts
import { create } from 'zustand';
import { getAuthToken, clearAuthToken } from '../utils/authCookie';

type AuthState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  hydrate: () => void; // ler cookie ao iniciar
};

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: !!getAuthToken(),
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    clearAuthToken();
    set({ isAuthenticated: false });
  },
  hydrate: () => set({ isAuthenticated: !!getAuthToken() }),
}));

export default useAuthStore;
