import { create } from "zustand";

export type User = {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

type UserStore = {
  user: User | null;
  setUser: (user: User | null) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
