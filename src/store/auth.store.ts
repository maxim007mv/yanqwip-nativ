import { create } from 'zustand';
import type { User } from '../types/api';
import {
  clearSecureSession,
  loadAccessToken,
  loadRefreshToken,
  loadUserSnapshot,
  saveAccessToken,
  saveRefreshToken,
  saveUserSnapshot,
} from '../utils/storage';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  isGuest: boolean;
  hydrate: () => Promise<void>;
  setTokens: (access: string | null, refresh?: string | null) => Promise<void>;
  setUser: (user: User | null) => Promise<void>;
  setGuest: (guest: boolean) => void;
  clear: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isHydrated: false,
  isGuest: false,

  hydrate: async () => {
    const [access, refresh, user] = await Promise.all([
      loadAccessToken(),
      loadRefreshToken(),
      loadUserSnapshot<User>(),
    ]);
    set({
      accessToken: access ?? null,
      refreshToken: refresh ?? null,
      user: user ?? null,
      isHydrated: true,
    });
  },

  setTokens: async (access, refresh) => {
    const nextAccess = access ?? null;
    const nextRefresh = refresh ?? get().refreshToken ?? null;
    await Promise.all([
      saveAccessToken(nextAccess),
      saveRefreshToken(nextRefresh),
    ]);
    set({ accessToken: nextAccess, refreshToken: nextRefresh });
  },

  setUser: async (user) => {
    if (user) {
      await saveUserSnapshot(user);
    } else {
      await saveUserSnapshot(null);
    }
    set({ user, isGuest: false });
  },

  setGuest: (guest) => {
    set({ isGuest: guest });
  },

  clear: async () => {
    await clearSecureSession();
    set({ user: null, accessToken: null, refreshToken: null, isGuest: false });
  },
}));
