import Image from "next/image";
import Link from "next/link";
import { Icon } from "./icons";
import { SectionEyebrow } from "./ui";
import { formatCOP, waLink, descuentoPct } from "@/lib/utils";
import type { Alojamiento } from "@/lib/types";

/** Tarjeta de alojamiento (reutilizada en el inicio y en la página /alojamientos). */
export function AlojamientoCard({ a }: { a: Alojamiento }) {
  const desc = descuentoPct(a.precioNoche, a.precioAntes);
  const msg = `Hola Vuela Fácil 👋 Me interesa el alojamiento *${a.titulo}* (${a.ubicacion}). ¿Me cuentas disponibilidad y precio?`;
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-navy/8 hover:border-navy/20 hover:shadow-[0_30px_60px_-30px_rgba(13,44,84,0.35)] hover:-translate-y-1 transition-[transform,box-shadow,border-color] duration-300 flex flex-col">
      <Link href={`/alojamientos/${a.id}`} className="relative aspect-[5/4] overflow-hidden block">
        <Image
          src={a.imagen}
          alt={a.titulo}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1400ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/45 via-transparent to-transparent" />
        <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur text-navy text-[11px] font-semibold tracking-wide">
          {a.tipo}
        </div>
        {a.etiqueta && (
          <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gradient-to-r from-coral to-amber text-white text-[11px] font-semibold tracking-wider uppercase shadow-lg">
            {a.etiqueta}
          </div>
        )}
        <div className="absolute bottom-4 left-4 text-white text-[11px] uppercase tracking-[0.18em] flex items-center gap-1.5">
          <Icon.Pin className="w-3.5 h-3.5" /> {a.ubicacion}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-[22px] md:text-[24px] text-navy leading-tight">
          <Link href={`/alojamientos/${a.id}`} className="hover:text-coral transition-colors">
            {a.titulo}
          </Link>
        </h3>
        <div className="flex items-center gap-x-3 gap-y-1 text-[12px] text-navy/55 mt-2 flex-wrap">
          <span className="inline-flex items-center gap-1"><Icon.Users className="w-3.5 h-3.5" /> {a.huespedes} huéspedes</span>
          <span className="w-1 h-1 rounded-full bg-navy/25" />
          <span>{a.habitaciones} hab.</span>
          <span className="w-1 h-1 rounded-full bg-navy/25" />
          <span>{a.banos} baños</span>
        </div>
        {a.amenidades.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {a.amenidades.slice(0, 3).map((am) => (
              <span key={am} className="px-2.5 py-1 rounded-full bg-ivory border border-navy/8 text-navy/70 text-[11px]">
                {am}
              </span>
            ))}
            {a.amenidades.length > 3 && (
              <span className="px-2.5 py-1 rounded-full text-navy/45 text-[11px]">+{a.amenidades.length - 3}</span>
            )}
          </div>
        )}
        <div className="mt-auto pt-5 border-t border-navy/8">
          <div className="flex items-end justify-between mb-4">
            <div>
              {desc && (
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-navy/40 line-through">{formatCOP(a.precioAntes!)}</span>
                  <span className="text-[11px] font-bold text-coral bg-coral/10 px-1.5 py-0.5 rounded-full">−{desc}%</span>
                </div>
              )}
              <div className="font-serif text-[26px] text-navy leading-none mt-1">{formatCOP(a.precioNoche)}</div>
              <div className="text-[11px] text-navy/50 mt-0.5">por noche{a.minNoches ? ` · mín. ${a.minNoches}` : ""}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href={`/alojamientos/${a.id}`}
              className="px-4 py-3 rounded-full border border-navy/15 text-navy text-[13px] font-semibold text-center hover:bg-navy hover:text-white transition-colors"
            >
              Ver detalle
            </Link>
            <a
              href={waLink(msg)}
              target="_blank"
              rel="noreferrer"
              data-wa="alojamiento-card"
              className="px-4 py-3 rounded-full bg-[#25D366] text-white text-[13px] font-semibold flex items-center justify-center gap-1.5 hover:bg-[#1ebe57] transition-colors"
            >
              <Icon.Whatsapp className="w-4 h-4" /> Reservar
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Bloque destacado del inicio: muestra los alojamientos marcados como destacados. */
export function Alojamientos({ alojamientos }: { alojamientos: Alojamiento[] }) {
  const destacados = alojamientos.filter((a) => a.destacado).slice(0, 3);
  const lista = destacados.length > 0 ? destacados : alojamientos.slice(0, 3);
  if (lista.length === 0) return null;

  return (
    <section id="alojamientos" className="bg-white py-14 md:py-28">
      <div className="max-w-[1320px] mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <SectionEyebrow>Alojamientos</SectionEyebrow>
            <h2 className="font-serif text-navy text-[34px] md:text-[52px] leading-[1.05] tracking-[-0.02em] mt-3">
              Fincas y estadías para <em className="italic text-coral">tu próximo descanso</em>.
            </h2>
            <p className="mt-4 text-navy/65 max-w-lg">
              Fincas, cabañas y apartamentos en el Eje Cafetero y más. Reserva fácil por WhatsApp,
              con la asesoría de siempre.
            </p>
          </div>
          <Link
            href="/alojamientos"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-navy/15 text-navy font-semibold hover:bg-navy hover:text-white transition-colors shrink-0"
          >
            Ver todos <Icon.Arrow className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
          {lista.map((a) => (
            <AlojamientoCard key={a.id} a={a} />
          ))}
        </div>
      </div>
    </section>
  );
}
