import DashboardShell from "@/components/lms/DashboardShell";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="STUDENT">{children}</DashboardShell>;
}
