"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import { submitInquiry } from "@/lib/forms";

const CATEGORIES = [
  "Website",
  "Courses",
  "Islamic Education",
  "Quran Learning",
  "Services",
  "Events",
  "Welfare Services",
  "General Feedback",
];

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: "", email: "", category: CATEGORIES[0], rating: 5, message: "" });
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [success]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await submitInquiry("feedback", form);
      setSuccess(true);
      setForm({ name: "", email: "", category: CATEGORIES[0], rating: 5, message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your feedback.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="card-surface p-8 max-w-2xl mx-auto space-y-4 islamic-pattern-light">
      <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
      </select>
      <fieldset>
        <legend className="text-sm font-semibold text-green-deep mb-2">Rating</legend>
        <div className="flex gap-2" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              className={`text-2xl ${n <= form.rating ? "text-gold" : "text-border"}`}
              onClick={() => setForm({ ...form, rating: n })}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>
      <textarea required rows={6} placeholder="Feedback / Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      <button className="btn btn-teal w-full" disabled={sending}>{sending ? "Sending..." : "Submit Feedback"}</button>
      <SuccessDialog
        open={success}
        onClose={() => setSuccess(false)}
        title="Thank you for your feedback!"
        message="Your feedback has been received successfully. JazakAllahu Khairan for helping us improve."
      />
    </form>
  );
}
