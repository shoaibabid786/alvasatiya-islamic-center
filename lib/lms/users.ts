import { prisma } from "@/lib/prisma";
import { hashPassword, randomToken, toPublicUser, verifyPassword } from "@/lib/auth";
import { HttpError, generateStudentCode, type PublicUser, type Role } from "@/lib/lms/types";
import { verifyGoogleIdToken } from "@/lib/lms/google-auth";
import {
  changePasswordSchema,
  profileSchema,
  studentCreateSchema,
  studentUpdateSchema,
  teacherCreateSchema,
  teacherUpdateSchema,
} from "@/lib/lms/schemas";
import { removeUserFromFirebase, syncUserToFirebase } from "@/lib/firebase/user-sync";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createUserAccount(input: {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  role: Role;
  status?: string;
  qualification?: string | null;
  experience?: string | null;
  studentCode?: string | null;
  dateOfBirth?: string | null;
}) {
  const email = normalizeEmail(input.email);
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw new HttpError(400, "An account with this email already exists.");
  const studentCode =
    input.role === "STUDENT" ? input.studentCode?.trim() || generateStudentCode() : input.studentCode || null;
  if (studentCode) {
    const taken = await prisma.user.findUnique({ where: { studentCode } });
    if (taken) throw new HttpError(400, "Student ID is already in use.");
  }
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash: hashPassword(input.password),
      phone: input.phone?.trim() || null,
      role: input.role,
      status: input.status || "ACTIVE",
      qualification: input.qualification || null,
      experience: input.experience || null,
      studentCode,
      dateOfBirth: input.dateOfBirth || null,
    },
  });
  await syncUserToFirebase(user, { password: input.password });
  return toPublicUser(user);
}

export async function loginAccount(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizeEmail(email) }, { username: email.trim() }],
    },
  });
  if (!user || !verifyPassword(password, user.passwordHash)) throw new HttpError(401, "Invalid credentials");
  if (user.status === "SUSPENDED") throw new HttpError(403, "This account is suspended. Please contact the office.");
  if (user.status === "INACTIVE") throw new HttpError(403, "This account is inactive.");
  return user;
}

export async function loginWithGoogle(idToken: string) {
  const google = await verifyGoogleIdToken(idToken);
  const existing = await prisma.user.findUnique({ where: { email: google.email } });
  if (existing) {
    if (existing.role === "STUDENT" || existing.role === "ADMIN" || existing.role === "TEACHER") {
      throw new HttpError(
        403,
        existing.role === "STUDENT"
          ? "Google sign-in does not register student accounts. Students sign in with email and password."
          : "This email belongs to a staff account. Sign in with email and password.",
      );
    }
    if (existing.status === "SUSPENDED") throw new HttpError(403, "This account is suspended. Please contact the office.");
    if (existing.status === "INACTIVE") throw new HttpError(403, "This account is inactive.");
    if (!existing.profilePicture && google.photoUrl) {
      return prisma.user.update({
        where: { id: existing.id },
        data: {
          name: existing.name || google.name,
          profilePicture: google.photoUrl,
        },
      });
    }
    return existing;
  }

  const created = await prisma.user.create({
    data: {
      name: google.name,
      email: google.email,
      passwordHash: hashPassword(randomToken()),
      role: "USER",
      status: "ACTIVE",
      profilePicture: google.photoUrl,
    },
  });
  await syncUserToFirebase(created);
  return created;
}

export async function listUsers(role: Role, q = "", status = "", page = 1, pageSize = 10) {
  const where = {
    role,
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
            { studentCode: { contains: q } },
          ],
        }
      : {}),
  };
  const [total, rows] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { total, page, pageSize, users: rows.map(toPublicUser) };
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      taughtClasses: true,
      memberships: { include: { class: true } },
    },
  });
  if (!user) throw new HttpError(404, "User not found.");
  return {
    ...toPublicUser(user),
    classes: user.role === "TEACHER" ? user.taughtClasses : user.memberships.map((item: any) => item.class),
  };
}

export async function createTeacher(body: unknown) {
  const data = teacherCreateSchema.parse(body);
  return createUserAccount({ ...data, role: "TEACHER" });
}

export async function updateTeacher(id: string, body: unknown) {
  const data = teacherUpdateSchema.parse(body);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "TEACHER") throw new HttpError(404, "Teacher not found.");
  if (data.email && normalizeEmail(data.email) !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email: normalizeEmail(data.email) } });
    if (exists) throw new HttpError(400, "Email already in use.");
  }
  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: data.name ?? user.name,
      email: data.email ? normalizeEmail(data.email) : user.email,
      phone: data.phone === undefined ? user.phone : data.phone,
      qualification: data.qualification === undefined ? user.qualification : data.qualification,
      experience: data.experience === undefined ? user.experience : data.experience,
      status: data.status ?? user.status,
      passwordHash: data.password ? hashPassword(data.password) : user.passwordHash,
    },
  });
  if (data.classIds) {
    await prisma.class.updateMany({ where: { teacherId: id }, data: { teacherId: null } });
    if (data.classIds.length) {
      await prisma.class.updateMany({ where: { id: { in: data.classIds } }, data: { teacherId: id } });
    }
  }
  await syncUserToFirebase(updated, { password: data.password });
  return toPublicUser(updated);
}

export async function deleteUser(id: string, role: Role) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== role) throw new HttpError(404, `${role === "TEACHER" ? "Teacher" : "Student"} not found.`);
  if (user.role === "ADMIN") throw new HttpError(400, "Admin accounts cannot be deleted here.");
  await prisma.user.delete({ where: { id } });
  await removeUserFromFirebase(user);
  return { ok: true, message: role === "TEACHER" ? "Teacher deleted successfully" : "Student deleted successfully" };
}

