import { NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth";
import { jsonError } from "@/lib/lms/http";
import { createUserAccount } from "@/lib/lms/users";
import { dashboardPath } from "@/lib/lms/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = String(body.role || "STUDENT").toUpperCase();
    if (role !== "STUDENT") {
      return NextResponse.json({ error: "Public signup is for students only. Teachers are created by Admin." }, { status: 400 });
    }
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: "Name, email and password are required." }, { status: 400 });
    }
    if (String(body.password).length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    const user = await createUserAccount({
      name: String(body.name || ""),
      email: String(body.email || ""),
      password: String(body.password || ""),
      phone: body.phone ? String(body.phone) : undefined,
      role: "STUDENT",
    });
    const session = await createSession(user.id);
    const response = NextResponse.json({ user, redirect: dashboardPath("STUDENT") });
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
