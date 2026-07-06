import { create } from 'zustand';

interface UserProfile {
  _id?: string;
  id?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  account_status?: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  account_reason?: string;
  role?: string;
}

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  setToken: (token: string) => void;
  setUser: (user: UserProfile) => void;
  clearToken: () => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  clearToken: () => set({ token: null }),
  clearAuth: () => set({ token: null, user: null }),
}));
