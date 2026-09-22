export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export function nowIso() {
  return new Date().toISOString();
}

export function appUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || "http://localhost:3000";
}

export function classJoinUrl(code: string) {
  return `${appUrl().replace(/\/$/, "")}/join/${code}`;
}

export function generateClassCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export function generateStudentCode() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `STU-${n}`;
}

export function extractClassCode(input: string) {
  const raw = input.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw);
    const parts = url.pathname.split("/").filter(Boolean);
    const joinIndex = parts.findIndex((part) => part.toLowerCase() === "join");
    if (joinIndex >= 0 && parts[joinIndex + 1]) return parts[joinIndex + 1].toUpperCase();
  } catch {
    /* not a URL */
  }
  const match = raw.match(/[A-Za-z0-9]{4,12}/);
  return (match?.[0] || raw).toUpperCase();
}

export function attendancePercent(present: number, total: number) {
  if (total <= 0) return 0;
  return Math.round((present / total) * 1000) / 10;
}

export function toDateInput(value?: Date | string | null) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function isLateSubmission(dueDate: Date, submittedAt = new Date()) {
  return submittedAt.getTime() > dueDate.getTime();
}

export const ALLOWED_UPLOAD_EXT = ["pdf", "doc", "docx", "ppt", "pptx", "jpg", "jpeg", "png", "zip"] as const;
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || "";
}

export function assertAllowedFile(name: string, size: number) {
  const ext = fileExtension(name);
  if (!ALLOWED_UPLOAD_EXT.includes(ext as (typeof ALLOWED_UPLOAD_EXT)[number])) {
    throw new HttpError(400, "Invalid file type");
  }
  if (size > MAX_UPLOAD_BYTES) throw new HttpError(400, "File too large");
}

export const PRIMARY_ADMIN_EMAIL = "alvasatiya4@gmail.com";

export type Role = "ADMIN" | "TEACHER" | "STUDENT" | "USER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type ClassStatus = "ACTIVE" | "INACTIVE" | "COMPLETED";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";
export type QuizStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED" | "CLOSED";
export type AssignmentStatus = "DRAFT" | "PUBLISHED" | "CLOSED";
export type SubmissionStatus = "SUBMITTED" | "LATE" | "GRADED";
export type AttemptStatus = "IN_PROGRESS" | "SUBMITTED";
export type Choice = "A" | "B" | "C" | "D";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  phone?: string | null;
  role: Role;
  status: string;
  profilePicture?: string | null;
  qualification?: string | null;
  experience?: string | null;
  studentCode?: string | null;
  dateOfBirth?: string | null;
  createdAt: string;
};

export function dashboardPath(role: Role) {
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "TEACHER") return "/teacher/dashboard";
  if (role === "USER") return "/";
  return "/student/dashboard";
}
