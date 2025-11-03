import SignUpComponent from "@/components/containers/signup-form";
import React from "react";

type Props = {};

function ClientSignup({}: Props) {
  return (
    <main className="flex items-center justify-center min-h-screen bg-zinc-950 font-sans p-4">
      <SignUpComponent role="client" />
    </main>
  );
}

export default ClientSignup;
