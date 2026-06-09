"use server";

import { addLead } from "@/lib/store";

export type LeadState = { ok: boolean; error?: string };

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const email = String(formData.get("email") ?? "").trim();
  const telefono = String(formData.get("telefono") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Ingresa un correo válido." };
  }

  try {
    await addLead({ email, telefono, origen: "Tribu Vuela Fácil (newsletter)" });
    return { ok: true };
  } catch {
    return { ok: false, error: "No se pudo guardar. Intenta de nuevo o escríbenos por WhatsApp." };
  }
}
