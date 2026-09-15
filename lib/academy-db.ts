import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { createHash, randomBytes } from "crypto";
import type { Course } from "@/data/courses";
import type { InstitutionOverride } from "@/data/institutions";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";
export type AccountStatus = "pending" | "active" | "suspended";

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  passwordHash: string;
  role: Role;
  status: AccountStatus;
  resetToken?: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash" | "resetToken">;

export type Session = { token: string; userId: string; expiresAt: string };

export type DemoRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  courseSlug: string;
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  message: string;
  status: "pending" | "approved" | "rejected" | "scheduled";
  scheduledAt?: string;
  createdAt: string;
};

export type Enrollment = {
  id: string;
  userId: string;
  courseSlug: string;
  status: "pending_payment" | "pending_verification" | "active" | "rejected";
  paymentId?: string;
  teacherId?: string;
  createdAt: string;
  activatedAt?: string;
};

export type Payment = {
  id: string;
  enrollmentId: string;
  userId: string;
  courseSlug: string;
  amountLabel: string;
  status: "pending" | "verified" | "failed";
  provider: "test-gateway";
  createdAt: string;
  verifiedAt?: string;
};

export type LiveClass = {
  id: string;
  courseSlug: string;
  teacherId: string;
  title: string;
  startsAt: string;
  durationMin: number;
  joinUrl: string;
  status: "scheduled" | "live" | "completed";
};

export type Assignment = {
  id: string;
  courseSlug: string;
  teacherId: string;
  title: string;
  instructions: string;
  dueAt: string;
  resourceUrl?: string;
};

export type AssignmentSubmission = {
  id: string;
  assignmentId: string;
  studentId: string;
  content: string;
  submittedAt: string;
  grade?: string;
  feedback?: string;
};

export type QuizQuestion = { q: string; options: string[]; answerIndex: number };

export type Quiz = {
  id: string;
  courseSlug: string;
  teacherId: string;
  title: string;
  questions: QuizQuestion[];
};

export type QuizAttempt = {
  id: string;
  quizId: string;
  studentId: string;
  answers: number[];
  score: number;
  submittedAt: string;
};

export type Attendance = {
  id: string;
  classId: string;
  studentId: string;
  present: boolean;
  recordedAt: string;
};

export type CertificateRecord = {
  id: string;
  studentId: string;
  courseSlug: string;
  title: string;
  issuedAt: string;
};

export type FeedbackRecord = {
  id: string;
  fromUserId: string;
  courseSlug?: string;
  message: string;
  createdAt: string;
};

export type Announcement = {
  id: string;
  title: string;
  body: string;
  audience: Role | "ALL";
  createdAt: string;
};

export type CourseOverride = Partial<Course> & { slug: string; deleted?: boolean };

export type AcademyDb = {
  users: User[];
  sessions: Session[];
  demos: DemoRequest[];
  enrollments: Enrollment[];
  payments: Payment[];
  classes: LiveClass[];
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  quizzes: Quiz[];
  attempts: QuizAttempt[];
  attendance: Attendance[];
  certificates: CertificateRecord[];
  feedback: FeedbackRecord[];
  announcements: Announcement[];
  courseOverrides: CourseOverride[];
  institutionOverrides: InstitutionOverride[];
};

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DATA_DIR, "academy.json");

function hashPasswordInline(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHash("sha256").update(`${salt}:${password}`).digest("hex");
  return `${salt}:${hash}`;
}

function nowIso() {
  return new Date().toISOString();
}

function seed(): AcademyDb {
  const adminEmail = (process.env.ACADEMY_ADMIN_EMAIL || "admin@alvasatiya.org").toLowerCase();
  const adminPassword = process.env.ACADEMY_ADMIN_PASSWORD || "AlvasatiyaAdmin!2026";
  const teacherPassword = process.env.ACADEMY_TEACHER_PASSWORD || "AlvasatiyaTeacher!2026";
  const admin: User = {
    id: "user-admin",
    name: "Alvasatiya Admin",
    email: adminEmail,
    passwordHash: hashPasswordInline(adminPassword),
    role: "ADMIN",
    status: "active",
    createdAt: nowIso(),
  };
  const teacher: User = {
    id: "user-teacher",
    name: "Approved Teacher",
    email: "teacher@alvasatiya.org",
    passwordHash: hashPasswordInline(teacherPassword),
    role: "TEACHER",
    status: "active",
    createdAt: nowIso(),
  };
  return {
    users: [admin, teacher],
    sessions: [],
    demos: [],
    enrollments: [],
    payments: [],
    classes: [],
    assignments: [],
    submissions: [],
    quizzes: [],
    attempts: [],
    attendance: [],
    certificates: [],
    feedback: [],
    announcements: [
      {
        id: "ann-welcome",
        title: "Welcome to Alvasatiya Academy",
        body: "Discover a course, book a free demo, enroll, and begin after payment is verified.",
        audience: "ALL",
        createdAt: nowIso(),
      },
    ],
    courseOverrides: [],
    institutionOverrides: [],
  };
}

let memoryDb: AcademyDb | null = null;

export function getDb(): AcademyDb {
  if (memoryDb) return memoryDb;
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(FILE)) {
    const created = seed();
    writeFileSync(FILE, JSON.stringify(created, null, 2));
    memoryDb = created;
    return created;
  }
  const parsed = JSON.parse(readFileSync(FILE, "utf8")) as AcademyDb;
  memoryDb = {
    users: parsed.users ?? [],
    sessions: parsed.sessions ?? [],
    demos: parsed.demos ?? [],
    enrollments: parsed.enrollments ?? [],
    payments: parsed.payments ?? [],
    classes: parsed.classes ?? [],
    assignments: parsed.assignments ?? [],
    submissions: parsed.submissions ?? [],
    quizzes: parsed.quizzes ?? [],
    attempts: parsed.attempts ?? [],
    attendance: parsed.attendance ?? [],
    certificates: parsed.certificates ?? [],
    feedback: parsed.feedback ?? [],
    announcements: parsed.announcements ?? [],
    courseOverrides: parsed.courseOverrides ?? [],
    institutionOverrides: parsed.institutionOverrides ?? [],
  };
  return memoryDb;
}

export function saveDb(db: AcademyDb) {
  memoryDb = db;
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(db, null, 2));
}

export function newId(prefix: string) {
  return `${prefix}-${randomBytes(8).toString("hex")}`;
}
