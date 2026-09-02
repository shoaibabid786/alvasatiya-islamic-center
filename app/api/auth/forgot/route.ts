import { NextResponse } from "next/server";
import { requestPasswordReset } from "@/lib/lms";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "");
  if (email) requestPasswordReset(email);
  return NextResponse.json({
    message: "If this email is registered, the office can complete a password reset. Please check your inbox or contact Alvasatiya.",
  });
}
