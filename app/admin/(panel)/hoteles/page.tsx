import { readHoteles } from "@/lib/store";
import { deleteHotelAction, duplicarHotelAction, moverHotelAction } from "../../actions";
import { EstadiaList } from "../EstadiaList";

export const dynamic = "force-dynamic";

export default async function HotelesAdmin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const items = await readHoteles();

  return (
    <EstadiaList
      items={items}
      adminBase="/admin/hoteles"
      nounSingular="hotel"
      nounPlural="hoteles"
      error={!!error}
      moverAction={moverHotelAction}
      duplicarAction={duplicarHotelAction}
      deleteAction={deleteHotelAction}
    />
  );
}
