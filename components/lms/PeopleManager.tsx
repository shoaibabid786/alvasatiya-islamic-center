"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, useToast } from "@/components/lms/toast";
import { Badge, ConfirmDialog, EmptyState, Field, LoadingState, Modal, statusTone } from "@/components/lms/ui";
import PasswordInput from "@/components/PasswordInput";

export default function PeopleManager({ kind, base }: { kind: "teachers" | "students"; base: string }) {
  const { push } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    qualification: "",
    experience: "",
    dateOfBirth: "",
    studentCode: "",
    status: "ACTIVE",
  });

  const endpoint = kind === "teachers" ? "/api/teachers" : "/api/students";
  const title = kind === "teachers" ? "Teachers" : "Students";

  async function load() {
    setLoading(true);
    const data = await api<{ users: any[] }>(`${endpoint}?q=${encodeURIComponent(q)}&status=${status}`);
    setRows(data.users);
    setLoading(false);
  }

  useEffect(() => {
    load().catch((err) => push(err.message, "error"));
  }, [q, status, endpoint]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <p className="text-sm text-slate-500">
            {kind === "students"
              ? base === "/admin"
                ? "Only administrators can create student IDs. Each new student is saved to Firebase."
                : "Students in your assigned classes. Only an administrator can create a student ID."
              : "Only administrators can add teachers. Each new teacher is saved to Firebase."}
          </p>
        </div>
        {base === "/admin" ? (
          <button className="lms-btn lms-btn-primary" onClick={() => setOpen(true)}>
            Add {kind === "teachers" ? "teacher" : "student"}
          </button>
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        <input className="max-w-xs" placeholder={`Search ${kind}`} value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="max-w-[12rem]" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option>ACTIVE</option>
          <option>INACTIVE</option>
          <option>SUSPENDED</option>
        </select>
      </div>
      {loading ? (
        <LoadingState />
      ) : rows.length === 0 ? (
        <EmptyState title={`No ${kind} found`} body={base === "/admin" ? "Try another search or create a new record." : "No students are assigned to your classes yet."} />
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
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    <Link href={`${base}/${kind}/${row.id}`}>{row.name}</Link>
                    {row.studentCode ? <p className="text-xs text-slate-500">{row.studentCode}</p> : null}
                  </td>
                  <td>{row.email}</td>
                  <td>{row.phone || "—"}</td>
                  <td>
                    <Badge tone={statusTone(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="pr-4 text-right space-x-3">
                    {base === "/admin" ? (
                      <>
                        <button
                          className="text-teal-700 text-xs font-semibold"
                          onClick={async () => {
                            const next = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
                            await api(`${endpoint}/${row.id}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
                            push(next === "ACTIVE" ? "Account activated" : "Account deactivated");
                            load();
                          }}
                        >
                          {row.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>
                        <button className="text-red-600 text-xs font-semibold" onClick={() => setPending(row.id)}>
                          Delete
                        </button>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} title={`Add ${kind === "teachers" ? "teacher" : "student"}`} onClose={() => setOpen(false)}>
        <form
          className="grid gap-3"
          onSubmit={async (event) => {
            event.preventDefault();
            try {
              const result = await api<{ message: string }>(endpoint, { method: "POST", body: JSON.stringify(form) });
              push(result.message);
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
            <p className="mt-1 text-xs text-slate-500">At least 6 characters. Letters or numbers are both allowed.</p>
          </Field>
          {kind === "teachers" ? (
            <>
              <Field label="Qualification">
                <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
              </Field>
              <Field label="Experience">
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              </Field>
            </>
          ) : (
            <>
              <Field label="Student ID">
                <input value={form.studentCode} onChange={(e) => setForm({ ...form, studentCode: e.target.value })} placeholder="Optional, auto-generated" />
              </Field>
              <Field label="Date of birth">
                <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              </Field>
            </>
          )}
          <button className="lms-btn lms-btn-primary">Save</button>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(pending)}
        title={`Delete ${kind === "teachers" ? "teacher" : "student"}?`}
        body="This permanently removes the account and related learning records."
        onCancel={() => setPending(null)}
        onConfirm={async () => {
          try {
            const result = await api<{ message: string }>(`${endpoint}/${pending}`, { method: "DELETE" });
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
