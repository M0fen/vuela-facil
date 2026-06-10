"use client";

import { useEffect } from "react";
import { recordVisto } from "@/lib/vistos";

/** Registra la visita a un paquete (página de detalle) en "vistos recientemente". */
export function TrackView({ id }: { id: string }) {
  useEffect(() => {
    recordVisto(id);
  }, [id]);
  return null;
}
