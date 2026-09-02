import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { checkoutPayload } from "@/lib/lms";

export async function GET(request: Request) {
  const { user, error } = await requireUser();
  if (!user) return NextResponse.json({ error }, { status: 401 });
  const paymentId = new URL(request.url).searchParams.get("id") || "";
  const payload = checkoutPayload(paymentId);
  if (!payload || payload.payment.userId !== user.id) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }
  return NextResponse.json(payload);
}
