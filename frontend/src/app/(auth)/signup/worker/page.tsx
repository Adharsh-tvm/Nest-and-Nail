import SignUpComponent from "@/app/(auth)/signup/signup-form";
import React from "react";

type Props = {};

function ClientSignup({}: Props) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-950 font-sans p-4">
      <SignUpComponent role="worker" />
    </main>
  );
}

export default ClientSignup;
