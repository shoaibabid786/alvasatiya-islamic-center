"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { Field, LoadingState } from "@/components/lms/ui";

export default function SettingsView() {
  const { push } = useToast();
  const [form, setForm] = useState({ organizationName: "", supportEmail: "" });
  const [reports, setReports] = useState<any>(null);

  useEffect(() => {
    api<any>("/api/settings").then((data) =>
      setForm({
        organizationName: data.organizationName || "",
        supportEmail: data.supportEmail || "",
      }),
    );
    api("/api/reports").then(setReports).catch(() => null);
  }, []);

  if (!form) return <LoadingState />;

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <form
        className="lms-card p-6 space-y-3 max-w-xl"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const result = await api<{ message: string }>("/api/settings", { method: "PATCH", body: JSON.stringify(form) });
            push(result.message);
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      >
        <Field label="Organization name">
          <input value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} />
        </Field>
        <Field label="Support email">
          <input type="email" value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} />
        </Field>
        <button className="lms-btn lms-btn-primary">Save settings</button>
      </form>
      {reports ? (
        <div className="lms-card p-6 overflow-x-auto">
          <h2 className="font-semibold mb-3">System snapshot</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Class</th>
                <th>Teacher</th>
                <th>Students</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(reports.classes || []).map((item: any) => (
                <tr key={item.id} className="border-t border-slate-100">
                  <td className="py-2">{item.name}</td>
                  <td>{item.teacher}</td>
                  <td>{item.students}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
