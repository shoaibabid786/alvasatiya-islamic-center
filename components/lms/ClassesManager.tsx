"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, LoadingState, Modal, statusTone } from "@/components/lms/ui";

type ClassRow = {
  id: string;
  name: string;
  subject: string;
  status: string;
  code: string;
  joinUrl: string;
  teacher?: { name: string } | null;
  _count?: { members: number };
};

export default function ClassesManager({ role, base }: { role: "ADMIN" | "TEACHER" | "STUDENT"; base: string }) {
  const { push } = useToast();
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string }>>([]);
  const [form, setForm] = useState({ name: "", description: "", subject: "", teacherId: "", startDate: "", endDate: "", status: "ACTIVE", studentIds: [] as string[] });
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await api<{ classes: ClassRow[] }>(`/api/classes?q=${encodeURIComponent(q)}&status=${status}`);
    setRows(data.classes);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q, status]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    api<{ teachers: Array<{ id: string; name: string }> }>("/api/classes?select=teachers").then((data) => setTeachers(data.teachers));
    api<{ students: Array<{ id: string; name: string }> }>("/api/classes?select=students").then((data) => setStudents(data.students));
  }, [role]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{role === "STUDENT" ? "My Classes" : role === "TEACHER" ? "My Classes" : "Classes"}</h1>
          <p className="text-sm text-slate-500">Search, filter, and manage class records.</p>
        </div>
        {role === "ADMIN" ? (
          <button className="lms-btn lms-btn-primary" onClick={() => setOpen(true)}>
            Create class
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <input className="max-w-xs" placeholder="Search classes" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="max-w-[12rem]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
          <option>COMPLETED</option>
        </select>
      </div>
      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState title="No classes found" body="Create a class or join with a class code." />
      ) : (
        <div className="overflow-x-auto lms-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Class</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Code</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`${base}/classes/${row.id}`} className="hover:text-teal-800">
                      {row.name}
                    </Link>
                    <p className="text-xs text-slate-500">{row._count?.members || 0} students</p>
                  </td>
                  <td>{row.subject}</td>
                  <td>{row.teacher?.name || "Unassigned"}</td>
                  <td className="font-mono">{row.code}</td>
                  <td>
                    <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="pr-4 text-right">
                    <button
                      className="text-teal-700 text-xs font-semibold"
                      onClick={async () => {
                        await navigator.clipboard.writeText(row.joinUrl);
                        push("Joining link copied");
                      }}
                    >
                      Copy link
                    </button>
                    {role === "ADMIN" ? (
                      <button className="ml-3 text-red-600 text-xs font-semibold" onClick={() => setPendingDelete(row.id)}>
                        Delete
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title="Create class" onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>("/api/classes", { method: "POST", body: JSON.stringify(form) });
              push(result.message);
              setOpen(false);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Something went wrong", "error");
            }
          }}
        >
          <Field label="Class name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Subject">
            <input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Teacher">
            <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Unassigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Start date">
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </Field>
            <Field label="End date">
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
            </Field>
          </div>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>ACTIVE</option>
              <option>INACTIVE</option>
              <option>COMPLETED</option>
            </select>
          </Field>
          <Field label="Add students">
            <select
              multiple
              className="min-h-32"
              value={form.studentIds}
              onChange={(e) => setForm({ ...form, studentIds: [...e.target.selectedOptions].map((item) => item.value) })}
            >
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </Field>
          <button className="lms-btn lms-btn-primary">Save class</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete class?"
        body="This will remove the class and its related quizzes, assignments, and attendance."
        onCancel={() => setPendingDelete(null)}
        onConfirm={async () => {
          try {
            const result = await api<{ message: string }>(`/api/classes/${pendingDelete}`, { method: "DELETE" });
            push(result.message);
            setPendingDelete(null);
            load();
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      />
    </div>
  );
}
