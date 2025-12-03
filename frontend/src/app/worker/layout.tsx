import ClientHeader from "@/components/containers/ClientHeader";
import Footer from "@/components/containers/ClientFooter";

export const metadata = {
  title: "Nest & Nail",
  description: "The most trusted marketplace for home services",
};

export default function WorkerRootLayout({
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
