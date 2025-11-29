import ClientHeader from "@/components/containers/ClientHeader";
import Footer from "@/components/containers/ClientFooter";

export const metadata = {
  title: "MendOn",
  description: "The most trusted marketplace for home services",
};

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientHeader />

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}