export const DEMO_ACCOUNTS = {
  ADMIN: {
    role: "ADMIN" as const,
    name: "Alvasatiya Admin",
    email: "admin@example.com",
    password: "Admin@2026!",
  },
  TEACHER: {
    role: "TEACHER" as const,
    name: "Ustadha Amina Rahman",
    email: "teacher@example.com",
    password: "Teacher@2026!",
    qualification: "MA Islamic Studies, Ijazah in Tajweed",
    experience: "8 years teaching Quran and Arabic",
  },
  STUDENT: {
    role: "STUDENT" as const,
    name: "Fatima Noor",
    email: "student@example.com",
    password: "Student@2026!",
    studentCode: "STU-100001",
  },
} as const;

export type DemoRole = keyof typeof DEMO_ACCOUNTS;
