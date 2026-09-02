"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

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
      <h1 className="text-2xl font-bold text-green-deep">{staff ? `${staff} Login` : "Login"}</h1>
      <p className="text-sm text-muted">
        {staff
          ? `Sign in with your ${staff.toLowerCase()} account to open the ${staff.toLowerCase()} portal.`
          : "Students, teachers, and admin sign in here. Public signup creates a student account only."}
      </p>
      <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn btn-gold w-full" disabled={saving}>{saving ? "Signing in..." : "Sign in"}</button>
      <div className="flex justify-between text-sm">
        <Link href="/forgot-password" className="text-teal">Forgot password</Link>
        <Link href="/signup" className="text-teal">Create student account</Link>
      </div>
    </form>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <form
      className="card-surface p-6 md:p-8 space-y-4 max-w-md w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await response.json();
        setSaving(false);
        if (!response.ok) {
          setError(data.error || "Signup failed.");
          return;
        }
        router.push(data.redirect || "/student/dashboard");
        router.refresh();
      }}
    >
      <h1 className="text-2xl font-bold text-green-deep">Sign Up</h1>
      <p className="text-sm text-muted">New accounts are student accounts. Admin and Teacher roles cannot be selected here.</p>
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <input required type="password" minLength={8} placeholder="Password (8+ characters)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <p className="text-xs text-muted">Student portal access stays pending until a course enrollment is verified.</p>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn btn-gold w-full" disabled={saving}>{saving ? "Creating..." : "Create student account"}</button>
      <p className="text-sm">Already registered? <Link href="/login" className="text-teal">Login</Link></p>
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
