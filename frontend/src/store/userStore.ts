// store/userStore.ts
import { create } from "zustand";
import { User } from "@/shared/types/userTypes";



type UserStore = {
  user: User | null;
  setUser: (
    user: User | null | ((prev: User | null) => User | null)
  ) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (updater) =>
    set((state) => ({
      user:
        typeof updater === "function"
          ? updater(state.user)
          : updater,
    })),
}));
