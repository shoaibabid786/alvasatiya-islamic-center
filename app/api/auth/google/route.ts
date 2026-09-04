import { NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE, toPublicUser } from "@/lib/auth";
import { jsonError } from "@/lib/lms/http";
import { googleLoginSchema } from "@/lib/lms/schemas";
import { loginWithGoogle } from "@/lib/lms/users";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = googleLoginSchema.parse(body);
    const user = await loginWithGoogle(data.idToken);
    const session = await createSession(user.id, Boolean(data.remember));
    const publicUser = toPublicUser(user);
    const response = NextResponse.json({ user: publicUser, redirect: "/" });
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
