import { prisma } from "@/lib/prisma";
import type { PublicUser } from "@/lib/auth";
import { studentClassIds, teacherClassIds } from "@/lib/lms/http";
import { averageAttendance, todayAttendanceRate } from "@/lib/lms/attendance";
import { HttpError } from "@/lib/lms/types";

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function lastNDays(n: number) {
  const days: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

export async function dashboardFor(user: PublicUser) {
  if (user.role === "USER") throw new HttpError(403, "Unauthorized access");
  if (user.role === "ADMIN") return adminDashboard();
  if (user.role === "TEACHER") return teacherDashboard(user);
  return studentDashboard(user);
}

async function adminDashboard() {
  const [students, teachers, classes, activeClasses, quizzes, assignments, pendingAssignments, avgAttendance] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.user.count({ where: { role: "TEACHER" } }),
    prisma.class.count(),
    prisma.class.count({ where: { status: "ACTIVE" } }),
    prisma.quiz.count(),
    prisma.assignment.count(),
    prisma.assignment.count({ where: { status: "PUBLISHED" } }),
    averageAttendance(),
  ]);

  const classList = await prisma.class.findMany({
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: "asc" },
  });
  const enrollment = classList.map((item) => ({ label: item.name, value: item._count.members }));

  const days = lastNDays(14);
  const attendanceRows = await prisma.attendance.findMany({ where: { date: { in: days } } });
  const attendanceTrends = days.map((date) => {
    const rows = attendanceRows.filter((row) => row.date === date);
    const present = rows.filter((row) => row.status === "PRESENT").length;
    return { label: date.slice(5), value: rows.length ? Math.round((present / rows.length) * 100) : 0 };
  });

  const quizAttempts = await prisma.quizAttempt.findMany({ where: { status: "SUBMITTED" }, include: { quiz: true } });
  const quizPerformance = (await prisma.quiz.findMany({ take: 8, orderBy: { createdAt: "desc" } })).map((quiz) => {
    const attempts = quizAttempts.filter((item) => item.quizId === quiz.id);
    const avg = attempts.length ? attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length : 0;
    return { label: quiz.title, value: Math.round(avg * 10) / 10 };
  });

  const assignmentRows = await prisma.assignment.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { submissions: true } }, class: { include: { _count: { select: { members: true } } } } },
  });
  const assignmentSubmissions = assignmentRows.map((item) => ({
    label: item.title,
    value: item._count.submissions,
    total: item.class._count.members,
  }));

  return {
    stats: {
      totalStudents: students,
      totalTeachers: teachers,
      totalClasses: classes,
      activeClasses,
      totalQuizzes: quizzes,
      totalAssignments: assignments,
      averageAttendance: avgAttendance,
      pendingAssignments,
    },
    charts: { enrollment, attendanceTrends, quizPerformance, assignmentSubmissions },
  };
}

async function teacherDashboard(user: PublicUser) {
  const classIds = await teacherClassIds(user);
  const [myClasses, totalStudents, activeQuizzes, pendingAssignments, today, avgAttendance] = await Promise.all([
    prisma.class.count({ where: { teacherId: user.id } }),
    prisma.classMember.count({ where: { classId: { in: classIds } } }),
    prisma.quiz.count({ where: { teacherId: user.id, status: "PUBLISHED" } }),
    prisma.assignment.count({ where: { teacherId: user.id, status: "PUBLISHED" } }),
    todayAttendanceRate(classIds),
    averageAttendance(classIds),
  ]);
  const recentSubmissions = await prisma.assignmentSubmission.findMany({
    where: { assignment: { teacherId: user.id } },
    include: { student: true, assignment: true },
    orderBy: { submittedAt: "desc" },
    take: 6,
  });
  const days = lastNDays(14);
  const attendanceRows = await prisma.attendance.findMany({ where: { classId: { in: classIds }, date: { in: days } } });
  const attendanceTrends = days.map((date) => {
    const rows = attendanceRows.filter((row) => row.date === date);
    const present = rows.filter((row) => row.status === "PRESENT").length;
    return { label: date.slice(5), value: rows.length ? Math.round((present / rows.length) * 100) : 0 };
  });
  const quizzes = await prisma.quiz.findMany({ where: { teacherId: user.id }, include: { attempts: true } });
  const quizPerformance = quizzes.map((quiz) => {
    const submitted = quiz.attempts.filter((item) => item.status === "SUBMITTED");
    const avg = submitted.length ? submitted.reduce((sum, item) => sum + item.score, 0) / submitted.length : 0;
    return { label: quiz.title, value: Math.round(avg * 10) / 10 };
  });
  const assignments = await prisma.assignment.findMany({
    where: { teacherId: user.id },
    include: { _count: { select: { submissions: true } } },
  });
  return {
    stats: {
      myClasses,
      totalStudents,
      todaysAttendance: today.percentage,
      activeQuizzes,
      pendingAssignments,
      averageAttendance: avgAttendance,
    },
    recentSubmissions: recentSubmissions.map((item) => ({
      ...item,
      student: { id: item.student.id, name: item.student.name },
    })),
    charts: {
      attendanceTrends,
      quizPerformance,
      assignmentPerformance: assignments.map((item) => ({ label: item.title, value: item._count.submissions })),
    },
  };
}

