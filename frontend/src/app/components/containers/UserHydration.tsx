// UserHydration.tsx (client)
"use client";

import { useEffect } from "react";
import { useUserStore, User } from "@/store/userStore";

type ServerUser = Record<string, any>;

function normalizeIsVerified(v: any): boolean {
  // handle boolean, "true"/"false", 1/0, "1"/"0"
  if (v === true) return true;
  if (v === false) return false;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  if (typeof v === "number") return v === 1;
  return Boolean(v);
}

export default function UserHydration({ user }: { user: ServerUser | null }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (!user) {
      setUser(null);
      console.log("[UserHydration] no user provided -> set null");
      return;
    }

    // Accept many shapes, pick canonical fields
const mapped: User = {
  id: user.id ?? user.user_id ?? user.userId ?? "",
  name: user.name ?? user.user_name ?? user.userName ?? "",
  email: user.email ?? user.email_address ?? "",
  role: user.role ?? user.user_role ?? "client",
  isVerified: normalizeIsVerified(
    user.is_verified ?? user.isVerified ?? user.verified  
  ),
  iat: user.iat,
  exp: user.exp,
};

console.log("[UserHydration] raw isVerified fields:", {
  isVerified: user.isVerified,
  is_verified: user.is_verified,
  verified: user.verified
});

    setUser(mapped);
  }, [user, setUser]);

  return null;
}
