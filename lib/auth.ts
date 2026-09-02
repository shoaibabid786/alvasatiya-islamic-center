import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/session-cookie";
import { HttpError, type PublicUser, type Role } from "@/lib/lms/types";
import { readSessionToken, signSessionToken } from "@/lib/session-token";

export { SESSION_COOKIE, readSessionToken };
export type { PublicUser, Role };

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, stored: string) {
  if (stored.includes("$2a$") || stored.includes("$2b$") || stored.includes("$2y$")) {
    return bcrypt.compareSync(password, stored);
  }
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  const a = Buffer.from(hash);
  const b = Buffer.from(next);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function randomToken() {
  return randomBytes(32).toString("hex");
}

export function paymentSecret() {
  return process.env.PAYMENT_WEBHOOK_SECRET || "alvasatiya-dev-webhook-secret";
}

export function signPayment(paymentId: string) {
  return createHmac("sha256", paymentSecret()).update(paymentId).digest("hex");
}

export function verifyPaymentSignature(paymentId: string, signature: string) {
  const expected = signPayment(paymentId);
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  role: string;
  status: string;
  profilePicture?: string | null;
  qualification?: string | null;
  experience?: string | null;
  studentCode?: string | null;
  dateOfBirth?: string | null;
  createdAt: Date | string;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    phone: user.phone,
    role: user.role as Role,
    status: user.status,
    profilePicture: user.profilePicture,
    qualification: user.qualification,
    experience: user.experience,
    studentCode: user.studentCode,
    dateOfBirth: user.dateOfBirth,
    createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : user.createdAt,
  };
}

export async function createSession(userId: string, remember = false) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new HttpError(401, "Invalid credentials");
  const days = remember ? 30 : 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await prisma.session.deleteMany({ where: { userId, remember: false } });
  const row = await prisma.session.create({
    data: {
      token: randomToken(),
      userId,
      expiresAt,
      remember,
    },
  });
  const token = await signSessionToken({
    sid: row.id,
    userId: user.id,
    role: user.role,
    exp: expiresAt.getTime(),
  });
  return { token, expiresAt: expiresAt.toISOString(), user: toPublicUser(user) };
}

export async function destroySession(token?: string) {
  const payload = await readSessionToken(token);
  if (payload?.sid) {
    await prisma.session.deleteMany({ where: { id: payload.sid } });
  }
}

export async function getSessionUser(): Promise<PublicUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const payload = await readSessionToken(token);
  if (!payload) return null;
  const session = await prisma.session.findFirst({
    where: { id: payload.sid, expiresAt: { gt: new Date() } },
    include: { user: true },
  });
  if (!session) return null;
  return toPublicUser(session.user);
}

export async function requireUser(roles?: Role[]) {
  const user = await getSessionUser();
  if (!user) return { user: null as PublicUser | null, error: "Please sign in." };
  if (roles && !roles.includes(user.role)) return { user: null, error: "You do not have access to this area." };
  return { user, error: null as string | null };
}

export function sessionCookieOptions(expiresAt: string) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    expires: new Date(expiresAt),
    secure: process.env.NODE_ENV === "production",
  };
}
