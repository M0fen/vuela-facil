import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { PackageMini } from "@/components/PackageMini";
import { Icon } from "@/components/icons";
import { getGuia, getGuiasPublicadas, getPaquete } from "@/lib/store";
import { renderMarkdown } from "@/lib/markdown";
import { resumenWhatsApp } from "@/lib/paquete-helpers";
import { waLink } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

export async function generateStaticParams() {
  const guias = await getGuiasPublicadas();
  return guias.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = await getGuia(slug);
  if (!g || !g.publicada) return { title: "Guía no encontrada · Vuela Fácil Travel" };
  return {
    title: `${g.titulo} | Vuela Fácil Travel`,
    description: g.resumen,
    alternates: { canonical: `/guias/${g.slug}` },
    openGraph: {
      title: g.titulo,
      description: g.resumen,
      type: "article",
      locale: "es_CO",
      images: [{ url: g.imagen, width: 1200, height: 800, alt: g.titulo }],
    },
  };
}

export default async function GuiaArticulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const g = await getGuia(slug);
  if (!g || !g.publicada) notFound();

  const html = renderMarkdown(g.contenido);
  const paquete = g.paqueteId ? await getPaquete(g.paqueteId) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.titulo,
    description: g.resumen,
    image: `${SITE_URL}${g.imagen}`,
    datePublished: g.createdAt,
    author: { "@type": "Organization", name: "Vuela Fácil Travel" },
    publisher: {
      "@type": "Organization",
      name: "Vuela Fácil Travel",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/logo.jpg` },
    },
  };

  return (
    <div className="bg-ivory min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header />
      <main className="pt-[72px]">
        <section className="relative h-[44vh] min-h-[320px] w-full overflow-hidden">
          <Image src={g.imagen} alt={g.titulo} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/20" />
          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-[760px] mx-auto px-5 md:px-8 pb-8 text-white">
              <nav className="text-[12px] text-white/70 mb-3 flex items-center gap-2">
                <Link href="/" className="hover:text-white">Inicio</Link>
                <span>/</span>
                <Link href="/guias" className="hover:text-white">Guías</Link>
              </nav>
              {g.etiquetas?.[0] && (
                <span className="inline-block px-3 py-1 rounded-full bg-white/15 backdrop-blur text-[11px] uppercase tracking-wider mb-3">
                  {g.etiquetas[0]}
                </span>
              )}
              <h1 className="font-serif text-[30px] md:text-[44px] leading-[1.07] tracking-[-0.02em]">
                {g.titulo}
              </h1>
            </div>
          </div>
        </section>

        <article className="max-w-[760px] mx-auto px-5 md:px-8 py-12 md:py-16">
          <p className="text-navy/70 text-[18px] leading-relaxed mb-8">{g.resumen}</p>
          <div className="guia-content" dangerouslySetInnerHTML={{ __html: html }} />

          {paquete && (
            <div className="mt-12 p-6 md:p-7 rounded-3xl bg-white border border-navy/10">
              <div className="text-[11px] uppercase tracking-[0.2em] text-coral font-semibold mb-3">
                Vívelo con nosotros
              </div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-5 items-center">
                <div className="max-w-xs">
                  <PackageMini p={paquete} />
                </div>
                <a
                  href={waLink(resumenWhatsApp(paquete))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
                >
                  <Icon.Whatsapp className="w-5 h-5" /> Cotizar por WhatsApp
                </a>
              </div>
            </div>
          )}

          <div className="mt-10">
            <Link href="/guias" className="inline-flex items-center gap-1.5 text-coral font-semibold text-[14px]">
              <Icon.Arrow className="w-4 h-4 rotate-180" /> Volver a las guías
            </Link>
          </div>
        </article>
      </main>
      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