export async function setUserStatus(id: string, status: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new HttpError(404, "User not found.");
  if (user.role === "ADMIN") throw new HttpError(400, "The primary admin status cannot be changed this way.");
  const updated = await prisma.user.update({ where: { id }, data: { status } });
  await syncUserToFirebase(updated);
  return toPublicUser(updated);
}

export async function createStudent(body: unknown) {
  const data = studentCreateSchema.parse(body);
  return createUserAccount({ ...data, role: "STUDENT" });
}

export async function updateStudent(id: string, body: unknown) {
  const data = studentUpdateSchema.parse(body);
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "STUDENT") throw new HttpError(404, "Student not found.");
  if (data.email && normalizeEmail(data.email) !== user.email) {
    const exists = await prisma.user.findUnique({ where: { email: normalizeEmail(data.email) } });
    if (exists) throw new HttpError(400, "Email already in use.");
  }
  if (data.studentCode && data.studentCode !== user.studentCode) {
    const taken = await prisma.user.findUnique({ where: { studentCode: data.studentCode } });
    if (taken) throw new HttpError(400, "Student ID is already in use.");
  }
  const updated = await prisma.user.update({
    where: { id },
    data: {
      name: data.name ?? user.name,
      email: data.email ? normalizeEmail(data.email) : user.email,
      phone: data.phone === undefined ? user.phone : data.phone,
      dateOfBirth: data.dateOfBirth === undefined ? user.dateOfBirth : data.dateOfBirth,
      studentCode: data.studentCode === undefined ? user.studentCode : data.studentCode,
      status: data.status ?? user.status,
      passwordHash: data.password ? hashPassword(data.password) : user.passwordHash,
    },
  });
  if (data.classIds) {
    await prisma.classMember.deleteMany({ where: { studentId: id } });
    if (data.classIds.length) {
      await prisma.classMember.createMany({
        data: data.classIds.map((classId) => ({ classId, studentId: id })),
      });
    }
  }
  await syncUserToFirebase(updated, { password: data.password });
  return toPublicUser(updated);
}

export async function updateProfile(user: PublicUser, body: unknown) {
  const data = profileSchema.parse(body);
  const current = await prisma.user.findUnique({ where: { id: user.id } });
  if (!current) throw new HttpError(404, "User not found.");
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name ?? current.name,
      phone: data.phone === undefined ? current.phone : data.phone,
      qualification: user.role === "TEACHER" && data.qualification !== undefined ? data.qualification : current.qualification,
      experience: user.role === "TEACHER" && data.experience !== undefined ? data.experience : current.experience,
      dateOfBirth: user.role === "STUDENT" && data.dateOfBirth !== undefined ? data.dateOfBirth : current.dateOfBirth,
      profilePicture: data.profilePicture === undefined ? current.profilePicture : data.profilePicture,
    },
  });
  await syncUserToFirebase(updated);
  return toPublicUser(updated);
}

export async function changePassword(user: PublicUser, body: unknown) {
  const data = changePasswordSchema.parse(body);
  const current = await prisma.user.findUnique({ where: { id: user.id } });
  if (!current || !verifyPassword(data.currentPassword, current.passwordHash)) {
    throw new HttpError(400, "Current password is incorrect.");
  }
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashPassword(data.newPassword) } });
  return { ok: true, message: "Password updated successfully" };
}

export async function studentDetail(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "STUDENT") throw new HttpError(404, "Student not found.");
  const memberships = await prisma.classMember.findMany({
    where: { studentId: id },
    include: { class: { include: { teacher: true } } },
  });
  const attendance = await prisma.attendance.findMany({
    where: { studentId: id },
    include: { class: true },
    orderBy: { date: "desc" },
  });
  const present = attendance.filter((row) => row.status === "PRESENT").length;
  const attempts = await prisma.quizAttempt.findMany({
    where: { studentId: id, status: "SUBMITTED" },
    include: { quiz: { include: { class: true } } },
    orderBy: { submittedAt: "desc" },
  });
  const submissions = await prisma.assignmentSubmission.findMany({
    where: { studentId: id },
    include: { assignment: { include: { class: true } } },
    orderBy: { submittedAt: "desc" },
  });
  return {
    user: toPublicUser(user),
    classes: memberships.map((item) => item.class),
    attendance,
    attendanceSummary: {
      total: attendance.length,
      present,
      absent: attendance.filter((row) => row.status === "ABSENT").length,
      late: attendance.filter((row) => row.status === "LATE").length,
      leave: attendance.filter((row) => row.status === "LEAVE").length,
      percentage: attendance.length ? Math.round((present / attendance.length) * 1000) / 10 : 0,
    },
    quizzes: attempts,
    assignments: submissions,
  };
}

export async function teacherDetail(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "TEACHER") throw new HttpError(404, "Teacher not found.");
  const classes = await prisma.class.findMany({
    where: { teacherId: id },
    include: { _count: { select: { members: true, quizzes: true, assignments: true } } },
  });
  const quizzes = await prisma.quiz.count({ where: { teacherId: id } });
  const assignments = await prisma.assignment.count({ where: { teacherId: id } });
  const announcements = await prisma.announcement.count({ where: { authorId: id } });
  return {
    user: toPublicUser(user),
    classes,
    activity: { quizzes, assignments, announcements, classes: classes.length },
  };
}
