
import { requireRole } from "@/lib/auth";

export default async function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("client");

  return (
    <>
      {children}
    </>
  );
}
