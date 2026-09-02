import { getPublishedCourse, getPublishedCourses, createAdminCourse, upsertCourseOverride } from "@/lib/catalog";
import { getPublishedInstitutions, saveInstitutionOverride } from "@/lib/institutions";
import {
  getDb,
  saveDb,
  newId,
  type AcademyDb,
  type DemoRequest,
  type Enrollment,
  type LiveClass,
  type Assignment,
  type Quiz,
  type User,
} from "@/lib/academy-db";
import { hashPassword, signPayment, toPublicUser, verifyPassword } from "@/lib/auth";
import type { PublicUser, Role } from "@/lib/lms/types";

function nowIso() {
  return new Date().toISOString();
}

function firstActiveTeacher(db: AcademyDb) {
  return db.users.find((user) => user.role === "TEACHER" && user.status === "active");
}

export function publicUserById(id: string) {
  const user = getDb().users.find((item) => item.id === id);
  return user ? toPublicUser(user) : null;
}

export function signupStudent(input: { name: string; email: string; password: string; phone?: string }) {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  if (db.users.some((user) => user.email === email)) throw new Error("An account with this email already exists.");
  const user: User = {
    id: newId("user"),
    name: input.name.trim(),
    email,
    phone: input.phone?.trim(),
    passwordHash: hashPassword(input.password),
    role: "STUDENT",
    status: "pending",
    createdAt: nowIso(),
  };
  db.users.push(user);
  saveDb(db);
  return toPublicUser(user);
}

export function loginWithPassword(email: string, password: string) {
  const db = getDb();
  const user = db.users.find((item) => item.email === email.trim().toLowerCase());
  if (!user || !verifyPassword(password, user.passwordHash)) throw new Error("Invalid email or password.");
  if (user.status === "suspended") throw new Error("This account is suspended. Please contact the office.");
  return user;
}

export function requestPasswordReset(email: string) {
  const db = getDb();
  const user = db.users.find((item) => item.email === email.trim().toLowerCase());
  if (!user) return;
  user.resetToken = newId("reset");
  saveDb(db);
}

export function createDemo(input: Omit<DemoRequest, "id" | "status" | "createdAt">) {
  const db = getDb();
  const demo: DemoRequest = { ...input, id: newId("demo"), status: "pending", createdAt: nowIso() };
  db.demos.unshift(demo);
  saveDb(db);
  return demo;
}

export function updateDemo(id: string, patch: Partial<Pick<DemoRequest, "status" | "scheduledAt">>) {
  const db = getDb();
  const demo = db.demos.find((item) => item.id === id);
  if (!demo) throw new Error("Demo request not found.");
  Object.assign(demo, patch);
  saveDb(db);
  return demo;
}

export function startEnrollment(user: PublicUser, courseSlug: string) {
  const course = getPublishedCourse(courseSlug);
  if (!course) throw new Error("Course not found.");
  const db = getDb();
  const existing = db.enrollments.find(
    (item) => item.userId === user.id && item.courseSlug === course.slug && item.status !== "rejected"
  );
  if (existing?.status === "active") throw new Error("You are already enrolled in this course.");
  if (existing?.paymentId) {
    const payment = db.payments.find((item) => item.id === existing.paymentId);
    if (payment && payment.status === "pending") return { enrollment: existing, payment };
  }
  const enrollment: Enrollment = {
    id: newId("enroll"),
    userId: user.id,
    courseSlug: course.slug,
    status: "pending_payment",
    createdAt: nowIso(),
  };
  const payment = {
    id: newId("pay"),
    enrollmentId: enrollment.id,
    userId: user.id,
    courseSlug: course.slug,
    amountLabel: "Enrollment fee — confirmed after office placement (test gateway)",
    status: "pending" as const,
    provider: "test-gateway" as const,
    createdAt: nowIso(),
  };
  enrollment.paymentId = payment.id;
  db.enrollments.unshift(enrollment);
  db.payments.unshift(payment);
  saveDb(db);
  return { enrollment, payment };
}

