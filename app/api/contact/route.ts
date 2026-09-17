import { NextResponse } from "next/server";
import { INQUIRY_TYPES, sendInquiryEmail, type InquiryType } from "@/lib/inquiries";
import { inboxEmail, isSmtpConfigured } from "@/lib/mail";

export const runtime = "nodejs";
export const maxDuration = 30;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 20;
const hits = new Map<string, number[]>();

function clientIp(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((time) => now - time < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  return false;
}

export async function GET() {
  return NextResponse.json({
    inbox: inboxEmail(),
    smtpConfigured: isSmtpConfigured(),
  });
}

export async function POST(request: Request) {
  try {
    if (rateLimited(clientIp(request))) {
      return NextResponse.json({ error: "Please wait a few minutes before sending another message." }, { status: 429 });
    }
    const body = await request.json().catch(() => ({}));
    const type = String(body.type || "contact") as InquiryType;
    if (!INQUIRY_TYPES.includes(type)) {
      return NextResponse.json({ error: "Unknown form type." }, { status: 400 });
    }
    const result = await sendInquiryEmail(type, body);
    return NextResponse.json({
      ok: true,
      message: "JazakAllahu Khairan. Your message has been sent to Alvasatiya Islamic Center.",
      via: result.via,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not send your message.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
