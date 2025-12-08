// UserHydration.tsx (client)
"use client";

import { useEffect } from "react";
import { useUserStore, User } from "@/store/userStore";
import { VerificationStatus } from "@/enums/enums";
// ⬅️ adjust path if needed

type ServerUser = Record<string, any>;

function normalizeIsVerified(v: any): VerificationStatus {
  // VERIFIED cases
  if (
    v === true ||
    v === 1 ||
    v === "1" ||
    v === "VERIFIED" ||
    v === "verified"
  ) {
    return VerificationStatus.VERIFIED;
  }

  // PENDING cases
  if (v === "PENDING" || v === "pending") {
    return VerificationStatus.PENDING;
  }

  // Default
  return VerificationStatus.NOT_VERIFIED;
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

      profileImageUrl:
        user.profileImageUrl ??
        user.profilePictureUrl ??
        user.profile_picture ??
        user.profilePicture ??
        null,

      iat: user.iat,
      exp: user.exp,
    };

    console.log("[UserHydration] raw isVerified fields:", {
      isVerified: user.isVerified,
      is_verified: user.is_verified,
      verified: user.verified,
    });
    console.log("[UserHydration] mapped isVerified:", mapped.isVerified);

    setUser(mapped);
  }, [user, setUser]);

  return null;
}
