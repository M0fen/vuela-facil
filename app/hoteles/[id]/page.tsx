import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EstadiaDetalle } from "@/components/EstadiaDetalle";
import { getHotel, getHotelesPublicados } from "@/lib/store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const a = await getHotel(id);
  if (!a) return { title: "Hotel no encontrado · Vuela Fácil Travel" };
  return {
    title: `${a.titulo} · ${a.ubicacion} · Vuela Fácil Travel`,
    description: a.descripcion.slice(0, 160),
    alternates: { canonical: `/hoteles/${a.id}` },
    openGraph: {
      title: `${a.titulo} · ${a.ubicacion}`,
      description: a.descripcion.slice(0, 160),
      images: a.imagen ? [a.imagen] : undefined,
      type: "website",
      locale: "es_CO",
    },
  };
}

export default async function HotelDetalle({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const a = await getHotel(id);
  if (!a || !a.publicado) notFound();

  return <EstadiaDetalle item={a} basePath="/hoteles" sectionLabel="Hoteles" />;
}

export async function generateStaticParams() {
  const items = await getHotelesPublicados();
  return items.map((a) => ({ id: a.id }));
}