async function studentDashboard(user: PublicUser) {
  const classIds = await studentClassIds(user.id);
  const [enrolledClasses, upcomingQuizzes, pendingAssignments, announcements] = await Promise.all([
    prisma.class.findMany({
      where: { id: { in: classIds } },
      include: { teacher: true },
    }),
    prisma.quiz.findMany({
      where: { classId: { in: classIds }, status: "PUBLISHED" },
      include: { class: true, attempts: { where: { studentId: user.id } } },
      orderBy: { startDate: "asc" },
      take: 5,
    }),
    prisma.assignment.findMany({
      where: { classId: { in: classIds }, status: "PUBLISHED" },
      include: { class: true, submissions: { where: { studentId: user.id } } },
      orderBy: { dueDate: "asc" },
      take: 5,
    }),
    prisma.announcement.findMany({
      where: { classId: { in: classIds }, publishDate: { lte: new Date() } },
      include: { class: true },
      orderBy: { publishDate: "desc" },
      take: 5,
    }),
  ]);
  const attendance = await prisma.attendance.findMany({ where: { studentId: user.id } });
  const present = attendance.filter((row) => row.status === "PRESENT").length;
  const applicable = attendance.filter((row) => row.status !== "LEAVE").length;
  const percentage = applicable ? Math.round((present / applicable) * 1000) / 10 : 0;
  const results = await prisma.quizAttempt.findMany({
    where: { studentId: user.id, status: "SUBMITTED" },
    include: { quiz: { include: { class: true } } },
    orderBy: { submittedAt: "desc" },
    take: 5,
  });
  return {
    stats: {
      enrolledClasses: enrolledClasses.length,
      upcomingQuizzes: upcomingQuizzes.filter((item) => !item.attempts.some((attempt) => attempt.status === "SUBMITTED")).length,
      pendingAssignments: pendingAssignments.filter((item) => item.submissions.length === 0).length,
      attendancePercentage: percentage,
    },
    classes: enrolledClasses,
    upcomingQuizzes,
    pendingAssignments,
    recentResults: results,
    announcements,
  };
}

export async function reportsFor(user: PublicUser) {
  const classIds = user.role === "ADMIN" ? undefined : await teacherClassIds(user);
  const classes = await prisma.class.findMany({
    where: classIds ? { id: { in: classIds } } : undefined,
    include: {
      teacher: true,
      _count: { select: { members: true } },
    },
  });
  const quizzes = await prisma.quiz.findMany({
    where: classIds ? { classId: { in: classIds } } : undefined,
    include: { attempts: true, class: true },
  });
  const assignments = await prisma.assignment.findMany({
    where: classIds ? { classId: { in: classIds } } : undefined,
    include: { submissions: true, class: true, _count: { select: { submissions: true } } },
  });
  const attendance = await prisma.attendance.groupBy({
    by: ["classId", "status"],
    where: classIds ? { classId: { in: classIds } } : undefined,
    _count: { _all: true },
  });
  return {
    classes: classes.map((item) => ({
      id: item.id,
      name: item.name,
      subject: item.subject,
      teacher: item.teacher?.name || "Unassigned",
      students: item._count.members,
      status: item.status,
    })),
    quizzes: quizzes.map((item) => {
      const submitted = item.attempts.filter((attempt) => attempt.status === "SUBMITTED");
      const avg = submitted.length ? submitted.reduce((sum, attempt) => sum + attempt.score, 0) / submitted.length : 0;
      return { id: item.id, title: item.title, className: item.class.name, attempts: submitted.length, average: Math.round(avg * 10) / 10 };
    }),
    assignments: assignments.map((item) => ({
      id: item.id,
      title: item.title,
      className: item.class.name,
      submissions: item._count.submissions,
      graded: item.submissions.filter((row) => row.status === "GRADED").length,
    })),
    attendance,
    generatedAt: new Date().toISOString(),
  };
}

export function monthLabel(date: Date) {
  return monthKey(date);
}
