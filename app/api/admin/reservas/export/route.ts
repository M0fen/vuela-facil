import { requireAdmin } from "@/app/admin/guard";
import { listReservas } from "@/lib/store";

export const dynamic = "force-dynamic";

const esc = (v: unknown): string => {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return new Response("No autorizado", { status: 401 });
  }

  const reservas = await listReservas();
  const cols = [
    "createdAt",
    "estado",
    "destino",
    "fecha",
    "viajeros",
    "totalEstimado",
    "nombre",
    "telefono",
    "email",
    "mensaje",
    "notas",
    "id",
  ] as const;

  const filas = reservas.map((r) => cols.map((c) => esc(r[c as keyof typeof r])).join(","));
  const csv = "﻿" + [cols.join(","), ...filas].join("\r\n");

  const fecha = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="reservas-${fecha}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
