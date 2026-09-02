"use client";

import { useEffect, useState } from "react";
import { api, useToast } from "@/components/lms/toast";
import { Field, LoadingState } from "@/components/lms/ui";
import type { PublicUser } from "@/lib/lms/types";

export default function ProfileView() {
  const { push } = useToast();
  const [user, setUser] = useState<PublicUser | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", qualification: "", experience: "", dateOfBirth: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });

  useEffect(() => {
    api<{ user: PublicUser }>("/api/profile").then((data) => {
      setUser(data.user);
      setForm({
        name: data.user.name,
        phone: data.user.phone || "",
        qualification: data.user.qualification || "",
        experience: data.user.experience || "",
        dateOfBirth: data.user.dateOfBirth || "",
      });
    });
  }, []);

  if (!user) return <LoadingState />;

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form
        className="lms-card p-6 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const result = await api<{ message: string }>("/api/profile", { method: "PATCH", body: JSON.stringify(form) });
            push(result.message);
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      >
        <h1 className="text-2xl font-semibold">Profile</h1>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-teal-100 grid place-items-center font-semibold text-teal-800">
            {user.name.slice(0, 1)}
          </div>
          <div>
            <p className="font-medium">{user.role}</p>
            <p className="text-sm text-slate-500">{user.status}</p>
          </div>
        </div>
        <Field label="Full name">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </Field>
        <Field label="Email">
          <input value={user.email} disabled />
        </Field>
        <Field label="Phone">
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </Field>
        {user.role === "TEACHER" ? (
          <>
            <Field label="Qualification">
              <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            </Field>
            <Field label="Experience">
              <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </Field>
          </>
        ) : null}
        {user.role === "STUDENT" ? (
          <Field label="Date of birth">
            <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
          </Field>
        ) : null}
        <Field label="Profile picture">
          <input
            type="file"
            accept="image/*"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const body = new FormData();
              body.append("file", file);
              body.append("folder", "profiles");
              try {
                await api("/api/uploads", { method: "POST", body });
                push("Profile picture updated");
              } catch (err) {
                push(err instanceof Error ? err.message : "Something went wrong", "error");
              }
            }}
          />
        </Field>
        <button className="lms-btn lms-btn-primary">Save profile</button>
      </form>
      <form
        className="lms-card p-6 space-y-3"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            const result = await api<{ message: string }>("/api/profile", { method: "PATCH", body: JSON.stringify(passwords) });
            push(result.message);
            setPasswords({ currentPassword: "", newPassword: "" });
          } catch (err) {
            push(err instanceof Error ? err.message : "Something went wrong", "error");
          }
        }}
      >
        <h2 className="text-xl font-semibold">Change password</h2>
        <Field label="Current password">
          <input type="password" required value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
        </Field>
        <Field label="New password">
          <input type="password" required minLength={8} value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
        </Field>
        <button className="lms-btn lms-btn-primary">Update password</button>
      </form>
    </div>
  );
}
