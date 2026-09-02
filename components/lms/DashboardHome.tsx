"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, BarChart, EmptyState, LineChart, LoadingState, StatCard, statusTone } from "@/components/lms/ui";
import type { Role } from "@/lib/lms/types";

export default function DashboardHome({ role, base }: { role: Role; base: string }) {
  const [data, setData] = useState<Record<string, any> | null>(null);
  const [error, setError] = useState("");
  const { push } = useToast();

  useEffect(() => {
    api<Record<string, any>>("/api/dashboard")
      .then(setData)
      .catch((err) => setError(err.message));
  }, []);

  const stats = data?.stats || {};
  const cards = useMemo(() => {
    if (role === "ADMIN") {
      return [
        ["Total Students", stats.totalStudents],
        ["Total Teachers", stats.totalTeachers],
        ["Total Classes", stats.totalClasses],
        ["Active Classes", stats.activeClasses],
        ["Total Quizzes", stats.totalQuizzes],
        ["Total Assignments", stats.totalAssignments],
        ["Average Attendance", `${stats.averageAttendance ?? 0}%`],
        ["Pending Assignments", stats.pendingAssignments],
      ] as Array<[string, string | number]>;
    }
    if (role === "TEACHER") {
      return [
        ["My Classes", stats.myClasses],
        ["Total Students", stats.totalStudents],
        ["Today's Attendance", `${stats.todaysAttendance ?? 0}%`],
        ["Active Quizzes", stats.activeQuizzes],
        ["Pending Assignments", stats.pendingAssignments],
        ["Average Attendance", `${stats.averageAttendance ?? 0}%`],
      ];
    }
    return [
      ["Enrolled Classes", stats.enrolledClasses],
      ["Upcoming Quizzes", stats.upcomingQuizzes],
      ["Pending Assignments", stats.pendingAssignments],
      ["Attendance", `${stats.attendancePercentage ?? 0}%`],
    ];
  }, [role, stats]);

  if (error) return <EmptyState title="Could not load dashboard" body={error} />;
  if (!data) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Live statistics from the database.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value]) => (
          <StatCard key={label} label={label} value={value ?? 0} />
        ))}
      </div>

      {role !== "STUDENT" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lms-card p-5">
            <h2 className="mb-4 font-semibold">{role === "ADMIN" ? "Student enrollment" : "Attendance"}</h2>
            <BarChart items={role === "ADMIN" ? data.charts?.enrollment || [] : data.charts?.attendanceTrends || []} />
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-4 font-semibold">Attendance trends</h2>
            <LineChart items={data.charts?.attendanceTrends || []} />
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-4 font-semibold">Quiz performance</h2>
            <BarChart items={data.charts?.quizPerformance || []} />
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-4 font-semibold">Assignment submissions</h2>
            <BarChart items={data.charts?.assignmentSubmissions || data.charts?.assignmentPerformance || []} />
          </div>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="lms-card p-5">
            <h2 className="mb-3 font-semibold">Enrolled classes</h2>
            {(data.classes || []).length ? (
              <div className="space-y-2">
                {data.classes.map((item: any) => (
                  <Link key={item.id} href={`${base}/classes`} className="block rounded-xl border border-slate-200 px-3 py-2">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.subject}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500">No classes yet. Join with a class code.</p>
            )}
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-3 font-semibold">Upcoming quizzes</h2>
            {(data.upcomingQuizzes || []).map((item: any) => (
              <div key={item.id} className="mb-2 flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.class?.name}</p>
                </div>
                <Badge tone={statusTone(item.status)}>{item.status}</Badge>
              </div>
            ))}
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-3 font-semibold">Pending assignments</h2>
            {(data.pendingAssignments || []).map((item: any) => (
              <div key={item.id} className="mb-2 rounded-xl border border-slate-200 px-3 py-2">
                <p className="font-medium">{item.title}</p>
                <p className="text-xs text-slate-500">Due {new Date(item.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
          <div className="lms-card p-5">
            <h2 className="mb-3 font-semibold">Recent announcements</h2>
            {(data.announcements || []).map((item: any) => (
              <div key={item.id} className="mb-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-slate-500">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {role === "TEACHER" && data.recentSubmissions?.length ? (
        <div className="lms-card p-5">
          <h2 className="mb-3 font-semibold">Recent submissions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Student</th>
                  <th>Assignment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSubmissions.map((item: any) => (
                  <tr key={item.id} className="border-t border-slate-100">
                    <td className="py-2">{item.student?.name}</td>
                    <td>{item.assignment?.title}</td>
                    <td>
                      <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
      {role === "ADMIN" ? (
        <button className="hidden" onClick={() => push("Dashboard refreshed")} />
      ) : null}
    </div>
  );
}
