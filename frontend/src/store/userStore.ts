import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/shared/types/userTypes";

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: "user-store" }
  )
);
