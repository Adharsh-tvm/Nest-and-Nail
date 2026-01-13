import SignUpComponent from "@/app/(auth)/signup/signup-form";
import React from "react";

type Props = {};

async function ClientSignup({ }: Props) {

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-gray-50 font-sans p-4">
        <SignUpComponent role="client" />
      </main>
    </>
  );
}

export default ClientSignup;
