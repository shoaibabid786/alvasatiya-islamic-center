import type { Role } from "@/lib/lms/types";

const AUTH_SECRET = process.env.AUTH_SECRET || "alvasatiya-lms-dev-secret";

function toBase64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hmacHex(value: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(AUTH_SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return toHex(signature);
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function signSessionToken(payload: { sid: string; userId: string; role: string; exp: number }) {
  const body = toBase64Url(JSON.stringify(payload));
  const sig = await hmacHex(body);
  return `${body}.${sig}`;
}

export async function readSessionToken(token?: string | null) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = await hmacHex(body);
  if (!safeEqual(expected, sig)) return null;
  try {
    const payload = JSON.parse(fromBase64Url(body)) as {
      sid: string;
      userId: string;
      role: Role;
      exp: number;
    };
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
