import { create } from "zustand";

export type User = {
  id: string;
  name:string;
  email: string;
  role: string;
  isVerified: boolean;
  iat?: number;
  exp?: number;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null | ((prev: User | null) => User | null)) => void;
};


export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (updater) =>
    set((state) => ({
      user: typeof updater === "function" ? updater(state.user) : updater,
    })),
}));

