import React from "react";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getUserFromServer } from "@/services/auth";
import UserHydration from "@/components/containers/UserHydration";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromServer();
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <UserHydration user={user} />
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