export function verifyPaymentById(paymentId: string) {
  const db = getDb();
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) throw new Error("Payment not found.");
  if (payment.status === "verified") return { payment, already: true };
  payment.status = "verified";
  payment.verifiedAt = nowIso();
  const enrollment = db.enrollments.find((item) => item.id === payment.enrollmentId);
  if (!enrollment) throw new Error("Enrollment not found for this payment.");
  enrollment.status = "active";
  enrollment.activatedAt = nowIso();
  const teacher = firstActiveTeacher(db);
  if (teacher) enrollment.teacherId = teacher.id;
  const student = db.users.find((item) => item.id === enrollment.userId);
  if (student && student.role === "STUDENT" && student.status !== "suspended") {
    student.status = "active";
  }
  saveDb(db);
  return { payment, enrollment, already: false };
}

export function failPayment(paymentId: string) {
  const db = getDb();
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) throw new Error("Payment not found.");
  payment.status = "failed";
  saveDb(db);
  return payment;
}

export function checkoutPayload(paymentId: string) {
  const db = getDb();
  const payment = db.payments.find((item) => item.id === paymentId);
  if (!payment) return null;
  const course = getPublishedCourse(payment.courseSlug);
  return { payment, courseTitle: course?.title ?? payment.courseSlug };
}

export function adminUpdateUser(id: string, patch: Partial<Pick<User, "status" | "role" | "name">>) {
  const db = getDb();
  const user = db.users.find((item) => item.id === id);
  if (!user) throw new Error("User not found.");
  if (patch.role === "ADMIN" && user.role !== "ADMIN") throw new Error("Admin role cannot be assigned here.");
  if (patch.role && user.role === "ADMIN") throw new Error("The primary admin role cannot be changed.");
  Object.assign(user, patch);
  saveDb(db);
  return toPublicUser(user);
}

export function adminCreateTeacher(input: { name: string; email: string; password: string }) {
  const db = getDb();
  const email = input.email.trim().toLowerCase();
  if (db.users.some((user) => user.email === email)) throw new Error("Email already in use.");
  const user: User = {
    id: newId("user"),
    name: input.name.trim(),
    email,
    passwordHash: hashPassword(input.password),
    role: "TEACHER",
    status: "active",
    createdAt: nowIso(),
  };
  db.users.push(user);
  saveDb(db);
  return toPublicUser(user);
}

export function assignTeacher(enrollmentId: string, teacherId: string) {
  const db = getDb();
  const enrollment = db.enrollments.find((item) => item.id === enrollmentId);
  const teacher = db.users.find((item) => item.id === teacherId && item.role === "TEACHER");
  if (!enrollment || !teacher) throw new Error("Enrollment or teacher not found.");
  enrollment.teacherId = teacher.id;
  saveDb(db);
  return enrollment;
}

export function saveClass(teacher: PublicUser, input: Omit<LiveClass, "id" | "teacherId"> & { id?: string }) {
  const db = getDb();
  if (input.id) {
    const current = db.classes.find((item) => item.id === input.id);
    if (!current) throw new Error("Class not found.");
    if (teacher.role === "TEACHER" && current.teacherId !== teacher.id) throw new Error("Not assigned to this class.");
    Object.assign(current, input, { teacherId: current.teacherId });
    saveDb(db);
    return current;
  }
  const liveClass: LiveClass = { ...input, id: newId("class"), teacherId: teacher.id };
  db.classes.unshift(liveClass);
  saveDb(db);
  return liveClass;
}

export function saveAssignment(teacher: PublicUser, input: Omit<Assignment, "id" | "teacherId"> & { id?: string }) {
  const db = getDb();
  if (input.id) {
    const current = db.assignments.find((item) => item.id === input.id);
    if (!current) throw new Error("Assignment not found.");
    Object.assign(current, input, { teacherId: current.teacherId });
    saveDb(db);
    return current;
  }
  const assignment: Assignment = { ...input, id: newId("assign"), teacherId: teacher.id };
  db.assignments.unshift(assignment);
  saveDb(db);
  return assignment;
}

