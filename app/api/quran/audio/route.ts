import { NextResponse } from "next/server";

const ALLOWED_HOSTS = new Set([
  "everyayah.com",
  "www.everyayah.com",
  "cdn.islamic.network",
  "download.quranicaudio.com",
  "verses.quran.com",
]);

export async function GET(request: Request) {
  const src = new URL(request.url).searchParams.get("src") || "";
  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return NextResponse.json({ error: "Invalid audio URL." }, { status: 400 });
  }
  if (parsed.protocol !== "https:" || !ALLOWED_HOSTS.has(parsed.hostname)) {
    return NextResponse.json({ error: "Audio host is not allowed." }, { status: 400 });
  }
  const res = await fetch(parsed, { cache: "force-cache" });
  if (!res.ok) return NextResponse.json({ error: "Audio not found." }, { status: res.status });
  return new NextResponse(res.body, {
    status: 200,
    headers: {
      "content-type": res.headers.get("content-type") || "audio/mpeg",
      "cache-control": "public, max-age=86400, immutable",
    },
  });
}
