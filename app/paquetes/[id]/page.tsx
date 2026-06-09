import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingWA } from "@/components/FloatingWA";
import { StickyWhatsApp } from "@/components/StickyWhatsApp";
import { Icon } from "@/components/icons";
import { Stars } from "@/components/ui";
import { NEGOCIO } from "@/lib/data";
import { getPaquete, getPaquetes, getTestimonios } from "@/lib/store";
import {
  galeriaDe,
  resumenDe,
  mapaQueryDe,
  noIncluyeDe,
  itinerarioDe,
  faqsDe,
  resumenWhatsApp,
} from "@/lib/paquete-helpers";
import { formatCOP, waLink, descuentoPct } from "@/lib/utils";

export async function generateStaticParams() {
  const paquetes = await getPaquetes();
  return paquetes.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pkg = await getPaquete(id);
  if (!pkg) return { title: "Paquete no encontrado · Vuela Fácil Travel" };

  const titulo = `${pkg.destino} · ${pkg.duracion} desde ${formatCOP(pkg.precio)}`;
  const descripcion = resumenDe(pkg);
  return {
    title: `${titulo} | Vuela Fácil Travel`,
    description: descripcion,
    alternates: { canonical: `/paquetes/${pkg.id}` },
    openGraph: {
      title: titulo,
      description: descripcion,
      type: "article",
      locale: "es_CO",
      images: [{ url: pkg.imagen, width: 1200, height: 800, alt: pkg.destino }],
    },
  };
}

