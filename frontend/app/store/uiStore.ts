import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'auto';

interface UIState {
  theme: Theme;
  isOnboarded: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  completeOnboarding: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  theme: 'dark',
  isOnboarded: false,

  setTheme: (theme) => set({ theme }),

  toggleTheme: () => {
    const current = get().theme;
    set({ theme: current === 'dark' ? 'light' : 'dark' });
  },

  completeOnboarding: () => set({ isOnboarded: true }),
}));
