import DashboardShell from "@/components/lms/DashboardShell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
