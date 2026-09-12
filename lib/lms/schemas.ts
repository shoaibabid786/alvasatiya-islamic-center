import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
  expectedRole: z.enum(["ADMIN", "TEACHER", "STUDENT"]).optional(),
});

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, "Google sign-in is required"),
  remember: z.boolean().optional(),
});

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters");

export const teacherCreateSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().optional().or(z.literal("")),
  password: passwordSchema,
  qualification: z.string().trim().optional().or(z.literal("")),
  experience: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

export const teacherUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional().nullable(),
  password: passwordSchema.optional(),
  qualification: z.string().trim().optional().nullable(),
  experience: z.string().trim().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  classIds: z.array(z.string()).optional(),
});

export const studentCreateSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().optional().or(z.literal("")),
  password: passwordSchema,
  dateOfBirth: z.string().trim().optional().or(z.literal("")),
  studentCode: z.string().trim().optional().or(z.literal("")),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
});

export const studentUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  phone: z.string().trim().optional().nullable(),
  password: passwordSchema.optional(),
  dateOfBirth: z.string().trim().optional().nullable(),
  studentCode: z.string().trim().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED"]).optional(),
  classIds: z.array(z.string()).optional(),
});

export const classSchema = z.object({
  name: z.string().trim().min(2, "Class name is required"),
  description: z.string().trim().optional().or(z.literal("")),
  subject: z.string().trim().min(2, "Subject is required"),
  teacherId: z.string().optional().nullable(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE", "COMPLETED"]).optional(),
  studentIds: z.array(z.string()).optional(),
});

export const joinClassSchema = z.object({
  code: z.string().trim().min(4, "Class code is required"),
});

export const liveMeetingSchema = z.object({
  classId: z.string().min(1, "Class is required"),
  title: z.string().trim().min(2, "Title is required"),
  meetingUrl: z
    .string()
    .trim()
    .min(8, "Meeting link is required")
    .refine((value) => {
      try {
        const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
        return url.protocol === "http:" || url.protocol === "https:";
      } catch {
        return false;
      }
    }, "Enter a valid meeting link"),
  startsAt: z.string().min(1, "Class time is required"),
  status: z.enum(["SCHEDULED", "COMPLETED", "CANCELLED"]).optional(),
  studentEmails: z.array(z.string().trim().email("Valid student email is required")).optional().default([]),
});

export const attendanceSaveSchema = z.object({
  classId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required"),
  records: z.array(
    z.object({
      studentId: z.string(),
      status: z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]),
    }),
  ),
});

export const questionSchema = z.object({
  id: z.string().optional(),
  prompt: z.string().trim().min(2, "Question is required"),
  optionA: z.string().trim().min(1, "Option A is required"),
  optionB: z.string().trim().min(1, "Option B is required"),
  optionC: z.string().trim().min(1, "Option C is required"),
  optionD: z.string().trim().min(1, "Option D is required"),
  correctAnswer: z.enum(["A", "B", "C", "D"]),
  marks: z.coerce.number().int().positive().default(1),
});

export const quizSchema = z.object({
  title: z.string().trim().min(2, "Quiz title is required"),
  description: z.string().trim().optional().or(z.literal("")),
  classId: z.string().min(1, "Class is required"),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  timeLimitMin: z.coerce.number().int().positive().default(30),
  passingMarks: z.coerce.number().int().min(0).default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "UNPUBLISHED", "CLOSED"]).optional(),
  questions: z.array(questionSchema).optional(),
});

export const quizAttemptSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string(),
      selected: z.enum(["A", "B", "C", "D"]),
    }),
  ),
});

export const assignmentSchema = z.object({
  title: z.string().trim().min(2, "Assignment title is required"),
  description: z.string().trim().optional().or(z.literal("")),
  classId: z.string().min(1, "Class is required"),
  dueDate: z.string().min(1, "Due date is required"),
  totalMarks: z.coerce.number().positive().default(100),
  attachment: z.string().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]).optional(),
});

export const gradeSchema = z.object({
  marks: z.coerce.number().min(0, "Marks are required"),
  feedback: z.string().trim().optional().or(z.literal("")),
});

export const announcementSchema = z.object({
  title: z.string().trim().min(2, "Title is required"),
  message: z.string().trim().min(2, "Message is required"),
  classId: z.string().min(1, "Class is required"),
  publishDate: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).optional(),
  phone: z.string().trim().optional().nullable(),
  qualification: z.string().trim().optional().nullable(),
  experience: z.string().trim().optional().nullable(),
  dateOfBirth: z.string().trim().optional().nullable(),
  profilePicture: z.string().optional().nullable(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
});

export const settingsSchema = z.object({
  organizationName: z.string().trim().min(2).optional(),
  supportEmail: z.string().trim().email().optional(),
});
