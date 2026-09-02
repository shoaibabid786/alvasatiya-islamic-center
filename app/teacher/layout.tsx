import DashboardShell from "@/components/lms/DashboardShell";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="TEACHER">{children}</DashboardShell>;
}
