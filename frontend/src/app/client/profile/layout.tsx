import Sidebar from "@/app/components/containers/layout/ClientSidebar";

export const metadata = {
  title: "Nest & Nail",
  description: "The most trusted marketplace for home services",
};

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Sidebar> */}
        <main className="flex-1">{children}</main>
      {/* </Sidebar>   */}
    </>
  );
}
