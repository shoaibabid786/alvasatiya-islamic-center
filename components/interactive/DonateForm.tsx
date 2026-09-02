"use client";

import { useEffect, useState } from "react";
import SuccessDialog from "@/components/ui/SuccessDialog";
import { saveForm } from "@/lib/forms";

const AMOUNTS = [25, 50, 100, 250];
const PURPOSES = [
  "Islamic education",
  "Students",
  "Orphans",
  "Poor families",
  "Food assistance",
  "Community services",
  "Educational projects",
  "Welfare initiatives",
  "General support",
];

export default function DonateForm() {
  const [amount, setAmount] = useState(50);
  const [custom, setCustom] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [form, setForm] = useState({ name: "", email: "", purpose: PURPOSES[0], method: "Bank transfer (manual)" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(false), 5000);
    return () => clearTimeout(t);
  }, [success]);

  const selected = custom ? Number(custom) : amount;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    saveForm("donate", { ...form, amount: selected, currency });
    setSuccess(true);
  }

  return (
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8">
      <aside className="card-surface p-6">
        <h2 className="text-xl font-bold text-green-deep">Choose an amount</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {AMOUNTS.map((n) => (
            <button
              key={n}
              type="button"
              className={`btn ${!custom && amount === n ? "btn-gold" : "btn-outline"}`}
              onClick={() => { setAmount(n); setCustom(""); }}
            >
              {currency} {n}
            </button>
          ))}
        </div>
        <label className="block mt-4 text-sm">Custom amount
          <input type="number" min={1} value={custom} onChange={(e) => setCustom(e.target.value)} className="mt-1" />
        </label>
        <label className="block mt-4 text-sm">Currency
          <select className="mt-1" value={currency} onChange={(e) => setCurrency(e.target.value)}>
            <option>USD</option>
            <option>PKR</option>
            <option>EUR</option>
            <option>GBP</option>
            <option>SAR</option>
          </select>
        </label>
        <p className="mt-6 text-sm text-muted">
          Online payment processing is not active yet. This form stores your intention locally and prepares the architecture for a future payment gateway. Please do not enter card details here.
        </p>
      </aside>
      <form onSubmit={submit} className="card-surface p-6 space-y-4">
        <input required placeholder="Donor Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <p className="text-sm">Donation amount: <strong>{currency} {selected || 0}</strong></p>
        <select value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })}>
          {PURPOSES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
          <option>Bank transfer (manual)</option>
          <option>In-person at the center</option>
          <option>Future online gateway</option>
        </select>
        <button className="btn btn-gold w-full">Donate Now</button>
      </form>
      <SuccessDialog
        open={success}
        onClose={() => setSuccess(false)}
        title="Your donation intention has been recorded."
        message="JazakAllahu Khairan. A live payment gateway is not connected yet. Our team can follow up using the details you provided."
      />
    </div>
  );
}
