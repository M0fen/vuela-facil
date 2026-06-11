import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Icon } from "@/components/icons";
import { SectionEyebrow } from "@/components/ui";
import { PackageMini } from "@/components/PackageMini";
import { NEGOCIO } from "@/lib/data";
import { getPaquetes } from "@/lib/store";
import { LANDINGS, getLanding, paquetesDeLanding } from "@/lib/landings";
import { waLink } from "@/lib/utils";

const BASE = "https://vuelafacil.com";

export function generateStaticParams() {
  return LANDINGS.map((l) => ({ tema: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tema: string }>;
}): Promise<Metadata> {
  const { tema } = await params;
  const landing = getLanding(tema);
  if (!landing) return { title: "Viajes · Vuela Fácil Travel" };
  return {
    title: `${landing.titulo} | Vuela Fácil Travel`,
    description: landing.metaDescripcion,
    alternates: { canonical: `/viajes/${landing.slug}` },
    openGraph: {
      title: landing.titulo,
      description: landing.metaDescripcion,
      type: "website",
      locale: "es_CO",
      images: [{ url: landing.hero, width: 1200, height: 800, alt: landing.h1 }],
    },
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ tema: string }>;
}) {
  const { tema } = await params;
  const landing = getLanding(tema);
  if (!landing) notFound();

  const todos = await getPaquetes();
  const { paquetes, exactos } = paquetesDeLanding(landing, todos);

  // Otras landings para enlaces internos (SEO).
  const otras = LANDINGS.filter((l) => l.slug !== landing.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: BASE },
          { "@type": "ListItem", position: 2, name: "Viajes", item: `${BASE}/#destinos` },
          { "@type": "ListItem", position: 3, name: landing.h1, item: `${BASE}/viajes/${landing.slug}` },
        ],
      },
      {
        "@type": "CollectionPage",
        name: landing.h1,
        description: landing.metaDescripcion,
        url: `${BASE}/viajes/${landing.slug}`,
        isPartOf: { "@type": "WebSite", name: "Vuela Fácil Travel", url: BASE },
        mainEntity: {
          "@type": "ItemList",
          itemListElement: paquetes.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${BASE}/paquetes/${p.id}`,
            name: p.destino,
          })),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: landing.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <div className="bg-ivory min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="pt-[72px]">
        {/* Hero */}
        <section className="relative h-[46vh] min-h-[320px] w-full overflow-hidden">
          <Image src={landing.hero} alt={landing.h1} fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/45 to-navy/25" />
          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-[1100px] mx-auto px-5 md:px-8 pb-8 md:pb-10 text-white">
              <nav className="text-[12px] text-white/70 mb-3 flex items-center gap-2">
                <Link href="/" className="hover:text-white">
                  Inicio
                </Link>
                <span>/</span>
                <Link href="/#destinos" className="hover:text-white">
                  Viajes
                </Link>
                <span>/</span>
                <span className="text-white/90">{landing.eyebrow}</span>
              </nav>
              <h1 className="font-serif text-[34px] md:text-[52px] leading-[1.04] tracking-[-0.02em] max-w-3xl">
                {landing.h1}
              </h1>
              <p className="mt-3 text-white/85 text-[15px] md:text-[17px] max-w-2xl leading-relaxed">
                {landing.intro}
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-14">
          {/* Diferenciales */}
          <section className="grid sm:grid-cols-3 gap-4 mb-12">
            {landing.bullets.map((b) => (
              <div key={b.titulo} className="p-5 rounded-2xl bg-white border border-navy/8">
                <div className="flex items-center gap-2 text-coral font-semibold mb-1.5">
                  <Icon.Check className="w-4 h-4" /> {b.titulo}
                </div>
                <p className="text-navy/65 text-[13px] leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </section>

          {/* Paquetes */}
          <section className="mb-14">
            <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
              <div>
                <SectionEyebrow>{exactos ? "Planes disponibles" : "Ideas para inspirarte"}</SectionEyebrow>
                <h2 className="font-serif text-navy text-[28px] md:text-[34px] leading-tight mt-2">
                  {exactos ? "Paquetes que te pueden encajar" : "Te lo armamos a la medida"}
                </h2>
                {!exactos && (
                  <p className="text-navy/60 text-[14px] mt-2 max-w-xl">
                    Aún no tenemos un paquete fijo para esta categoría: lo diseñamos contigo. Mientras
                    tanto, estos son algunos de los favoritos de nuestros viajeros.
                  </p>
                )}
              </div>
              <a
                href={waLink(landing.ctaMensaje)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#25D366] text-white text-[14px] font-semibold hover:bg-[#1ebe57] transition-colors shadow-[0_15px_30px_-10px_rgba(37,211,102,0.5)]"
              >
                <Icon.Whatsapp className="w-5 h-5" /> Cotizar por WhatsApp
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {paquetes.map((p) => (
                <PackageMini key={p.id} p={p} />
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-14">
            <h2 className="font-serif text-navy text-[28px] md:text-[34px] mb-5">Preguntas frecuentes</h2>
            <div className="space-y-3">
              {landing.faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-2xl bg-white border border-navy/8 p-5 open:border-coral/30"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-navy text-[15px]">
                    {f.q}
                    <Icon.ChevronDown className="w-5 h-5 text-coral transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-navy/70 text-[14px] leading-relaxed mt-3">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* CTA cierre */}
          <section className="rounded-3xl bg-navy text-white p-8 md:p-10 text-center mb-14">
            <h2 className="font-serif text-[26px] md:text-[32px] leading-tight">
              ¿Listo para tu próximo viaje?
            </h2>
            <p className="text-white/75 text-[15px] mt-3 max-w-xl mx-auto">
              Cuéntanos qué tienes en mente y te armamos una propuesta sin compromiso. Respuesta en{" "}
              {NEGOCIO.tiempoRespuesta} por WhatsApp.
            </p>
            <a
              href={waLink(landing.ctaMensaje)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-7 py-4 rounded-full bg-[#25D366] text-white font-semibold hover:bg-[#1ebe57] transition-colors"
            >
              <Icon.Whatsapp className="w-5 h-5" /> Hablar con un asesor
            </a>
          </section>

          {/* Enlaces internos a otras landings */}
          <section>
            <h2 className="font-serif text-navy text-[22px] md:text-[26px] mb-5">Explora otros viajes</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {otras.map((l) => (
                <Link
                  key={l.slug}
                  href={`/viajes/${l.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-[16/10]"
                >
                  <Image
                    src={l.hero}
                    alt={l.h1}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/25 to-transparent" />
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                    <div className="font-serif text-[17px] leading-tight">{l.h1}</div>
                    <span className="mt-1 inline-flex items-center gap-1 text-[12px] font-medium text-white/85">
                      Ver más <Icon.Arrow className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
      <StickyWhatsApp />
    </div>
  );
}
