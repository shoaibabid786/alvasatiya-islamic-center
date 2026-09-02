"use client";

import { useEffect, useMemo, useState } from "react";
import { MessageCircleQuestionMark, Search } from "lucide-react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import { FATWA_CATEGORIES, fatwas } from "@/data/fatwas";
import { saveForm } from "@/lib/forms";

export default function FatwaClient() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [form, setForm] = useState({ name: "", email: "", category: "General", question: "" });

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [success]);

  const list = useMemo(() => {
    return fatwas.filter((f) => {
      const okCat = category === "All" || f.category === category;
      const q = query.toLowerCase();
      return okCat && (f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
    });
  }, [query, category]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.question) return;
    saveForm("fatwa", form);
    setOpen(false);
    setSuccess(true);
    setForm({ name: "", email: "", category: "General", question: "" });
  }

  return (
    <div>
      <div className="card-surface p-8 md:p-12 text-center islamic-pattern-light border-2 border-gold max-w-3xl mx-auto">
        <MessageCircleQuestionMark className="w-12 h-12 text-gold mx-auto" />
        <h2 className="mt-4 text-3xl font-bold text-green-deep">Ask Your Question</h2>
        <p className="mt-3 text-muted">Submit a question for review. Personal or complex religious matters should be reviewed by qualified scholars.</p>
        <button className="btn btn-gold mt-6" onClick={() => setOpen(true)}>Ask a Question</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-green-deep/50" aria-label="Close form" onClick={() => setOpen(false)} />
          <form onSubmit={submit} className="relative card-surface w-full max-w-lg p-6 space-y-3">
            <h3 className="text-xl font-bold text-green-deep">Submit a question</h3>
            <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {FATWA_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea required rows={5} placeholder="Your Question" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} />
            <button className="btn btn-gold w-full">Submit Question</button>
          </form>
        </div>
      )}

      <SuccessDialog
        open={success}
        onClose={() => setSuccess(false)}
        title="Your question has been submitted successfully."
        message="JazakAllahu Khairan. Our team will review your question and respond as soon as possible."
      />

      <div className="mt-12 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted" />
          <input className="pl-9" placeholder="Search previous fatwas" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="md:w-56">
          <option>All</option>
          {FATWA_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="mt-8 space-y-4">
        {list.map((item) => (
          <article key={item.id} className="card-surface p-6">
            <p className="text-xs uppercase tracking-widest text-gold">{item.category} · {item.date}</p>
            <h3 className="mt-2 font-semibold text-green-deep">{item.question}</h3>
            <p className="mt-2 text-muted">{item.answer}</p>
            <p className="mt-3 text-sm">Scholar / Reviewer: {item.scholar}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
