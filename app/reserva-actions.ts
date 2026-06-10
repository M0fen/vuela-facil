"use server";

import { addReserva } from "@/lib/store";

export type ReservaResult = { ok: boolean; id?: string; error?: string };

export async function crearReserva(input: {
  paqueteId: string;
  destino: string;
  fecha: string;
  viajeros: number;
  totalEstimado: number;
  nombre: string;
  telefono: string;
  email?: string;
  mensaje?: string;
}): Promise<ReservaResult> {
  if (!input.nombre?.trim() || !input.telefono?.trim()) {
    return { ok: false, error: "Necesitamos tu nombre y WhatsApp." };
  }
  try {
    const r = await addReserva(input);
    return { ok: true, id: r.id };
  } catch {
    return { ok: false, error: "No se pudo registrar la reserva." };
  }
}
