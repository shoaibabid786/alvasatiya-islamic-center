import { NextResponse } from "next/server";
import { createSession, sessionCookieOptions, SESSION_COOKIE, toPublicUser } from "@/lib/auth";
import { jsonError } from "@/lib/lms/http";
import { loginSchema } from "@/lib/lms/schemas";
import { dashboardPath } from "@/lib/lms/types";
import { loginAccount } from "@/lib/lms/users";
import { ensureDemoAccounts } from "@/lib/lms/ensure-demo-accounts";

export async function POST(request: Request) {
  try {
    void ensureDemoAccounts();
    const body = await request.json();
    const data = loginSchema.parse(body);
    const user = await loginAccount(data.email, data.password);
    if (data.expectedRole && user.role !== data.expectedRole) {
      return NextResponse.json(
        { error: `This account is not a ${data.expectedRole.toLowerCase()} login.` },
        { status: 403 }
      );
    }
    const session = await createSession(user.id, Boolean(data.remember));
    const publicUser = toPublicUser(user);
    const response = NextResponse.json({ user: publicUser, redirect: dashboardPath(publicUser.role) });
    response.cookies.set(SESSION_COOKIE, session.token, sessionCookieOptions(session.expiresAt));
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
