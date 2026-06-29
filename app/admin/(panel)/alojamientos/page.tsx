import { readAlojamientos } from "@/lib/store";
import { deleteAlojamientoAction, duplicarAlojamientoAction, moverAlojamientoAction } from "../../actions";
import { EstadiaList } from "../EstadiaList";

export const dynamic = "force-dynamic";

export default async function AlojamientosAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const items = await readAlojamientos();

  return (
    <EstadiaList
      items={items}
      adminBase="/admin/alojamientos"
      nounSingular="alojamiento"
      nounPlural="alojamientos"
      error={!!error}
      moverAction={moverAlojamientoAction}
      duplicarAction={duplicarAlojamientoAction}
      deleteAction={deleteAlojamientoAction}
    />
  );
}