export default async function PaquetePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getPaquete(id);
  if (!pkg) notFound();

  const testimonios = await getTestimonios();
  const galeria = galeriaDe(pkg);
  const resumen = resumenDe(pkg);
  const itinerario = itinerarioDe(pkg);
  const noIncluye = noIncluyeDe(pkg);
  const faqs = faqsDe(pkg);
  const mapaSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    mapaQueryDe(pkg),
  )}&output=embed`;

  // Reseñas del destino: las que coinciden con este viaje; si no hay, mostramos
  // las generales como prueba social honesta.
  const norm = (s: string) => s.toLowerCase();
  const delDestino = testimonios.filter(
    (t) => norm(pkg.destino).includes(norm(t.destino)) || norm(t.destino).includes(norm(pkg.destino)),
  );
  const reseñas = delDestino.length > 0 ? delDestino : testimonios;
  const reseñasEspecificas = delDestino.length > 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${pkg.destino} — ${pkg.duracion}`,
    description: resumen,
    image: `https://vuelafacil.com${pkg.imagen}`,
    touristType: pkg.categoria,
    url: `https://vuelafacil.com/paquetes/${pkg.id}`,
    offers: {
      "@type": "Offer",
      price: pkg.precio,
      priceCurrency: "COP",
      availability: "https://schema.org/InStock",
      url: `https://vuelafacil.com/paquetes/${pkg.id}`,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: pkg.calificacion,
      reviewCount: pkg.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    provider: {
      "@type": "TravelAgency",
      name: "Vuela Fácil Travel",
      url: "https://vuelafacil.com",
    },
  };

  return (
    <div className="bg-ivory min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main className="pt-[72px]">
        {/* Hero del destino */}
        <section className="relative h-[52vh] min-h-[360px] w-full overflow-hidden">
          <Image
            src={galeria[0]}
            alt={pkg.destino}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-navy/20" />
          <div className="absolute bottom-0 inset-x-0">
            <div className="max-w-[1100px] mx-auto px-5 md:px-8 pb-8 md:pb-10 text-white">
              <nav className="text-[12px] text-white/70 mb-3 flex items-center gap-2">
                <Link href="/" className="hover:text-white">
                  Inicio
                </Link>
                <span>/</span>
                <Link href="/#paquetes" className="hover:text-white">
                  Paquetes
                </Link>
                <span>/</span>
                <span className="text-white/90">{pkg.destino}</span>
              </nav>
              <div className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-white/80 mb-2">
                <Icon.Pin className="w-3.5 h-3.5" /> {pkg.pais} · {pkg.categoria}
              </div>
              <h1 className="font-serif text-[36px] md:text-[56px] leading-[1.03] tracking-[-0.02em]">
                {pkg.destino}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                  <Icon.Clock className="w-3.5 h-3.5" /> {pkg.duracion}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur">
                  <Stars rating={pkg.calificacion} className="w-3.5 h-3.5" /> {pkg.calificacion}
                  <span className="opacity-70">({pkg.reviews} reseñas)</span>
                </span>
                {pkg.etiqueta && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-coral to-amber font-semibold tracking-wider uppercase text-[10px]">
                    {pkg.etiqueta}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1100px] mx-auto px-5 md:px-8 py-10 md:py-14 grid lg:grid-cols-3 gap-10">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <p className="text-navy/75 text-[17px] leading-relaxed">{resumen}</p>
            </section>

            {/* Galería */}
            {galeria.length > 1 && (
              <section>
                <h2 className="font-serif text-navy text-[26px] mb-4">Galería</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {galeria.map((src, i) => (
                    <div
                      key={src + i}
                      className={`relative rounded-2xl overflow-hidden ${
                        i === 0 ? "col-span-2 md:col-span-2 row-span-2 aspect-[4/3]" : "aspect-[4/3]"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${pkg.destino} — foto ${i + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Incluye / No incluye */}
            <section className="grid sm:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-navy text-[22px] mb-4">Qué incluye</h2>
                <ul className="space-y-2.5">
                  {pkg.incluye.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-[14px] text-navy/80">
                      <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> {i}
                    </li>
                  ))}
                  <li className="flex items-start gap-2 text-[14px] text-navy/80">
                    <Icon.Check className="w-4 h-4 mt-0.5 text-emerald shrink-0" /> Asistencia por
                    WhatsApp 24/7
                  </li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-navy text-[22px] mb-4">No incluye</h2>
                <ul className="space-y-2.5 text-navy/65 text-[14px]">
                  {noIncluye.map((i) => (
                    <li key={i}>· {i}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Itinerario */}
            <section>
              <h2 className="font-serif text-navy text-[26px] mb-5">Itinerario día a día</h2>
              <ol className="space-y-5">
                {itinerario.map((it, i) => (
                  <li key={i} className="relative pl-7 border-l-2 border-coral/30 pb-1">
                    <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-coral" />
                    <div className="text-[11px] uppercase tracking-[0.2em] text-coral font-semibold">
                      {it.dia}
                    </div>
                    <div className="font-serif text-navy text-[18px] mt-0.5">{it.titulo}</div>
                    <div className="text-navy/65 text-[14px] mt-1 leading-relaxed">{it.desc}</div>
                  </li>
                ))}
              </ol>
            </section>

            {/* Cómo llegar / Mejor época */}
            {(pkg.comoLlegar || pkg.mejorEpoca) && (
              <section className="grid sm:grid-cols-2 gap-6">
                {pkg.mejorEpoca && (
                  <div className="p-5 rounded-2xl bg-white border border-navy/8">
                    <div className="flex items-center gap-2 text-coral font-semibold mb-2">
                      <Icon.Sparkle className="w-4 h-4" /> Mejor época para viajar
                    </div>
                    <p className="text-navy/70 text-[14px] leading-relaxed">{pkg.mejorEpoca}</p>
                  </div>
                )}
                {pkg.comoLlegar && (
                  <div className="p-5 rounded-2xl bg-white border border-navy/8">
                    <div className="flex items-center gap-2 text-coral font-semibold mb-2">
                      <Icon.Plane className="w-4 h-4" /> Cómo llegar
                    </div>
                    <p className="text-navy/70 text-[14px] leading-relaxed">{pkg.comoLlegar}</p>
                  </div>
                )}
              </section>
            )}

            {/* Mapa */}
            <section>
              <h2 className="font-serif text-navy text-[26px] mb-4">Dónde queda</h2>
              <div className="rounded-2xl overflow-hidden border border-navy/10 aspect-[16/9]">
                <iframe
                  title={`Mapa de ${pkg.destino}`}
                  src={mapaSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="font-serif text-navy text-[26px] mb-4">Preguntas frecuentes</h2>
              <div className="space-y-3">
                {faqs.map((f) => (
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

            {/* Reseñas */}
            <section>
              <h2 className="font-serif text-navy text-[26px] mb-1">
                {reseñasEspecificas
                  ? `Reseñas de quienes viajaron a ${reseñas[0].destino}`
                  : "Lo que dicen nuestros viajeros"}
              </h2>
              <div className="flex items-center gap-2 mb-5">
                <Stars rating={pkg.calificacion} />
                <span className="text-navy font-semibold text-[14px]">{pkg.calificacion}</span>
                <span className="text-navy/55 text-[13px]">· {pkg.reviews} reseñas verificadas</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {reseñas.map((t) => (
                  <figure key={t.nombre} className="bg-white rounded-2xl p-5 border border-navy/8">
                    <div className="flex items-center gap-2 mb-3">
                      <Stars rating={t.rating} />
                      <span className="text-navy/70 text-[13px] font-semibold">
                        {t.rating.toFixed(1)}
                      </span>
                    </div>
                    <blockquote className="text-navy/80 text-[14px] leading-relaxed">
                      &ldquo;{t.texto}&rdquo;
                    </blockquote>
                    <figcaption className="mt-4 pt-3 border-t border-navy/8 flex items-center gap-3">
                      <Image
                        src={t.foto}
                        alt={t.nombre}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-navy font-semibold text-[13px]">{t.nombre}</div>
                        <div className="text-navy/55 text-[12px]">
                          {t.ciudad} · viajó a {t.destino}
                        </div>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          </div>

          {/* Panel de reserva sticky */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-[88px] bg-white rounded-3xl border border-navy/10 p-6 shadow-[0_30px_60px_-30px_rgba(13,44,84,0.3)]">
              <div className="text-[11px] uppercase tracking-wider text-navy/50">
                Precio por persona
              </div>
              {(() => {
                const desc = descuentoPct(pkg.precio, pkg.precioAntes);
                return desc ? (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[16px] text-navy/40 line-through">
                      {formatCOP(pkg.precioAntes!)}
                    </span>
                    <span className="text-[11px] font-bold text-coral bg-coral/10 px-2 py-0.5 rounded-full">
                      Ahorra {desc}%
                    </span>
                  </div>
                ) : null;
              })()}
              <div className="font-serif text-navy text-[36px] leading-none mt-1">
                {formatCOP(pkg.precio)}
              </div>
              <div className="text-[12px] text-emerald-700 font-medium mt-1">
                o 12 cuotas sin interés
              </div>
              <div className="text-[11px] text-navy/50 mt-1.5">
                Impuestos y tasas incluidos · sin cargos sorpresa
              </div>

              <div className="mt-5">
                <div className="text-[11px] uppercase tracking-wider text-navy/60 font-semibold mb-2">
                  Próximas salidas
                </div>
                <div className="flex flex-wrap gap-2">
                  {pkg.salidas.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-navy/10 bg-ivory text-[12px] text-navy/75"
                    >
                      <Icon.Calendar className="w-3.5 h-3.5 text-coral" /> {s}
                    </span>
                  ))}
                </div>
              </div>

              <a
                href={waLink(resumenWhatsApp(pkg))}
                target="_blank"
                rel="noreferrer"
                className="mt-6 flex items-center justify-center gap-2 w-full px-6 py-4 rounded-full bg-[#25D366] text-white font-semibold tracking-wide hover:bg-[#1ebe57] transition-colors shadow-[0_15px_30px_-8px_rgba(37,211,102,0.55)]"
              >
                <Icon.Whatsapp className="w-5 h-5" />
                Cotizar por WhatsApp
              </a>
              <Link
                href="/#paquetes"
                className="mt-3 block text-center px-6 py-3 rounded-full border border-navy/15 text-navy/70 text-[13px] font-medium hover:border-navy hover:text-navy transition-colors"
              >
                Ver otros paquetes
              </Link>

              <div className="mt-5 pt-5 border-t border-navy/10 space-y-2 text-[12px] text-navy/60">
                <div className="flex items-center gap-2">
                  <Icon.Shield className="w-4 h-4 text-emerald" /> {NEGOCIO.rnt} · operador
                  autorizado
                </div>
                <div className="flex items-center gap-2">
                  <Icon.Clock className="w-4 h-4 text-amber" /> Respuesta {NEGOCIO.tiempoRespuesta} por
                  WhatsApp
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
      <FloatingWA />
      <StickyWhatsApp />
    </div>
  );
}
