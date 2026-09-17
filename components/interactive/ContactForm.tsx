"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import DirectContactButtons from "@/components/interactive/DirectContactButtons";
import { mailtoHref } from "@/data/site";
import { submitInquiry } from "@/lib/forms";

function messageFromForm(form: { name: string; email: string; phone: string; subject: string; message: string }) {
  return [
    "Assalamu alaikum, I am contacting Alvasatiya Islamic Center.",
    form.name ? `Name: ${form.name}` : null,
    form.email ? `Email: ${form.email}` : null,
    form.phone ? `Phone: ${form.phone}` : null,
    form.subject ? `Subject: ${form.subject}` : null,
    form.message || "I would like to get in touch.",
  ]
    .filter((line): line is string => Boolean(line))
    .join("\n");
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const draft = messageFromForm(form);

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
      await submitInquiry("contact", form);
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <form onSubmit={submit} className="card-surface p-6 space-y-3">
        <input
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <label className="block text-sm font-semibold text-green-deep">Name
          <input required name="name" autoComplete="name" className="mt-1" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Email
          <input required name="email" autoComplete="email" className="mt-1" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Phone / WhatsApp number
          <input name="phone" autoComplete="tel" className="mt-1" placeholder="e.g. 0300 4840308" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Subject
          <input required name="subject" className="mt-1" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        </label>
        <label className="block text-sm font-semibold text-green-deep">Message
          <textarea required name="message" className="mt-1" rows={6} placeholder="Type your message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        </label>
        {error ? (
          <div className="space-y-2">
            <p className="text-sm text-red-700">{error}</p>
            <a className="text-sm text-green-deep underline" href={mailtoHref(form.subject || "Contact", draft)}>
              Open in your email app
            </a>
          </div>
        ) : null}
        <button className="btn btn-gold w-full" disabled={sending}>{sending ? "Sending..." : "Send Message"}</button>
        <p className="text-xs text-muted text-center">Or send this same message from your phone:</p>
        <DirectContactButtons message={draft} showCall={false} className="grid sm:grid-cols-2 gap-2" />
      </form>
      <SuccessDialog
        open={success}
        onClose={() => setSuccess(false)}
        title="Your message has been sent successfully."
        message="JazakAllahu Khairan. Your details have been emailed to Alvasatiya Islamic Center. We will respond as soon as possible."
      />
    </>
  );
}
