"use client";

import { useEffect, useMemo, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, LoadingState, Modal, statusTone } from "@/components/lms/ui";

type Meeting = {
  id: string;
  title: string;
  meetingUrl: string;
  startsAt: string;
  status: string;
  classId: string;
  studentEmails?: string[];
  class?: { name: string; subject: string; teacher?: { name: string } | null } | null;
};

type Student = { id: string; name: string; email: string };

function toLocalInput(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

const emptyForm = {
  classId: "",
  title: "",
  meetingUrl: "",
  startsAt: "",
  status: "SCHEDULED",
  studentEmails: [] as string[],
};

export default function ScheduleClassManager() {
  const { push } = useToast();
  const [rows, setRows] = useState<Meeting[]>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [studentQuery, setStudentQuery] = useState("");
  const [extraEmail, setExtraEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Meeting | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const classEmails = useMemo(
    () => new Set(classStudents.map((student) => student.email.toLowerCase())),
    [classStudents],
  );

  const extraCandidates = useMemo(() => {
    const q = studentQuery.trim().toLowerCase();
    return students.filter((student) => {
      const email = student.email.toLowerCase();
      if (classEmails.has(email)) return false;
      if (!q) return true;
      return student.name.toLowerCase().includes(q) || email.includes(q);
    });
  }, [students, studentQuery, classEmails]);

  async function load() {
    setLoading(true);
    const data = await api<{ meetings: Meeting[] }>("/api/live-meetings");
    setRows(data.meetings);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => {
      push(err.message, "error");
      setLoading(false);
    });
    api<{ classes: Array<{ id: string; name: string }> }>("/api/classes?pageSize=50").then((data) => {
      setClasses(data.classes);
      if (data.classes[0]) setForm((current) => ({ ...current, classId: current.classId || data.classes[0].id }));
    });
    api<{ students: Student[] }>("/api/classes?select=students").then((data) => setStudents(data.students || []));
  }, []);

  useEffect(() => {
    if (!open || !form.classId) {
      setClassStudents([]);
      return;
    }
    api<{ students: Student[] }>(`/api/classes/${form.classId}`)
      .then((data) => setClassStudents(data.students || []))
      .catch(() => setClassStudents([]));
  }, [open, form.classId]);

  function openCreate() {
    setEditing(null);
    setStudentQuery("");
    setExtraEmail("");
    setForm({
      ...emptyForm,
      classId: classes[0]?.id || "",
    });
    setOpen(true);
  }

  function openEdit(row: Meeting) {
    setEditing(row);
    setStudentQuery("");
    setExtraEmail("");
    setForm({
      classId: row.classId,
      title: row.title,
      meetingUrl: row.meetingUrl,
      startsAt: toLocalInput(row.startsAt),
      status: row.status,
      studentEmails: (row.studentEmails || []).map((email) => email.toLowerCase()),
    });
    setOpen(true);
  }

  function toggleExtra(email: string) {
    const value = email.toLowerCase();
    setForm((current) => ({
      ...current,
      studentEmails: current.studentEmails.includes(value)
        ? current.studentEmails.filter((item) => item !== value)
        : [...current.studentEmails, value],
    }));
  }

  function addTypedEmail() {
    const value = extraEmail.trim().toLowerCase();
    if (!value) return;
    const match = students.find((student) => student.email.toLowerCase() === value);
    if (!match) {
      push("No student account uses this email.", "error");
      return;
    }
    if (classEmails.has(value)) {
      push("This student is already in the selected class.", "error");
      setExtraEmail("");
      return;
    }
    if (!form.studentEmails.includes(value)) {
      setForm((current) => ({ ...current, studentEmails: [...current.studentEmails, value] }));
    }
    setExtraEmail("");
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Schedule class</h1>
          <p className="text-sm text-slate-500">
            Choose a class so every student in it sees Join class. You can also add extra students by email.
          </p>
        </div>
        <button className="lms-btn lms-btn-primary" onClick={openCreate}>
          Schedule class
        </button>
      </div>

      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState title="No classes scheduled" body="Make a class, add students, then schedule a live session with a meeting link." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="lms-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{row.title}</h2>
                  <p className="text-sm text-slate-500">
                    {row.class?.name} · {new Date(row.startsAt).toLocaleString()}
                  </p>
                  <p className="mt-1 break-all text-xs text-slate-400">{row.meetingUrl}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    Shown to all students in {row.class?.name || "this class"}
                    {(row.studentEmails || []).length ? ` + extra: ${row.studentEmails?.join(", ")}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  <button className="text-sm font-semibold text-teal-700" onClick={() => openEdit(row)}>
                    Edit
                  </button>
                  <button className="text-sm text-red-600" onClick={() => setPending(row.id)}>
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? "Update scheduled class" : "Schedule class"} onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const path = editing ? `/api/live-meetings/${editing.id}` : "/api/live-meetings";
              const result = await api<{ message: string }>(path, {
                method: editing ? "PATCH" : "POST",
                body: JSON.stringify(form),
              });
              push(result.message);
              setOpen(false);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Something went wrong", "error");
            }
          }}
        >
          <Field label="Class">
            <select required value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              <option value="">Select class</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          {form.classId ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-medium text-slate-700">Students in this class</p>
              <p className="mt-1 text-xs text-slate-500">They will all see the Join class card.</p>
              {classStudents.length ? (
                <ul className="mt-2 max-h-28 space-y-1 overflow-y-auto text-sm text-slate-600">
                  {classStudents.map((student) => (
                    <li key={student.id}>
                      {student.name} · {student.email}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-slate-500">No students in this class yet. Add them under Classes, or invite extra emails below.</p>
              )}
            </div>
          ) : null}
          <Field label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Weekly Quran recitation" />
          </Field>
          <Field label="Class time">
            <input required type="datetime-local" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          </Field>
          <Field label="Meeting link">
            <input
              required
              type="url"
              value={form.meetingUrl}
              onChange={(e) => setForm({ ...form, meetingUrl: e.target.value })}
              placeholder="https://us05web.zoom.us/j/..."
            />
          </Field>
          <div>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">Extra students by email (optional)</span>
              <span className="text-xs text-slate-500">{form.studentEmails.length} extra</span>
            </div>
            <div className="mb-2 flex gap-2">
              <input
                type="email"
                placeholder="student@email.com"
                value={extraEmail}
                onChange={(e) => setExtraEmail(e.target.value)}
              />
              <button type="button" className="lms-btn lms-btn-ghost shrink-0" onClick={addTypedEmail}>
                Add email
              </button>
            </div>
            <input
              className="mb-2"
              placeholder="Search students to add"
              value={studentQuery}
              onChange={(e) => setStudentQuery(e.target.value)}
            />
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {extraCandidates.length ? (
                extraCandidates.map((student) => (
                  <label key={student.email} className="flex cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-slate-50">
                    <input
                      type="checkbox"
                      className="mt-0.5"
                      checked={form.studentEmails.includes(student.email.toLowerCase())}
                      onChange={() => toggleExtra(student.email)}
                    />
                    <span>
                      <span className="block font-medium text-slate-800">{student.name}</span>
                      <span className="block text-xs text-slate-500">{student.email}</span>
                    </span>
                  </label>
                ))
              ) : (
                <p className="px-2 py-3 text-sm text-slate-500">No extra students to add.</p>
              )}
            </div>
          </div>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </Field>
          <button className="lms-btn lms-btn-primary">{editing ? "Save changes" : "Schedule class"}</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Remove scheduled class?"
        body="Students will no longer see this Join class card."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          try {
            const result = await api<{ message: string }>(`/api/live-meetings/${pending}`, { method: "DELETE" });
            push(result.message);
            setPending(null);
            load();
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      />
    </div>
  );
}
