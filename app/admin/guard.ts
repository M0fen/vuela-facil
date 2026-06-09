import "server-only";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

/** Defensa en profundidad para Server Actions (además del middleware). */
export async function requireAdmin(): Promise<void> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!(await verifyToken(token))) throw new Error("No autorizado");
}
