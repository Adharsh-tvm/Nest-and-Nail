// store/userStore.ts
import { create } from "zustand";
import { VerificationStatus } from "@/shared/enums/authEnums";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: VerificationStatus;
  profileImageUrl?: string | null;

  phone_number?: number;
  skills?: string[];
  address?: string;
  documents?: string[];
  certificates?: string[];
  workPhotos?: string[];
  createdAt?: string;
  updatedAt?: string;

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
