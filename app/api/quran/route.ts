import { NextResponse } from "next/server";

const API_BASE = "https://api.alquran.cloud/v1";
const ALLOWED = /^(surah|juz|search|ayah|edition)(\/|$)/;

export async function GET(request: Request) {
  const path = new URL(request.url).searchParams.get("path")?.replace(/^\/+/, "") ?? "";
  if (!ALLOWED.test(path)) {
    return NextResponse.json({ error: "Invalid Quran path." }, { status: 400 });
  }
  const res = await fetch(`${API_BASE}/${path}`, {
    next: { revalidate: 86400 },
    headers: { Accept: "application/json" },
  });
  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: { "content-type": res.headers.get("content-type") || "application/json" },
  });
}
