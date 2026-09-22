import { redirect } from "next/navigation";
import DashboardShell from "@/components/lms/DashboardShell";
import { getSessionUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin/dashboard");
  if (user.role !== "ADMIN" || user.status !== "ACTIVE") redirect("/");
  return <DashboardShell role="ADMIN">{children}</DashboardShell>;
}
