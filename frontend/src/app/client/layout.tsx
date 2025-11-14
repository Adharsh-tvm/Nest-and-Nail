import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";
import { requireRole } from "@/lib/auth";

export default async function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("client");

  return (
    <>
      <ClientSideAuthProtection />
      {children}
    </>
  );
}
