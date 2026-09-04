"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, LoadingState, Modal, statusTone } from "@/components/lms/ui";

type ClassRow = {
  id: string;
  name: string;
  description?: string;
  subject: string;
  status: string;
  code: string;
  joinUrl: string;
  teacherId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  teacher?: { id: string; name: string; email?: string } | null;
  _count?: { members: number };
};

type ClassFormState = {
  name: string;
  description: string;
  subject: string;
  teacherId: string;
  startDate: string;
  endDate: string;
  status: string;
  studentIds: string[];
};

const emptyForm = (): ClassFormState => ({
  name: "",
  description: "",
  subject: "",
  teacherId: "",
  startDate: "",
  endDate: "",
  status: "ACTIVE",
  studentIds: [],
});

function toDateInput(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export default function ClassesManager({ role, base }: { role: "ADMIN" | "TEACHER" | "STUDENT"; base: string }) {
  const { push } = useToast();
  const [rows, setRows] = useState<ClassRow[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ClassRow | null>(null);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string; email?: string }>>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [form, setForm] = useState<ClassFormState>(emptyForm);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [shifting, setShifting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const data = await api<{ classes: ClassRow[] }>(`/api/classes?q=${encodeURIComponent(q)}&status=${status}&pageSize=50`);
    setRows(data.classes);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q, status]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    api<{ teachers: Array<{ id: string; name: string; email?: string }> }>("/api/classes?select=teachers").then((data) => setTeachers(data.teachers));
    api<{ students: Array<{ id: string; name: string; email: string }> }>("/api/classes?select=students").then((data) => setStudents(data.students));
  }, [role]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(row: ClassRow) {
    setEditing(row);
    setForm({
      name: row.name,
      description: row.description || "",
      subject: row.subject,
      teacherId: row.teacher?.id || row.teacherId || "",
      startDate: toDateInput(row.startDate),
      endDate: toDateInput(row.endDate),
      status: row.status,
      studentIds: [],
    });
    setOpen(true);
  }

  async function shiftTeacher(classId: string, teacherId: string) {
    setShifting(classId);
    try {
      const result = await api<{ message: string }>(`/api/classes/${classId}`, {
        method: "PATCH",
        body: JSON.stringify({ teacherId: teacherId || null }),
      });
      push(result.message);
      await load();
    } catch (err) {
      push(err instanceof Error ? err.message : "Could not shift teacher", "error");
    } finally {
      setShifting(null);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{role === "STUDENT" ? "My Classes" : role === "TEACHER" ? "My Classes" : "Classes"}</h1>
          <p className="text-sm text-slate-500">
            {role === "ADMIN"
              ? "Create a class, choose its teacher, then edit or shift that teacher later."
              : role === "TEACHER"
                ? "Take the classes assigned to you. An administrator creates the class, students, and joining link."
                : "Search, filter, and open your enrolled classes."}
          </p>
        </div>
        {role === "ADMIN" ? (
          <button className="lms-btn lms-btn-primary" onClick={openCreate}>
            Make class
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
        <EmptyState title="No classes found" body={role === "STUDENT" ? "You will see classes after an administrator enrolls you." : role === "TEACHER" ? "An administrator will assign you to a class." : "Create a class to get started."} />
      ) : (
        <div className="overflow-x-auto lms-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Class</th>
                <th>Subject</th>
                <th>{role === "ADMIN" ? "Teacher" : "Teacher"}</th>
                {role === "ADMIN" ? <th>Code</th> : null}
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
                  <td>
                    {role === "ADMIN" ? (
                      <select
                        className="min-w-[12rem]"
                        disabled={shifting === row.id}
                        value={row.teacher?.id || row.teacherId || ""}
                        onChange={(e) => shiftTeacher(row.id, e.target.value)}
                        aria-label={`Teacher for ${row.name}`}
                      >
                        <option value="">Unassigned</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      row.teacher?.name || "Unassigned"
                    )}
                  </td>
                  {role === "ADMIN" ? <td className="font-mono">{row.code}</td> : null}
                  <td>
                    <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="pr-4 text-right">
                    {role === "ADMIN" ? (
                      <>
                        <button className="text-teal-700 text-xs font-semibold" onClick={() => openEdit(row)}>
                          Edit
                        </button>
                        <button
                          className="ml-3 text-teal-700 text-xs font-semibold"
                          onClick={async () => {
                            await navigator.clipboard.writeText(row.joinUrl);
                            push("Joining link copied");
                          }}
                        >
                          Copy link
                        </button>
                        <button className="ml-3 text-red-600 text-xs font-semibold" onClick={() => setPendingDelete(row.id)}>
                          Delete
                        </button>
                      </>
                    ) : (
                      <Link href={`${base}/classes/${row.id}`} className="text-teal-700 text-xs font-semibold">
                        Open
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={editing ? "Edit class" : "Make class"} onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const path = editing ? `/api/classes/${editing.id}` : "/api/classes";
              const result = await api<{ message: string }>(path, {
                method: editing ? "PATCH" : "POST",
                body: JSON.stringify({
                  ...form,
                  teacherId: form.teacherId || null,
                  studentIds: editing ? undefined : form.studentIds,
                }),
              });
              push(result.message);
              setOpen(false);
              setEditing(null);
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
          <Field label="Teacher for this class">
            <select value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })}>
              <option value="">Unassigned</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}{teacher.email ? ` · ${teacher.email}` : ""}
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
          {!editing ? (
            <Field label="Add students to this class">
              <select
                multiple
                className="min-h-32"
                value={form.studentIds}
                onChange={(e) => setForm({ ...form, studentIds: [...e.target.selectedOptions].map((item) => item.value) })}
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} ({student.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs font-normal text-slate-500">Hold Ctrl or Cmd to select more than one student. You can also add students later from the class page.</p>
            </Field>
          ) : (
            <p className="text-xs text-slate-500">Students stay on this class when you shift the teacher. Add or remove students from the class page.</p>
          )}
          <button className="lms-btn lms-btn-primary">{editing ? "Save changes" : "Save class"}</button>
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
