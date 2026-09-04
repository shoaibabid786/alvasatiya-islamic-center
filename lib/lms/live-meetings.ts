import { prisma } from "@/lib/prisma";
import type { PublicUser } from "@/lib/auth";
import { liveMeetingSchema } from "@/lib/lms/schemas";
import { HttpError } from "@/lib/lms/types";
import { assertClassAccess, studentClassIds, teacherClassIds } from "@/lib/lms/http";

function normalizeMeetingUrl(value: string) {
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function extraEmails(row: any) {
  return (Array.isArray(row.studentEmails) ? row.studentEmails : []).map((email: string) => String(email).trim().toLowerCase());
}

function serialize(row: any, forStudent = false) {
  return {
    id: row.id,
    title: row.title,
    meetingUrl: row.meetingUrl,
    startsAt: row.startsAt,
    status: row.status,
    classId: row.classId,
    studentEmails: forStudent ? undefined : extraEmails(row),
    class: row.class
      ? {
          id: row.class.id,
          name: row.class.name,
          subject: row.class.subject,
          teacher: row.class.teacher ? { id: row.class.teacher.id, name: row.class.teacher.name } : null,
        }
      : null,
  };
}

async function resolveExtraStudentsByEmail(emails: string[]) {
  const unique = [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
  if (!unique.length) return { studentEmails: [] as string[], studentIds: [] as string[] };
  const students = await prisma.user.findMany({
    where: { role: "STUDENT", email: { in: unique } },
  });
  const found = new Set(students.map((student) => String(student.email).trim().toLowerCase()));
  const missing = unique.filter((email) => !found.has(email));
  if (missing.length) throw new HttpError(400, `No student account uses this email: ${missing.join(", ")}`);
  return {
    studentEmails: students.map((student) => String(student.email).trim().toLowerCase()),
    studentIds: students.map((student) => student.id),
  };
}

export async function listLiveMeetings(user: PublicUser) {
  const teacherIds = user.role === "TEACHER" ? await teacherClassIds(user) : null;
  if (teacherIds && teacherIds.length === 0) return [];

  const rows = await prisma.liveMeeting.findMany({
    where: {
      ...(teacherIds ? { classId: { in: teacherIds } } : {}),
      ...(user.role === "STUDENT" ? { status: { in: ["SCHEDULED"] } } : {}),
    },
    include: { class: { include: { teacher: true } } },
    orderBy: { startsAt: "asc" },
  });

  if (user.role === "STUDENT") {
    const email = user.email.trim().toLowerCase();
    const classIds = await studentClassIds(user.id);
    return rows
      .filter(
        (row) =>
          classIds.includes(row.classId) ||
          extraEmails(row).includes(email) ||
          (Array.isArray(row.studentIds) && row.studentIds.includes(user.id)),
      )
      .map((row) => serialize(row, true));
  }

  return rows.map((row) => serialize(row));
}

export async function saveLiveMeeting(user: PublicUser, body: unknown, id?: string) {
  if (user.role !== "ADMIN") throw new HttpError(403, "Only an administrator can schedule classes.");
  const data = liveMeetingSchema.parse(body);
  await assertClassAccess(user, data.classId, "manage");
  const assigned = await resolveExtraStudentsByEmail(data.studentEmails || []);
  const payload = {
    classId: data.classId,
    title: data.title,
    meetingUrl: normalizeMeetingUrl(data.meetingUrl),
    startsAt: new Date(data.startsAt),
    status: data.status || "SCHEDULED",
    createdBy: user.id,
    studentEmails: assigned.studentEmails,
    studentIds: assigned.studentIds,
  };
  if (id) {
    const current = await prisma.liveMeeting.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Scheduled class not found.");
    const updated = await prisma.liveMeeting.update({ where: { id }, data: payload });
    return { meeting: updated, message: "Scheduled class updated successfully" };
  }
  const created = await prisma.liveMeeting.create({ data: payload });
  return { meeting: created, message: "Class scheduled successfully" };
}

export async function deleteLiveMeeting(user: PublicUser, id: string) {
  if (user.role !== "ADMIN") throw new HttpError(403, "Only an administrator can remove scheduled classes.");
  const current = await prisma.liveMeeting.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Scheduled class not found.");
  await prisma.liveMeeting.delete({ where: { id } });
  return { ok: true, message: "Scheduled class removed" };
}
