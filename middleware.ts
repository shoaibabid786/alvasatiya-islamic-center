import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import { readSessionToken } from "@/lib/session-token";
import { dashboardPath, type Role } from "@/lib/lms/types";

const ROLE_PREFIX: Record<string, Role> = {
  admin: "ADMIN",
  teacher: "TEACHER",
  student: "STUDENT",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await readSessionToken(token);
  const first = pathname.split("/")[1];
  const expected = ROLE_PREFIX[first];
  const needsAuth =
    Boolean(expected) ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/pay") ||
    pathname.startsWith("/join");

  if (needsAuth && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (expected && session && session.role !== expected) {
    return NextResponse.redirect(new URL(dashboardPath(session.role), request.url));
  }

  if (pathname === "/signup") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/portal/:path*", "/pay/:path*", "/join/:path*", "/login", "/signup"],
};
