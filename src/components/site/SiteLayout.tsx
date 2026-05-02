import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingWidgets } from "./FloatingWidgets";
import { Toaster } from "@/components/ui/sonner";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer />
      <FloatingWidgets />
      <Toaster position="top-center" richColors />
    </div>
  );
}
