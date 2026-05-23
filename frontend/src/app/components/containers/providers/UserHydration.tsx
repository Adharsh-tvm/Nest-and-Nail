"use client";

import { ReactNode, useLayoutEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { User } from "@/shared/types/userTypes";

// Intercept [GSI_LOGGER] and FedCM-related console errors to prevent
// Next.js development error overlay from disrupting the flow.
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const firstArg = args[0];
    if (
      typeof firstArg === "string" &&
      (firstArg.includes("[GSI_LOGGER]") || firstArg.includes("FedCM"))
    ) {
      console.warn(...args);
      return;
    }
    originalError(...args);
  };
}

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
