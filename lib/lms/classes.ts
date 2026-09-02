import { prisma } from "@/lib/prisma";
import { toPublicUser, type PublicUser } from "@/lib/auth";
import { classSchema, joinClassSchema } from "@/lib/lms/schemas";
import { classJoinUrl, extractClassCode, generateClassCode, HttpError } from "@/lib/lms/types";
import { assertClassAccess } from "@/lib/lms/http";

async function uniqueClassCode() {
  for (let i = 0; i < 12; i++) {
    const code = generateClassCode();
    const exists = await prisma.class.findUnique({ where: { code } });
    if (!exists) return code;
  }
  throw new HttpError(500, "Could not generate a class code.");
}

function classWhere(user: PublicUser, q = "", status = "") {
  return {
    ...(user.role === "TEACHER" ? { teacherId: user.id } : {}),
    ...(user.role === "STUDENT" ? { members: { some: { studentId: user.id } } } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [{ name: { contains: q } }, { subject: { contains: q } }, { code: { contains: q } }],
        }
      : {}),
  };
}

export async function listClasses(user: PublicUser, q = "", status = "", page = 1, pageSize = 10) {
  const where = classWhere(user, q, status);
  const [total, rows] = await Promise.all([
    prisma.class.count({ where }),
    prisma.class.findMany({
      where,
      include: {
        teacher: true,
        _count: { select: { members: true, quizzes: true, assignments: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return {
    total,
    page,
    pageSize,
    classes: rows.map((row) => ({
      ...row,
      joinUrl: classJoinUrl(row.code),
      teacher: row.teacher ? toPublicUser(row.teacher) : null,
    })),
  };
}

export async function getClass(user: PublicUser, id: string) {
  await assertClassAccess(user, id, user.role === "STUDENT" ? "view" : "manage");
  const row = await prisma.class.findUnique({
    where: { id },
    include: {
      teacher: true,
      members: { include: { student: true } },
      quizzes: { orderBy: { createdAt: "desc" } },
      assignments: { orderBy: { createdAt: "desc" } },
      announcements: { orderBy: { publishDate: "desc" }, take: 8 },
    },
  });
  if (!row) throw new HttpError(404, "Class not found");
  return {
    ...row,
    joinUrl: classJoinUrl(row.code),
    teacher: row.teacher ? toPublicUser(row.teacher) : null,
    students: row.members.map((item) => toPublicUser(item.student)),
  };
}

export async function createClass(body: unknown) {
  const data = classSchema.parse(body);
  const code = await uniqueClassCode();
  const created = await prisma.class.create({
    data: {
      name: data.name,
      description: data.description || "",
      subject: data.subject,
      teacherId: data.teacherId || null,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      status: data.status || "ACTIVE",
      code,
    },
  });
  if (data.studentIds?.length) {
    await prisma.classMember.createMany({
      data: data.studentIds.map((studentId) => ({ classId: created.id, studentId })),
    });
  }
  return { ...created, joinUrl: classJoinUrl(created.code), message: "Class created successfully" };
}

export async function updateClass(id: string, body: unknown) {
  const current = await prisma.class.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Class not found");
  const data = classSchema.partial().parse(body);
  const updated = await prisma.class.update({
    where: { id },
    data: {
      name: data.name ?? current.name,
      description: data.description ?? current.description,
      subject: data.subject ?? current.subject,
      teacherId: data.teacherId === undefined ? current.teacherId : data.teacherId,
      startDate: data.startDate === undefined ? current.startDate : data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate === undefined ? current.endDate : data.endDate ? new Date(data.endDate) : null,
      status: data.status ?? current.status,
    },
  });
  if (data.studentIds) {
    await prisma.classMember.deleteMany({ where: { classId: id } });
    if (data.studentIds.length) {
      await prisma.classMember.createMany({
        data: data.studentIds.map((studentId) => ({ classId: id, studentId })),
      });
    }
  }
  return { ...updated, joinUrl: classJoinUrl(updated.code), message: "Class updated successfully" };
}

export async function deleteClass(id: string) {
  const current = await prisma.class.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Class not found");
  await prisma.class.delete({ where: { id } });
  return { ok: true, message: "Class deleted successfully" };
}

export async function addClassStudents(classId: string, studentIds: string[]) {
  const current = await prisma.class.findUnique({ where: { id: classId } });
  if (!current) throw new HttpError(404, "Class not found");
  const unique = [...new Set(studentIds)];
  for (const studentId of unique) {
    const student = await prisma.user.findUnique({ where: { id: studentId } });
    if (!student || student.role !== "STUDENT") throw new HttpError(400, "Invalid student.");
    await prisma.classMember.upsert({
      where: { classId_studentId: { classId, studentId } },
      update: {},
      create: { classId, studentId },
    });
  }
  return { ok: true, message: "Student enrolled successfully" };
}

export async function removeClassStudent(classId: string, studentId: string) {
  await prisma.classMember.deleteMany({ where: { classId, studentId } });
  return { ok: true, message: "Student removed from class" };
}

export async function joinClass(user: PublicUser, body: unknown) {
  if (user.role !== "STUDENT") throw new HttpError(403, "Only students can join classes.");
  const data = joinClassSchema.parse(body);
  const code = extractClassCode(data.code);
  const classRow = await prisma.class.findUnique({ where: { code } });
  if (!classRow) throw new HttpError(404, "Invalid class code");
  if (classRow.status !== "ACTIVE") throw new HttpError(400, "This class is not active.");
  const existing = await prisma.classMember.findUnique({
    where: { classId_studentId: { classId: classRow.id, studentId: user.id } },
  });
  if (existing) throw new HttpError(400, "You are already enrolled in this class");
  await prisma.classMember.create({ data: { classId: classRow.id, studentId: user.id } });
  return { ok: true, class: classRow, message: "Student enrolled successfully" };
}

export async function listTeachersForSelect() {
  const rows = await prisma.user.findMany({
    where: { role: "TEACHER", status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
  return rows.map(toPublicUser);
}

export async function listStudentsForSelect() {
  const rows = await prisma.user.findMany({
    where: { role: "STUDENT", status: "ACTIVE" },
    orderBy: { name: "asc" },
  });
  return rows.map(toPublicUser);
}
