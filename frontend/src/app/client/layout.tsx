import ClientHeader from "@/app/components/containers/ClientHeader";
import Footer from "@/app/components/containers/ClientFooter";

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
      <ClientHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
