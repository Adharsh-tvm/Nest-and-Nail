import { requireRole } from "@/lib/auth";
import { HistoryProtection } from "@/components/containers/HistoryProtection";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("admin");

  return (
    <>
      <HistoryProtection />
      {children}
    </>
  );
}