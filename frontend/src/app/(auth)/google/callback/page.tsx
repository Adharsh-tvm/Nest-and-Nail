// app/auth/google/callback/page.tsx
"use client";

import { useEffect, useState } from "react";

export default function GoogleCallbackPage() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/client/google-login`, {
          method: "POST",
          credentials: "include", // IMPORTANT: so cookies are set
          // No body required — server reads BetterAuth session from headers forwarded by the browser
          // (BetterAuth set its own cookies during the OAuth flow)
        });

        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.message || "Google login failed");
        }

        // now your JWT cookies are set
        window.location.href = "/dashboard";
      } catch (e: any) {
        setError(e.message);
      }
    })();
  }, []);

  return (
    <div className="p-6">
      <p>Finalizing sign-in…</p>
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
