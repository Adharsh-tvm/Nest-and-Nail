"use client";

import { useEffect } from "react";
import { useUserStore, User } from "@/store/userStore";

export default function UserHydration({ user }: { user: User | null }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user); // can be null or user object
  }, [user, setUser]);

  return null;
}
