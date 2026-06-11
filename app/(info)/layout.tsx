import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";

// Layout compartido de las páginas de información y legales: header sólido
// (sin hero detrás), contenido centrado y footer.
export default function InfoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ivory min-h-screen">
      <Header solido />
      <main className="pt-[72px]">
        <div className="max-w-[860px] mx-auto px-5 md:px-8 py-12 md:py-16">{children}</div>
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}
