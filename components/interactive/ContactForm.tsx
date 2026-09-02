"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import { saveForm } from "@/lib/forms";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [success]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveForm("contact", form);
    setSuccess(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  }

  return (
    <>
      <form onSubmit={submit} className="card-surface p-6 space-y-3">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
        <textarea required rows={6} placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
        <button className="btn btn-gold w-full">Send Message</button>
      </form>
      <SuccessDialog
        open={success}
        onClose={() => setSuccess(false)}
        title="Your message has been sent successfully."
        message="JazakAllahu Khairan. We will review your message and respond as soon as possible."
      />
    </>
  );
}
