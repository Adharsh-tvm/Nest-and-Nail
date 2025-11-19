"use client";

import React from "react";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <html lang="en">
        <body>
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>{children}</AuthProvider>
          </GoogleOAuthProvider>
        </body>
      </html>
    </div>
  );
}
