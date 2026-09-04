import { prisma } from "@/lib/prisma";
import { toPublicUser, type PublicUser } from "@/lib/auth";
import { assignmentSchema, gradeSchema } from "@/lib/lms/schemas";
import { HttpError, isLateSubmission } from "@/lib/lms/types";
import { assertClassAccess, studentClassIds, teacherClassIds } from "@/lib/lms/http";

export async function listAssignments(user: PublicUser, q = "", classId = "", status = "") {
  const classIds =
    user.role === "STUDENT" ? await studentClassIds(user.id) : user.role === "TEACHER" ? await teacherClassIds(user) : undefined;
  const rows = await prisma.assignment.findMany({
    where: {
      ...(classIds ? { classId: { in: classIds } } : {}),
      ...(classId ? { classId } : {}),
      ...(status ? { status } : {}),
      ...(user.role === "STUDENT" ? { status: "PUBLISHED" } : {}),
      ...(q ? { OR: [{ title: { contains: q } }, { class: { name: { contains: q } } }] } : {}),
    },
    include: {
      class: true,
      _count: { select: { submissions: true } },
      submissions: user.role === "STUDENT" ? { where: { studentId: user.id } } : false,
    },
    orderBy: { dueDate: "asc" },
  });
  return rows;
}

export async function getAssignment(user: PublicUser, id: string) {
  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      class: true,
      submissions: { include: { student: true } },
    },
  });
  if (!assignment) throw new HttpError(404, "Assignment not found.");
  await assertClassAccess(user, assignment.classId, user.role === "STUDENT" ? "view" : "manage");
  if (user.role === "STUDENT") {
    return {
      ...assignment,
      submission: assignment.submissions.find((item) => item.studentId === user.id) || null,
      submissions: undefined,
    };
  }
  return {
    ...assignment,
    submissions: assignment.submissions.map((item) => ({ ...item, student: toPublicUser(item.student) })),
  };
}

export async function saveAssignment(user: PublicUser, body: unknown, id?: string) {
  const data = assignmentSchema.parse(body);
  await assertClassAccess(user, data.classId, "manage");
  const payload = {
    title: data.title,
    description: data.description || "",
    classId: data.classId,
    dueDate: new Date(data.dueDate),
    totalMarks: data.totalMarks,
    attachment: data.attachment || null,
    status: data.status || "DRAFT",
  };
  if (id) {
    const current = await prisma.assignment.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Assignment not found.");
    if (user.role === "TEACHER") {
      const classRow = await prisma.class.findUnique({ where: { id: current.classId } });
      if (current.teacherId !== user.id && classRow?.teacherId !== user.id) throw new HttpError(403, "Unauthorized access");
    }
    const updated = await prisma.assignment.update({ where: { id }, data: payload });
    return { ...updated, message: "Assignment updated successfully" };
  }
  const teacherId =
    user.role === "ADMIN"
      ? (await prisma.class.findUnique({ where: { id: data.classId } }))?.teacherId || user.id
      : user.id;
  const created = await prisma.assignment.create({ data: { ...payload, teacherId } });
  return { ...created, message: "Assignment created successfully" };
}

export async function deleteAssignment(user: PublicUser, id: string) {
  const current = await prisma.assignment.findUnique({ where: { id } });
  if (!current) throw new HttpError(404, "Assignment not found.");
  await assertClassAccess(user, current.classId, "manage");
  await prisma.assignment.delete({ where: { id } });
  return { ok: true, message: "Assignment deleted successfully" };
}

export async function submitAssignment(
  user: PublicUser,
  assignmentId: string,
  file: { filePath: string; originalName: string; mimeType: string; fileSize: number },
) {
  if (user.role !== "STUDENT") throw new HttpError(403, "Unauthorized access");
  const assignment = await prisma.assignment.findUnique({ where: { id: assignmentId } });
  if (!assignment) throw new HttpError(404, "Assignment not found.");
  await assertClassAccess(user, assignment.classId, "view");
  if (assignment.status !== "PUBLISHED") throw new HttpError(400, "This assignment is not available.");
  const late = isLateSubmission(assignment.dueDate);
  const existing = await prisma.assignmentSubmission.findUnique({
    where: { assignmentId_studentId: { assignmentId, studentId: user.id } },
  });
  if (existing?.status === "GRADED") throw new HttpError(400, "This submission has already been graded.");
  if (existing && new Date() > assignment.dueDate) throw new HttpError(400, "Assignment deadline passed");
  const status = late ? "LATE" : "SUBMITTED";
  if (existing) {
    const updated = await prisma.assignmentSubmission.update({
      where: { id: existing.id },
      data: { ...file, status, submittedAt: new Date() },
    });
    return { ...updated, message: "Assignment submitted successfully" };
  }
  const created = await prisma.assignmentSubmission.create({
    data: { assignmentId, studentId: user.id, ...file, status },
  });
  return { ...created, message: "Assignment submitted successfully" };
}

export async function gradeSubmission(user: PublicUser, submissionId: string, body: unknown) {
  const data = gradeSchema.parse(body);
  const submission = await prisma.assignmentSubmission.findUnique({
    where: { id: submissionId },
    include: { assignment: true },
  });
  if (!submission) throw new HttpError(404, "Submission not found.");
  await assertClassAccess(user, submission.assignment.classId, "manage");
  if (data.marks > submission.assignment.totalMarks) throw new HttpError(400, "Marks cannot exceed total marks.");
  const updated = await prisma.assignmentSubmission.update({
    where: { id: submissionId },
    data: {
      marks: data.marks,
      feedback: data.feedback || "",
      status: "GRADED",
      gradedAt: new Date(),
    },
  });
  return { ...updated, message: "Assignment graded successfully" };
}
