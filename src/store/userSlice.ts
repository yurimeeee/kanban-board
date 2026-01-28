import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from 'firebase/auth';
import { create } from 'zustand';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) =>
        set({
          user: user,
          isLoading: false
        }),
      clearUser: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }),
    }
  )
);