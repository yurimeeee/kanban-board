import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from 'firebase/auth';
import { create } from 'zustand';

export interface UserProfile {
  displayName: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
  email: string | null;
  updatedAt?: number;
}

interface UserState {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      isLoading: true,

      setUser: (user) =>
        set({
          user: user,
          isLoading: false,
        }),

      setProfile: (profile) =>
        set({
          profile: profile,
        }),

      updateProfile: (updates) =>
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...updates }
            : { displayName: null, phoneNumber: null, photoURL: null, email: null, ...updates },
        })),

      clearUser: () =>
        set({
          user: null,
          profile: null,
          isLoading: false,
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, profile: state.profile }),
    }
  )
);