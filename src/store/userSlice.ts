import { createJSONStorage, persist } from 'zustand/middleware';

import type { User } from 'firebase/auth';
import { create } from 'zustand';
// interface UserState {
//   user: User | null;
//   isLoading: boolean;
//   setUser: (user: User | null) => void;
//   clearUser: () => void;
// }

// export const useUserStore = create<UserState>((set) => ({
//   user: null,
//   isLoading: true,
//   setUser: (user) => set({ user, isLoading: false }),
//   clearUser: () => set({ user: null, isLoading: false }),
// }));

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
      name: 'user-storage', // localStorage에 저장될 key 이름
      storage: createJSONStorage(() => localStorage), // 기본값이므로 생략 가능
      // isLoading은 저장하지 않고 항상 초기값 true로 시작하게 하고 싶다면:
      partialize: (state) => ({ user: state.user }),
    }
  )
);