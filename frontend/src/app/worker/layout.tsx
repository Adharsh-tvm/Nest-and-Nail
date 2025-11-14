import { requireRole } from "@/lib/auth";
import { ClientSideAuthProtection } from "@/components/containers/HistoryProtection";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("worker");

  return (
    <>
     <ClientSideAuthProtection />
      {children}
    </>
  );
}