export function submitAssignment(studentId: string, assignmentId: string, content: string) {
  const db = getDb();
  const assignment = db.assignments.find((item) => item.id === assignmentId);
  if (!assignment) throw new Error("Assignment not found.");
  assertStudentCourse(studentId, assignment.courseSlug);
  const submission = {
    id: newId("sub"),
    assignmentId,
    studentId,
    content,
    submittedAt: nowIso(),
  };
  db.submissions.unshift(submission);
  saveDb(db);
  return submission;
}

export function gradeSubmission(teacher: PublicUser, submissionId: string, grade: string, feedback: string) {
  const db = getDb();
  const submission = db.submissions.find((item) => item.id === submissionId);
  if (!submission) throw new Error("Submission not found.");
  const assignment = db.assignments.find((item) => item.id === submission.assignmentId);
  if (teacher.role === "TEACHER" && assignment?.teacherId !== teacher.id) throw new Error("Not assigned.");
  submission.grade = grade;
  submission.feedback = feedback;
  saveDb(db);
  return submission;
}

export function saveQuiz(teacher: PublicUser, input: Omit<Quiz, "id" | "teacherId"> & { id?: string }) {
  const db = getDb();
  if (input.id) {
    const current = db.quizzes.find((item) => item.id === input.id);
    if (!current) throw new Error("Quiz not found.");
    Object.assign(current, input, { teacherId: current.teacherId });
    saveDb(db);
    return current;
  }
  const quiz: Quiz = { ...input, id: newId("quiz"), teacherId: teacher.id };
  db.quizzes.unshift(quiz);
  saveDb(db);
  return quiz;
}

export function submitQuiz(studentId: string, quizId: string, answers: number[]) {
  const db = getDb();
  const quiz = db.quizzes.find((item) => item.id === quizId);
  if (!quiz) throw new Error("Quiz not found.");
  assertStudentCourse(studentId, quiz.courseSlug);
  const score = quiz.questions.reduce((sum, question, index) => sum + (answers[index] === question.answerIndex ? 1 : 0), 0);
  const attempt = {
    id: newId("attempt"),
    quizId,
    studentId,
    answers,
    score,
    submittedAt: nowIso(),
  };
  db.attempts.unshift(attempt);
  saveDb(db);
  return { ...attempt, total: quiz.questions.length };
}

export function recordAttendance(teacher: PublicUser, classId: string, studentId: string, present: boolean) {
  const db = getDb();
  const liveClass = db.classes.find((item) => item.id === classId);
  if (!liveClass) throw new Error("Class not found.");
  if (teacher.role === "TEACHER" && liveClass.teacherId !== teacher.id) throw new Error("Not assigned.");
  const record = { id: newId("att"), classId, studentId, present, recordedAt: nowIso() };
  db.attendance.unshift(record);
  saveDb(db);
  return record;
}

export function issueCertificate(studentId: string, courseSlug: string) {
  const db = getDb();
  const course = getPublishedCourse(courseSlug);
  if (!course) throw new Error("Course not found.");
  const record = {
    id: newId("cert"),
    studentId,
    courseSlug: course.slug,
    title: `${course.title} Certificate`,
    issuedAt: nowIso(),
  };
  db.certificates.unshift(record);
  saveDb(db);
  return record;
}

export function addFeedback(fromUserId: string, message: string, courseSlug?: string) {
  const db = getDb();
  const item = { id: newId("fb"), fromUserId, message, courseSlug, createdAt: nowIso() };
  db.feedback.unshift(item);
  saveDb(db);
  return item;
}

export function saveAnnouncement(input: { title: string; body: string; audience: Role | "ALL" }) {
  const db = getDb();
  const item = { id: newId("ann"), ...input, createdAt: nowIso() };
  db.announcements.unshift(item);
  saveDb(db);
  return item;
}

function assertStudentCourse(studentId: string, courseSlug: string) {
  const db = getDb();
  const ok = db.enrollments.some(
    (item) => item.userId === studentId && item.courseSlug === courseSlug && item.status === "active"
  );
  if (!ok) throw new Error("This course is not active on your account.");
}

export function studentHasAccess(user: PublicUser) {
  if (user.role !== "STUDENT") return user.status === "active";
  const db = getDb();
  return db.enrollments.some((item) => item.userId === user.id && item.status === "active") && user.status === "active";
}

