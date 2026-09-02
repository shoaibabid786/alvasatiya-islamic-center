import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { startEnrollment } from "@/lib/lms";

export async function POST(request: Request) {
  const { user, error } = await requireUser();
  if (!user) return NextResponse.json({ error }, { status: 401 });
  if (user.role === "ADMIN" || user.role === "TEACHER") {
    return NextResponse.json({ error: "Please use a student account to enroll." }, { status: 400 });
  }
  try {
    const body = await request.json();
    const result = startEnrollment(user, String(body.courseSlug || ""));
    return NextResponse.json({
      enrollmentId: result.enrollment.id,
      paymentId: result.payment.id,
      checkoutPath: `/pay/${result.payment.id}`,
    });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Enrollment failed." }, { status: 400 });
  }
}
