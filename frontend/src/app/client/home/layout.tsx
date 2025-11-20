import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";
import WorkerHeader from "@/components/containers/WorkerHeader";

type Me = {
  id: string;
  role: string;
  isVerified: boolean;
  name?: string;
};

const BACKEND =
  process.env.BACKEND_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "http://localhost:4000";

export default async function WorkerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieHeader = cookies().toString();

  try {
    const res = await fetch(`${BACKEND}/me`, {
      method: "GET",
      headers: {
        cookie: cookieHeader ?? "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      redirect("/login");
    }

    const me: Me = await res.json();

    if (me.role !== "worker") {
      if (me.role === "client") {
        redirect("/");
      } else {
        redirect("/unauthorized");
      }
    }

    if (!me.isVerified) {
      redirect("/worker/documents");
    }

    return (
      <>
        <ClientSideAuthProtection />
        <WorkerHeader  />
        <main>{children}</main>
      </>
    );
  } catch (err) {
    console.error("Error fetching /me in WorkerRootLayout:", err);
    redirect("/login");
  }
}
