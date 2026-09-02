import { prisma } from "@/lib/prisma";
import { toPublicUser, type PublicUser } from "@/lib/auth";
import { attendanceSaveSchema } from "@/lib/lms/schemas";
import { attendancePercent, HttpError } from "@/lib/lms/types";
import { assertClassAccess, studentClassIds, teacherClassIds } from "@/lib/lms/http";

export async function rosterForDate(user: PublicUser, classId: string, date: string) {
  await assertClassAccess(user, classId, user.role === "STUDENT" ? "view" : "manage");
  const members = await prisma.classMember.findMany({
    where: { classId },
    include: { student: true },
    orderBy: { student: { name: "asc" } },
  });
  const records = await prisma.attendance.findMany({ where: { classId, date } });
  const map = new Map(records.map((row) => [row.studentId, row]));
  return members.map((member) => ({
    student: toPublicUser(member.student),
    status: map.get(member.studentId)?.status || "",
    recordId: map.get(member.studentId)?.id || null,
  }));
}

export async function saveAttendance(user: PublicUser, body: unknown) {
  const data = attendanceSaveSchema.parse(body);
  await assertClassAccess(user, data.classId, "manage");
  for (const record of data.records) {
    await prisma.attendance.upsert({
      where: {
        classId_studentId_date: { classId: data.classId, studentId: record.studentId, date: data.date },
      },
      update: { status: record.status },
      create: { classId: data.classId, studentId: record.studentId, date: data.date, status: record.status },
    });
  }
  return { ok: true, message: "Attendance saved successfully" };
}

export async function listAttendance(user: PublicUser, classId?: string, date?: string, q = "") {
  const classIds =
    user.role === "STUDENT" ? await studentClassIds(user.id) : user.role === "TEACHER" ? await teacherClassIds(user) : undefined;
  const where = {
    ...(classIds ? { classId: { in: classIds } } : {}),
    ...(classId ? { classId } : {}),
    ...(date ? { date } : {}),
    ...(user.role === "STUDENT" ? { studentId: user.id } : {}),
    ...(q ? { student: { name: { contains: q } } } : {}),
  };
  const rows = await prisma.attendance.findMany({
    where,
    include: { student: true, class: true },
    orderBy: [{ date: "desc" }, { student: { name: "asc" } }],
    take: 400,
  });
  return rows.map((row) => ({
    ...row,
    student: toPublicUser(row.student),
  }));
}

export async function studentAttendanceSummary(studentId: string, classIds?: string[]) {
  const where = { studentId, ...(classIds ? { classId: { in: classIds } } : {}) };
  const rows = await prisma.attendance.findMany({
    where,
    include: { class: true },
    orderBy: { date: "desc" },
  });
  const present = rows.filter((row) => row.status === "PRESENT").length;
  const applicable = rows.filter((row) => row.status !== "LEAVE").length;
  return {
    total: rows.length,
    present,
    absent: rows.filter((row) => row.status === "ABSENT").length,
    late: rows.filter((row) => row.status === "LATE").length,
    leave: rows.filter((row) => row.status === "LEAVE").length,
    percentage: attendancePercent(present, applicable || rows.length),
    history: rows,
  };
}

export async function classAttendanceSummary(classId: string) {
  const rows = await prisma.attendance.findMany({ where: { classId } });
  const present = rows.filter((row) => row.status === "PRESENT").length;
  const applicable = rows.filter((row) => row.status !== "LEAVE").length;
  return {
    total: rows.length,
    present,
    percentage: attendancePercent(present, applicable || rows.length),
  };
}

export async function averageAttendance(classIds?: string[]) {
  const rows = await prisma.attendance.findMany({
    where: classIds ? { classId: { in: classIds } } : undefined,
  });
  const present = rows.filter((row) => row.status === "PRESENT").length;
  const applicable = rows.filter((row) => row.status !== "LEAVE").length;
  return attendancePercent(present, applicable || rows.length);
}

export async function todayAttendanceRate(classIds?: string[]) {
  const date = new Date().toISOString().slice(0, 10);
  const rows = await prisma.attendance.findMany({
    where: { date, ...(classIds ? { classId: { in: classIds } } : {}) },
  });
  const present = rows.filter((row) => row.status === "PRESENT" || row.status === "LATE").length;
  return { date, marked: rows.length, present, percentage: attendancePercent(present, rows.length) };
}
