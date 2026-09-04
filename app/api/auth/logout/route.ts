import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { clearSessionCookie, destroySession, SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  response.headers.set("Cache-Control", "no-store");
  try {
    await destroySession(token);
  } catch {
    // Cookie is already cleared on the response.
  }
  return response;
}
