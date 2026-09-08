import { NextResponse } from "next/server";
import { sendInquiryEmail } from "@/lib/inquiries";
import { createDemo } from "@/lib/lms";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const required = ["name", "email", "phone", "country", "courseSlug", "preferredDate", "preferredTime", "timeZone"] as const;
    for (const key of required) {
      if (!String(body[key] || "").trim()) {
        return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
      }
    }
    const demo = createDemo({
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      country: String(body.country).trim(),
      courseSlug: String(body.courseSlug).trim(),
      preferredDate: String(body.preferredDate).trim(),
      preferredTime: String(body.preferredTime).trim(),
      timeZone: String(body.timeZone).trim(),
      message: String(body.message || "").trim(),
    });
    try {
      await sendInquiryEmail("demo", body);
    } catch {
      /* Demo is stored even if inbox delivery is delayed. */
    }
    return NextResponse.json({
      demo: { id: demo.id },
      message: "JazakAllahu Khairan! Your demo request has been submitted. Our team will contact you shortly.",
    });
  } catch {
    return NextResponse.json({ error: "Could not submit the demo request." }, { status: 400 });
  }
}
