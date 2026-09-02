"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/components/lms/toast";
import { Field } from "@/components/lms/ui";

export default function LmsLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="lms-app grid min-h-screen lg:grid-cols-2">
      <div className="hidden islamic-pattern lg:flex flex-col justify-between p-12 text-white">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">Alvasatiya Islamic Center</p>
          <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight">Education management for a balanced ummah.</h1>
          <p className="mt-4 max-w-md text-white/75">One secure login for administrators, teachers, and students. Classes, quizzes, assignments, and attendance in a single system.</p>
        </div>
        <p className="text-sm text-white/60">Admin, Teacher, and Student dashboards</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <form
          className="lms-card w-full max-w-md p-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            if (!email.trim() || !password) {
              setError("Email and password are required.");
              return;
            }
            setLoading(true);
            try {
              const data = await api<{ redirect: string }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password, remember }),
              });
              router.push(params.get("next") || data.redirect);
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Invalid credentials");
            } finally {
              setLoading(false);
            }
          }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-teal-700">Alvasatiya LMS</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-800">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">Use your email or username and password. You will be taken to the dashboard for your role.</p>
          </div>
          <Field label="Email / Username">
            <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="username" />
          </Field>
          <Field label="Password">
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" className="w-4 h-4" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="lms-btn lms-btn-primary w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          <div className="flex justify-between text-sm">
            <Link href="/forgot-password" className="text-teal-700">Forgot password</Link>
            <Link href="/signup" className="text-teal-700">Create student account</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
