// store/userStore.ts
import { create } from "zustand";
import { VerificationStatus } from "@/enums/enums";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: VerificationStatus;      // 👈 enum instead of boolean
  profileImageUrl?: string | null;
  iat?: number;
  exp?: number;
};

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
