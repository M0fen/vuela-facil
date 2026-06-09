// Auth mínima para el panel: cookie firmada con HMAC-SHA256 (Web Crypto, así
// funciona tanto en el middleware Edge como en Server Actions/Node). Sin DB.
// El secreto vive en AUTH_SECRET y la contraseña de acceso en ADMIN_PASSWORD.

export const ADMIN_COOKIE = "vf_admin";
const TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function secret(): string {
  return process.env.AUTH_SECRET ?? "dev-insecure-secret";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return toHex(sig);
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Crea un token firmado `exp.firma`. */
export async function createToken(): Promise<string> {
  const exp = String(Date.now() + TTL_MS);
  return `${exp}.${await hmac(exp)}`;
}

/** Verifica firma y expiración. */
export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig) return false;
  const expected = await hmac(exp);
  if (!safeEqual(sig, expected)) return false;
  return Number(exp) > Date.now();
}
