"use client";

import { ReactNode, useLayoutEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { User } from "@/shared/types/userTypes";

export default function UserHydration({
  user,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  const setUser = useUserStore((s) => s.setUser);

  useLayoutEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return <>{children}</>;
}
