"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  UserRound,
  Users,
  FileBarChart,
  PlusCircle,
  Megaphone,
  Video,
  X,
} from "lucide-react";
import { ToastProvider } from "@/components/lms/toast";
import { endClientSession } from "@/lib/lms/end-session";
import { dashboardPath, type PublicUser, type Role } from "@/lib/lms/types";

const NAV: Record<Role, Array<{ href: string; label: string; icon: typeof LayoutDashboard }>> = {
  ADMIN: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/classes", label: "Classes", icon: BookOpen },
    { href: "/admin/schedule", label: "Schedule class", icon: Video },
    { href: "/admin/teachers", label: "Teachers", icon: GraduationCap },
    { href: "/admin/students", label: "Students", icon: Users },
    { href: "/admin/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/admin/quizzes", label: "Quizzes", icon: ClipboardList },
    { href: "/admin/assignments", label: "Assignments", icon: FileBarChart },
    { href: "/admin/announcements", label: "Announcements", icon: Megaphone },
    { href: "/admin/reports", label: "Reports", icon: FileBarChart },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/profile", label: "Profile", icon: UserRound },
  ],
  TEACHER: [
    { href: "/teacher/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/classes", label: "My Classes", icon: BookOpen },
    { href: "/teacher/live", label: "Take class", icon: Video },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/teacher/quizzes", label: "Quizzes", icon: ClipboardList },
    { href: "/teacher/assignments", label: "Assignments", icon: FileBarChart },
    { href: "/teacher/announcements", label: "Announcements", icon: Megaphone },
    { href: "/teacher/results", label: "Results", icon: FileBarChart },
    { href: "/teacher/profile", label: "Profile", icon: UserRound },
  ],
  STUDENT: [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/classes", label: "My Classes", icon: BookOpen },
    { href: "/student/join", label: "Join Class", icon: PlusCircle },
    { href: "/student/quizzes", label: "Quizzes", icon: ClipboardList },
    { href: "/student/assignments", label: "Assignments", icon: FileBarChart },
    { href: "/student/attendance", label: "Attendance", icon: CalendarCheck },
    { href: "/student/results", label: "Results", icon: FileBarChart },
    { href: "/student/announcements", label: "Announcements", icon: Bell },
    { href: "/student/profile", label: "Profile", icon: UserRound },
  ],
  USER: [],
};

export default function DashboardShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<PublicUser | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user) {
          router.replace("/login");
          return;
        }
        if (data.user.role !== role) {
          router.replace(dashboardPath(data.user.role));
          return;
        }
        setUser(data.user);
      })
      .catch(() => router.replace("/login"));
  }, [role, router]);

  const title = role === "ADMIN" ? "Admin" : role === "TEACHER" ? "Teacher" : "Student";

  return (
    <ToastProvider>
      <div className="lms-app">
        <div className="lg:grid lg:grid-cols-[260px_1fr] min-h-screen">
          <aside className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-white border-r border-slate-200 p-4 transition-transform lg:static ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.16em] text-teal-700">Alvasatiya LMS</p>
                <p className="font-semibold text-slate-800">{title} Dashboard</p>
              </div>
              <button className="lg:hidden lms-btn lms-btn-ghost !p-2" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 truncate text-sm text-slate-500">{user?.name || "Loading account..."}</p>
            <nav className="mt-6 grid gap-1">
              {NAV[role].map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${active ? "bg-teal-50 text-teal-800 font-semibold" : "text-slate-600 hover:bg-slate-50"}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <button
              className="lms-btn lms-btn-ghost mt-6 w-full"
              disabled={loggingOut}
              onClick={async () => {
                if (loggingOut) return;
                setLoggingOut(true);
                await endClientSession("/login");
              }}
            >
              <LogOut className="h-4 w-4" />
              {loggingOut ? "Signing out..." : "Logout"}
            </button>
          </aside>
          <div className="min-w-0">
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
              <button className="lms-btn lms-btn-ghost lg:hidden" onClick={() => setOpen(true)}>
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <p className="hidden text-sm text-slate-500 lg:block">Islamic education management</p>
              <div className="text-sm font-medium text-slate-700">{user?.email}</div>
            </header>
            <main className="px-4 py-6 lg:px-8">{children}</main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
}
