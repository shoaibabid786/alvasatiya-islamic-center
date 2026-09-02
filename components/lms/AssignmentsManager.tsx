"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, Modal, statusTone } from "@/components/lms/ui";

export default function AssignmentsManager({ role, base }: { role: "ADMIN" | "TEACHER" | "STUDENT"; base: string }) {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", classId: "", dueDate: "", totalMarks: 100, status: "PUBLISHED" });

  async function load() {
    const data = await api<{ assignments: any[] }>(`/api/assignments?q=${encodeURIComponent(q)}`);
    setRows(data.assignments);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q]);

  useEffect(() => {
    if (role === "STUDENT") return;
    api<{ classes: any[] }>("/api/classes").then((data) => {
      setClasses(data.classes);
      if (data.classes[0]) setForm((current) => ({ ...current, classId: data.classes[0].id }));
    });
  }, [role]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Assignments</h1>
        {role !== "STUDENT" ? (
          <button className="lms-btn lms-btn-primary" onClick={() => setOpen(true)}>
            Create assignment
          </button>
        ) : null}
      </div>
      <input className="max-w-xs" placeholder="Search assignments" value={q} onChange={(e) => setQ(e.target.value)} />
      {rows.length === 0 ? (
        <EmptyState title="No assignments" body="Assignments for your classes will appear here." />
      ) : (
        <div className="grid gap-3">
          {rows.map((row) => {
            const submission = row.submissions?.[0];
            const studentStatus = submission?.status || (new Date(row.dueDate) < new Date() ? "LATE" : "Not Submitted");
            return (
              <div key={row.id} className="lms-card p-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{row.title}</p>
                  <p className="text-sm text-slate-500">
                    {row.class?.name} · due {new Date(row.dueDate).toLocaleString()} · {row.totalMarks} marks
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={statusTone(role === "STUDENT" ? String(studentStatus) : row.status)}>
                    {role === "STUDENT" ? studentStatus : row.status}
                  </Badge>
                  <Link href={`${base}/assignments/${row.id}`} className="lms-btn lms-btn-ghost">
                    Open
                  </Link>
                  {role !== "STUDENT" ? (
                    <button className="text-red-600 text-sm" onClick={() => setPending(row.id)}>
                      Delete
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal open={open} title="Create assignment" onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>("/api/assignments", { method: "POST", body: JSON.stringify(form) });
              push(result.message);
              setOpen(false);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Something went wrong", "error");
            }
          }}
        >
          <Field label="Assignment title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Description">
            <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Class">
            <select value={form.classId} onChange={(e) => setForm({ ...form, classId: e.target.value })}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Due date">
            <input required type="datetime-local" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </Field>
          <Field label="Total marks">
            <input type="number" min={1} value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: Number(e.target.value) })} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>DRAFT</option>
              <option>PUBLISHED</option>
              <option>CLOSED</option>
            </select>
          </Field>
          <button className="lms-btn lms-btn-primary">Save assignment</button>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete assignment?"
        body="Submissions for this assignment will also be removed."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          const result = await api<{ message: string }>(`/api/assignments/${pending}`, { method: "DELETE" });
          push(result.message);
          setPending(null);
          load();
        }}
      />
    </div>
  );
}
