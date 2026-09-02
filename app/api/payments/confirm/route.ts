import { NextResponse } from "next/server";
import { requireUser, signPayment, verifyPaymentSignature } from "@/lib/auth";
import { checkoutPayload, failPayment, verifyPaymentById } from "@/lib/lms";

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (!user) return NextResponse.json({ error }, { status: 401 });
  const body = await request.json().catch(() => ({}));
  const paymentId = String(body.paymentId || "");
  const payload = checkoutPayload(paymentId);
  if (!payload || payload.payment.userId !== user.id) {
    return NextResponse.json({ error: "Payment not found." }, { status: 404 });
  }
  if (body.cancel) {
    failPayment(paymentId);
    return NextResponse.json({ error: "Payment was cancelled. Enrollment stays inactive." }, { status: 400 });
  }
  const signature = signPayment(paymentId);
  if (!verifyPaymentSignature(paymentId, signature)) {
    return NextResponse.json({ error: "Payment signature could not be verified." }, { status: 400 });
  }
  const result = verifyPaymentById(paymentId);
  return NextResponse.json({
    verified: true,
    already: result.already,
    message: "Payment verified on the server. Your enrollment is now active.",
  });
}
