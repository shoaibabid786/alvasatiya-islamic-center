"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import PasswordInput from "@/components/PasswordInput";
import Logo from "@/components/ui/Logo";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/portal";
  const staff =
    next.includes("/portal/admin") ? "Admin" : next.includes("/portal/teacher") ? "Teacher" : null;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="card-surface p-6 md:p-8 space-y-4 max-w-md w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        setSaving(false);
        if (!response.ok) {
          setError(data.error || "Login failed.");
          return;
        }
        router.push(next);
        router.refresh();
      }}
    >
      <div className="mb-2 flex justify-center">
        <Logo size={72} />
      </div>
      <h1 className="text-2xl font-bold text-green-deep">{staff ? `${staff} Login` : "Login"}</h1>
      <p className="text-sm text-muted">
        {staff
          ? `Sign in with your ${staff.toLowerCase()} account to open the ${staff.toLowerCase()} portal.`
          : "Sign in with the email and password provided by the office. Student accounts are created by an administrator."}
      </p>
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <PasswordInput required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn btn-gold w-full" disabled={saving}>{saving ? "Signing in..." : "Sign in"}</button>
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="text-teal">Forgot password</Link>
      </div>
    </form>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <form
      className="card-surface p-6 md:p-8 space-y-4 max-w-md w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        const response = await fetch("/api/auth/forgot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        setMessage(data.message);
      }}
    >
      <h1 className="text-2xl font-bold text-green-deep">Forgot Password</h1>
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      {message && <p className="text-sm text-green-deep">{message}</p>}
      <button className="btn btn-gold w-full">Send reset request</button>
      <Link href="/login" className="text-sm text-teal">Back to login</Link>
    </form>
  );
}
