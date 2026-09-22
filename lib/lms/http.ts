import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { HttpError, type PublicUser, type Role } from "@/lib/lms/types";
import { prisma } from "@/lib/prisma";

export async function requireApiUser(roles?: Role[]) {
  const user = await getSessionUser();
  if (!user) throw new HttpError(401, "Please sign in.");
  if (user.status !== "ACTIVE") throw new HttpError(403, "This account is not active.");
  if (roles && !roles.includes(user.role)) throw new HttpError(403, "Unauthorized access");
  return user;
}

function readableError(error: unknown) {
  if (error instanceof HttpError) return error.message;
  if (error && typeof error === "object" && "issues" in error && Array.isArray((error as { issues: unknown[] }).issues)) {
    const messages = (error as { issues: Array<{ message?: string }> }).issues
      .map((issue) => issue.message)
      .filter((message): message is string => Boolean(message));
    if (messages.length) return messages.join(" ");
  }
  if (error instanceof Error && error.message && !error.message.includes("invalid_format")) {
    if (/UNAUTHENTICATED|invalid_grant|invalid jwt|OAuth2/i.test(error.message)) {
      return "Could not sign in. Please try again.";
    }
    return error.message;
  }
  return "Please check the form and try again.";
}

export function jsonError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json({ error: error.message }, { status: error.status });
  }
  return NextResponse.json({ error: readableError(error) }, { status: 400 });
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export async function teacherClassIds(user: PublicUser) {
  if (user.role === "ADMIN") {
    const classes = await prisma.class.findMany({ select: { id: true } });
    return classes.map((item) => item.id);
  }
  const classes = await prisma.class.findMany({ where: { teacherId: user.id }, select: { id: true } });
  return classes.map((item) => item.id);
}

export async function studentClassIds(userId: string) {
  const rows = await prisma.classMember.findMany({ where: { studentId: userId }, select: { classId: true } });
  return rows.map((row) => row.classId);
}

export async function assertClassAccess(user: PublicUser, classId: string, mode: "manage" | "view" = "view") {
  const classRow = await prisma.class.findUnique({ where: { id: classId } });
  if (!classRow) throw new HttpError(404, "Class not found");
  if (user.role === "ADMIN") return classRow;
  if (user.role === "TEACHER") {
    if (classRow.teacherId !== user.id) throw new HttpError(403, "Unauthorized access");
    return classRow;
  }
  if (mode === "manage") throw new HttpError(403, "Unauthorized access");
  const member = await prisma.classMember.findUnique({
    where: { classId_studentId: { classId, studentId: user.id } },
  });
  if (!member) throw new HttpError(403, "Unauthorized access");
  return classRow;
}

export function parseSearch(url: string) {
  const { searchParams } = new URL(url);
  return {
    q: searchParams.get("q")?.trim() || "",
    page: Math.max(1, Number(searchParams.get("page") || 1)),
    pageSize: Math.min(50, Math.max(5, Number(searchParams.get("pageSize") || 10))),
    status: searchParams.get("status") || "",
    classId: searchParams.get("classId") || "",
    date: searchParams.get("date") || "",
    sort: searchParams.get("sort") || "",
  };
}

export function skipTake(page: number, pageSize: number) {
  return { skip: (page - 1) * pageSize, take: pageSize };
}
