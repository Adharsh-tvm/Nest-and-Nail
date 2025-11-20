import SignUpComponent from "@/app/(auth)/signup/signup-form";
import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

async function ClientSignup({}: Props) {
  const user = await getCurrentUser();

  // If user is authenticated, redirect immediately
  if (user) {
    if (user.role === "client") {
      redirect("/client/home");
    } else if (user.role === "worker") {
      redirect("/worker/portal");
    } else if (user.role === "admin") {
      redirect("/admin/dashboard");
    } else {
      redirect("/login")
    }
  }

  return (
    <>
      <ClientSideAuthProtection />
      <main className="flex items-center justify-center min-h-screen bg-zinc-950 font-sans p-4">
        <SignUpComponent role="client" />
      </main>
    </>
  );
}

export default ClientSignup;
