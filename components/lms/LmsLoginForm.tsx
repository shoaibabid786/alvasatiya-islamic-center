"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { api } from "@/components/lms/toast";
import { Field } from "@/components/lms/ui";
import PasswordInput from "@/components/PasswordInput";
import Logo from "@/components/ui/Logo";
import { getFirebaseAuth } from "@/lib/firebase";

function googleErrorMessage(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String((error as { code: string }).code) : "";
  if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") return "";
  if (code === "auth/popup-blocked") return "Allow popups to continue with Google.";
  if (code === "auth/unauthorized-domain") {
    return "This site is not authorized for Google sign-in. Add localhost under Firebase Authentication authorized domains.";
  }
  if (error instanceof Error && error.message) return error.message;
  return "Google sign-in failed.";
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.97 10.71A5.41 5.41 0 0 1 3.69 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l3.01-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z" />
    </svg>
  );
}

export default function LmsLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"password" | "google" | null>(null);

  useEffect(() => {
    fetch("/api/profile", { method: "POST", credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user?.role === "USER") window.location.replace("/");
      })
      .catch(() => {});
  }, []);

  async function goTo(redirect: string) {
    const next = params.get("next");
    router.push(next || redirect);
    router.refresh();
  }

  async function continueWithGoogle() {
    setError("");
    setLoading("google");
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await api<{ redirect: string }>("/api/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken, remember }),
      });
      window.location.replace("/");
    } catch (err) {
      const message = googleErrorMessage(err);
      if (message) setError(message);
      setLoading(null);
    }
  }

  return (
    <div className="lms-app py-10 md:py-14">
      <div className="section-container flex justify-center">
        <form
          className="lms-card w-full max-w-md p-8 space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            setError("");
            if (!email.trim() || !password) {
              setError("Email and password are required.");
              return;
            }
            setLoading("password");
            try {
              const data = await api<{ redirect: string; user?: { role?: string } }>("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password, remember }),
              });
              if (data.user?.role === "USER") {
                window.location.replace("/");
                return;
              }
              await goTo(data.redirect);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Invalid credentials");
            } finally {
              setLoading(null);
            }
          }}
        >
          <div className="flex flex-col items-center text-center">
            <Logo size={72} />
            <p className="mt-3 text-xs uppercase tracking-[0.16em] text-teal-700">Alvasatiya</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-800">Sign in</h2>
            <p className="mt-1 text-sm text-slate-500">
              If you were given an ID, enter your email and password. You will be taken to your own account.
            </p>
          </div>
          <button
            type="button"
            className="lms-btn lms-btn-google w-full"
            disabled={Boolean(loading)}
            onClick={continueWithGoogle}
          >
            <GoogleMark />
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </button>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-slate-400">
            <span className="h-px flex-1 bg-slate-200" />
            or staff / student
            <span className="h-px flex-1 bg-slate-200" />
          </div>
          <Field label="Email / Username">
            <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" autoComplete="username" />
          </Field>
          <Field label="Password">
            <PasswordInput required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" />
          </Field>
          <label className="flex w-fit items-center gap-2 self-start text-sm text-slate-600">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button className="lms-btn lms-btn-primary w-full" disabled={Boolean(loading)}>
            {loading === "password" ? "Signing in..." : "Login"}
          </button>
          <div className="flex justify-between text-sm">
            <Link href="/" className="text-teal-700">Back to home</Link>
            <Link href="/forgot-password" className="text-teal-700">Forgot password</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
