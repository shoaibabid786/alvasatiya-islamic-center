import { NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/auth";
import { verifyPaymentById } from "@/lib/lms";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const paymentId = String(body.paymentId || body.id || "");
  const signature = String(body.signature || request.headers.get("x-webhook-signature") || "");
  if (!paymentId || !signature) {
    return NextResponse.json({ error: "Missing paymentId or signature." }, { status: 400 });
  }
  if (!verifyPaymentSignature(paymentId, signature)) {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
  }
  try {
    const result = verifyPaymentById(paymentId);
    return NextResponse.json({ ok: true, already: result.already });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Webhook failed." }, { status: 400 });
  }
}
