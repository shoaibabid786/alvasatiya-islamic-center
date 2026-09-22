"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, LoadingState, Modal, statusTone } from "@/components/lms/ui";
import PasswordInput from "@/components/PasswordInput";
import { PRIMARY_ADMIN_EMAIL } from "@/lib/lms/types";

export default function AdminsManager() {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });

  async function load() {
    setLoading(true);
    const data = await api<{ users: any[] }>(`/api/admins?q=${encodeURIComponent(q)}`);
    setRows(data.users);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Administrators</h1>
          <p className="text-sm text-slate-500">
            Only signed-in administrators can add another admin. Each account is created in Firebase Authentication and saved to Firestore.
          </p>
        </div>
        <button className="lms-btn lms-btn-primary" onClick={() => setOpen(true)}>
          Add administrator
        </button>
      </div>
      <input className="max-w-xs" placeholder="Search administrators" value={q} onChange={(e) => setQ(e.target.value)} />
      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState title="No administrators found" body="Create the first additional administrator from this page." />
      ) : (
        <div className="lms-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-3">Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const primary = String(row.email || "").toLowerCase() === PRIMARY_ADMIN_EMAIL;
                return (
                  <tr key={row.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium">
                      {row.name}
                      {primary ? <p className="text-xs text-slate-500">Primary administrator</p> : null}
                    </td>
                    <td>{row.email}</td>
                    <td>{row.phone || "—"}</td>
                    <td>
                      <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                    </td>
                    <td className="pr-4 text-right">
                      {primary ? (
                        <span className="text-xs text-slate-400">Protected</span>
                      ) : (
                        <button className="text-red-600 text-xs font-semibold" onClick={() => setPending(row.id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title="Add administrator" onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>("/api/admins", { method: "POST", body: JSON.stringify(form) });
              push(result.message);
              setForm({ name: "", email: "", phone: "", password: "" });
              setOpen(false);
              load();
            } catch (err) {
              push(err instanceof Error ? err.message : "Something went wrong", "error");
            }
          }}
        >
          <Field label="Full name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Password">
            <PasswordInput required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="new-password" />
            <p className="mt-1 text-xs text-slate-500">At least 6 characters. This password is used to sign in to the admin panel.</p>
          </Field>
          <button className="lms-btn lms-btn-primary">Save</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete administrator?"
        body="This removes the administrator from Firebase Authentication and Firestore."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          try {
            const result = await api<{ message: string }>(`/api/admins/${pending}`, { method: "DELETE" });
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