export function teacherCourseSlugs(teacherId: string) {
  const db = getDb();
  return [...new Set(db.enrollments.filter((item) => item.teacherId === teacherId).map((item) => item.courseSlug))];
}

export function snapshotFor(user: PublicUser) {
  const db = getDb();
  const courses = getPublishedCourses();
  const safeUsers = db.users.map(toPublicUser);
  if (user.role === "ADMIN") {
    return {
      role: user.role,
      user,
      courses,
      users: safeUsers,
      demos: db.demos,
      enrollments: db.enrollments,
      payments: db.payments,
      classes: db.classes,
      assignments: db.assignments,
      submissions: db.submissions,
      quizzes: db.quizzes,
      attempts: db.attempts,
      attendance: db.attendance,
      certificates: db.certificates,
      feedback: db.feedback,
      announcements: db.announcements,
      institutions: getPublishedInstitutions(),
    };
  }
  if (user.role === "TEACHER") {
    const slugs = teacherCourseSlugs(user.id);
    const enrollments = db.enrollments.filter((item) => item.teacherId === user.id);
    const studentIds = new Set(enrollments.map((item) => item.userId));
    return {
      role: user.role,
      user,
      courses: courses.filter((course) => slugs.includes(course.slug)),
      users: safeUsers.filter((item) => item.id === user.id || studentIds.has(item.id)),
      demos: [],
      enrollments,
      payments: [],
      classes: db.classes.filter((item) => item.teacherId === user.id),
      assignments: db.assignments.filter((item) => item.teacherId === user.id),
      submissions: db.submissions.filter((item) => {
        const assignment = db.assignments.find((row) => row.id === item.assignmentId);
        return assignment?.teacherId === user.id;
      }),
      quizzes: db.quizzes.filter((item) => item.teacherId === user.id),
      attempts: db.attempts.filter((item) => {
        const quiz = db.quizzes.find((row) => row.id === item.quizId);
        return quiz?.teacherId === user.id;
      }),
      attendance: db.attendance.filter((item) => {
        const liveClass = db.classes.find((row) => row.id === item.classId);
        return liveClass?.teacherId === user.id;
      }),
      certificates: db.certificates.filter((item) => studentIds.has(item.studentId)),
      feedback: db.feedback.filter((item) => slugs.includes(item.courseSlug || "") || item.fromUserId === user.id),
      announcements: db.announcements.filter((item) => item.audience === "ALL" || item.audience === "TEACHER"),
    };
  }
  const enrollments = db.enrollments.filter((item) => item.userId === user.id);
  const activeSlugs = enrollments.filter((item) => item.status === "active").map((item) => item.courseSlug);
  const access = studentHasAccess(user);
  return {
    role: user.role,
    user,
    access,
    courses: access ? courses.filter((course) => activeSlugs.includes(course.slug)) : [],
    users: safeUsers.filter((item) => item.id === user.id || enrollments.some((row) => row.teacherId === item.id)),
    demos: db.demos.filter((item) => item.email === user.email),
    enrollments,
    payments: db.payments.filter((item) => item.userId === user.id),
    classes: access ? db.classes.filter((item) => activeSlugs.includes(item.courseSlug)) : [],
    assignments: access ? db.assignments.filter((item) => activeSlugs.includes(item.courseSlug)) : [],
    submissions: db.submissions.filter((item) => item.studentId === user.id),
    quizzes: access ? db.quizzes.filter((item) => activeSlugs.includes(item.courseSlug)).map(stripQuizAnswers) : [],
    attempts: db.attempts.filter((item) => item.studentId === user.id),
    attendance: db.attendance.filter((item) => item.studentId === user.id),
    certificates: db.certificates.filter((item) => item.studentId === user.id),
    feedback: db.feedback.filter((item) => item.fromUserId === user.id),
    announcements: db.announcements.filter((item) => item.audience === "ALL" || item.audience === "STUDENT"),
  };
}

function stripQuizAnswers(quiz: Quiz) {
  return {
    ...quiz,
    questions: quiz.questions.map((question) => ({ q: question.q, options: question.options })),
  };
}

export { createAdminCourse, upsertCourseOverride, signPayment, saveInstitutionOverride };
