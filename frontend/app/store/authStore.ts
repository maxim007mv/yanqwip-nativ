import { create } from 'zustand';
import { User, AuthTokens } from '@/lib/types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'auth_tokens';

// Кроссплатформенное хранилище
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  setTokens: (tokens: AuthTokens | null) => Promise<void>;
  login: (user: User, tokens: AuthTokens) => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
  isGuest: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),

  setTokens: async (tokens) => {
    if (tokens) {
      await storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    } else {
      await storage.deleteItem(TOKEN_KEY);
    }
    set({ tokens });
  },

  login: async (user, tokens) => {
    await storage.setItem(TOKEN_KEY, JSON.stringify(tokens));
    set({ 
      user, 
      tokens, 
      isAuthenticated: true,
      isGuest: false,
      isLoading: false 
    });
  },

  loginAsGuest: async () => {
    // Для гостевого доступа создаем фиктивного пользователя
    const guestUser: User = {
      id: 'guest',
      email: 'guest@example.com',
      name: 'Гость',
      createdAt: new Date().toISOString(),
    };
    
    set({ 
      user: guestUser, 
      tokens: null, 
      isAuthenticated: true,
      isGuest: true,
      isLoading: false 
    });
  },

  logout: async () => {
    await storage.deleteItem(TOKEN_KEY);
    set({ 
      user: null, 
      tokens: null, 
      isAuthenticated: false,
      isGuest: false,
      isLoading: false 
    });
  },

  loadStoredAuth: async () => {
    try {
      const storedTokens = await storage.getItem(TOKEN_KEY);
      if (storedTokens) {
        const tokens: AuthTokens = JSON.parse(storedTokens);
        set({ tokens, isLoading: false });
        // User будет загружен через API после инициализации
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      set({ isLoading: false });
    }
  },
}));
