import { notFound } from "next/navigation";
import type { Alojamiento } from "@/lib/types";
import { readHoteles } from "@/lib/store";
import { saveHotelAction } from "../../../actions";
import { EstadiaForm } from "../../EstadiaForm";

export const dynamic = "force-dynamic";

const TIPOS_HOTEL = ["Hotel", "Hotel boutique", "Hotel campestre", "Hostal", "Resort", "Aparta-hotel"] as const;

export default async function EditarHotel({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;
  const esNuevo = id === "nuevo";

  let item: Partial<Alojamiento> = {};
  if (!esNuevo) {
    const items = await readHoteles();
    const found = items.find((x) => x.id === id);
    if (!found) notFound();
    item = found;
  }

  return (
    <EstadiaForm
      action={saveHotelAction}
      item={item}
      esNuevo={esNuevo}
      adminBase="/admin/hoteles"
      noun="hotel"
      tipos={TIPOS_HOTEL}
      error={!!error}
    />
  );
}
