import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/shared/types/userTypes";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "user-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
