"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { ConfirmDialog, EmptyState, Field, Modal } from "@/components/lms/ui";

export default function AnnouncementsManager({ role }: { role: "ADMIN" | "TEACHER" | "STUDENT" }) {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "", classId: "", publishDate: "" });

  async function load() {
    const data = await api<{ announcements: any[] }>("/api/announcements");
    setRows(data.announcements);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
    if (role !== "STUDENT") {
      api<{ classes: any[] }>("/api/classes").then((data) => {
        setClasses(data.classes);
        if (data.classes[0]) setForm((current) => ({ ...current, classId: data.classes[0].id }));
      });
    }
  }, [role]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Announcements</h1>
        {role !== "STUDENT" ? (
          <button className="lms-btn lms-btn-primary" onClick={() => setOpen(true)}>
            Post announcement
          </button>
        ) : null}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No announcements" body="Class announcements will appear here." />
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={row.id} className="lms-card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{row.title}</h2>
                  <p className="text-xs text-slate-500">
                    {row.class?.name} · {new Date(row.publishDate).toLocaleString()}
                  </p>
                </div>
                {role !== "STUDENT" ? (
                  <button className="text-red-600 text-sm" onClick={() => setPending(row.id)}>
                    Delete
                  </button>
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">{row.message}</p>
            </article>
          ))}
        </div>
      )}
      <Modal open={open} title="New announcement" onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>("/api/announcements", { method: "POST", body: JSON.stringify(form) });
              push(result.message);
              setOpen(false);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Something went wrong", "error");
            }
          }}
        >
          <Field label="Title">
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Field>
          <Field label="Message">
            <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
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
          <Field label="Publish date">
            <input type="datetime-local" value={form.publishDate} onChange={(e) => setForm({ ...form, publishDate: e.target.value })} />
          </Field>
          <button className="lms-btn lms-btn-primary">Publish</button>
        </form>
      </Modal>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete announcement?"
        body="Students will no longer see this announcement."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          const result = await api<{ message: string }>(`/api/announcements/${pending}`, { method: "DELETE" });
          push(result.message);
          setPending(null);
          load();
        }}
      />
    </div>
  );
}
