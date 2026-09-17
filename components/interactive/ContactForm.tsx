"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import DirectContactButtons from "@/components/interactive/DirectContactButtons";
import { mailtoHref, SITE } from "@/data/site";
import { formSubmitActionUrl } from "@/lib/contact-http";

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

export default function ContactForm({ sent = false }: { sent?: boolean }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "", website: "" });
  const [success, setSuccess] = useState(sent);
  const [nextUrl, setNextUrl] = useState(`${SITE.url}/contact?sent=1`);
  const draft = messageFromForm(form);

  useEffect(() => {
    setNextUrl(`${window.location.origin}/contact?sent=1`);
  }, []);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 8000);
    return () => clearTimeout(t);
  }, [success]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    if (form.website.trim()) {
      e.preventDefault();
      return;
    }
    fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", ...form, clientDelivered: true }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <>
      <form
        action={formSubmitActionUrl()}
        method="POST"
        acceptCharset="UTF-8"
        onSubmit={submit}
        className="card-surface p-6 space-y-3"
      >
        <input type="hidden" name="_captcha" value="false" />
        <input type="hidden" name="_next" value={nextUrl} />
        <input type="hidden" name="_subject" value={form.subject ? `Website contact: ${form.subject}` : "New Contact Us message"} />
        <input type="hidden" name="_honey" value="" />
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
        <a className="text-sm text-green-deep underline" href={mailtoHref(form.subject || "Contact", draft)}>
          Or open in your email app
        </a>
        <button className="btn btn-gold w-full" type="submit">Send Message</button>
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
