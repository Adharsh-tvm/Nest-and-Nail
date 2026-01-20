import React from "react";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserHydration from "@/app/components/containers/providers/UserHydration";
import { ToastProvider } from "./components/containers/providers/ToasterProvider";
import { getCurrentUser } from "./actions/users/user-actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          <UserHydration user={user}>
            <ToastProvider />
            {children}
          </UserHydration>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
