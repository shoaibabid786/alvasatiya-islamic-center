"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { Badge, EmptyState, LoadingState, ProgressRing, statusTone } from "@/components/lms/ui";

export default function AttendanceBoard({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const { push } = useToast();
  const [classes, setClasses] = useState<any[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [roster, setRoster] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    api<{ classes: any[] }>("/api/classes").then((data) => {
      setClasses(data.classes);
      if (data.classes[0] && role !== "STUDENT") setClassId(data.classes[0].id);
    });
    if (role === "STUDENT") {
      api("/api/attendance?summary=me").then(setSummary).catch((err) => push(err.message, "error"));
    }
  }, [role]);

  useEffect(() => {
    if (role === "STUDENT" || !classId || !date) return;
    api<{ roster: any[] }>(`/api/attendance?classId=${classId}&date=${date}`)
      .then((data) => setRoster(data.roster))
      .catch((err) => push(err.message, "error"));
  }, [classId, date, role]);

  const filtered = roster.filter((row) => row.student.name.toLowerCase().includes(q.toLowerCase()));

  if (role === "STUDENT") {
    if (!summary) return <LoadingState />;
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold">Attendance</h1>
        <div className="lms-card p-6 grid gap-4 sm:grid-cols-2">
          <ProgressRing value={summary.percentage} />
          <div className="grid grid-cols-2 gap-3 text-sm">
            <p>Total records: {summary.total}</p>
            <p>Present: {summary.present}</p>
            <p>Absent: {summary.absent}</p>
            <p>Late: {summary.late}</p>
            <p>Leave: {summary.leave}</p>
          </div>
        </div>
        <div className="lms-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Date</th>
                <th>Class</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(summary.history || []).map((row: any) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{row.date}</td>
                  <td>{row.class?.name}</td>
                  <td>
                    <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Attendance</h1>
      <div className="flex flex-wrap gap-2">
        <select className="max-w-xs" value={classId} onChange={(e) => setClassId(e.target.value)}>
          {classes.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <input type="date" className="max-w-[12rem]" value={date} onChange={(e) => setDate(e.target.value)} />
        <input className="max-w-xs" placeholder="Search students" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <EmptyState title="No students to mark" body="Select a class with enrolled students." />
      ) : (
        <div className="lms-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Student</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Late</th>
                <th>Leave</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, index) => (
                <tr key={row.student.id} className="border-t border-slate-100">
                  <td className="px-4 py-2">{row.student.name}</td>
                  {["PRESENT", "ABSENT", "LATE", "LEAVE"].map((status) => (
                    <td key={status}>
                      <input
                        type="radio"
                        name={row.student.id}
                        checked={row.status === status}
                        onChange={() => {
                          const next = [...roster];
                          const real = next.find((item) => item.student.id === row.student.id);
                          if (real) real.status = status;
                          setRoster(next);
                        }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        className="lms-btn lms-btn-primary"
        onClick={async () => {
          try {
            const result = await api<{ message: string }>("/api/attendance", {
              method: "POST",
              body: JSON.stringify({
                classId,
                date,
                records: roster.filter((row) => row.status).map((row) => ({ studentId: row.student.id, status: row.status })),
              }),
            });
            push(result.message);
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      >
        Save attendance
      </button>
    </div>
  );
}
