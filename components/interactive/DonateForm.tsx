"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, Upload } from "lucide-react";
import { DONATE_ACCOUNT } from "@/data/donate-account";
import { donateCategories } from "@/data/welfare";
import { saveForm } from "@/lib/forms";

const CATEGORIES = [
  { title: "Sadaqah", text: "Voluntary charity given seeking the pleasure of Allah." },
  { title: "Zakat", text: "Obligatory charity for those who meet the conditions of Zakat." },
  ...donateCategories,
];

type Step = 1 | 2 | 3;
type CopyKey = "iban" | "account" | "phone";

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 py-2.5 border-b border-border/60 last:border-b-0">
      <dt className="sm:w-40 shrink-0 text-sm text-muted">{label}</dt>
      <dd className="font-semibold text-green-deep break-all">{value}</dd>
    </div>
  );
}

export default function DonateForm() {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState("");
  const [slip, setSlip] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [signedIn, setSignedIn] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    fetch("/api/profile", { method: "POST", credentials: "include", cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.user) return;
        setSignedIn({ name: data.user.name || "", email: data.user.email || "" });
      })
      .catch(() => {});
  }, []);

  async function copyValue(key: CopyKey, value: string) {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      setCopied(key);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  async function submitSlip() {
    setError("");
    if (!slip) {
      setError("Please upload a photo or PDF of your payment slip.");
      return;
    }
    setLoading(true);
    try {
      const body = new FormData();
      body.append("file", slip);
      body.append("category", category);
      body.append("name", signedIn?.name || "");
      body.append("email", signedIn?.email || "");
      const response = await fetch("/api/donate/slip", { method: "POST", body });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not upload the slip.");
      saveForm("donate", {
        category,
        method: "HBL / JazzCash",
        account: DONATE_ACCOUNT.accountNumber,
        iban: DONATE_ACCOUNT.iban,
        slip: data.originalName || slip.name,
        name: signedIn?.name || "",
        email: signedIn?.email || "",
      });
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit the donation.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <ol className="mb-8 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm">
        {["Choose category", "Pay & upload slip", "Success"].map((label, index) => {
          const n = (index + 1) as Step;
          const active = step === n;
          const done = step > n;
          return (
            <li
              key={label}
              className={`rounded-full px-3 py-2 font-semibold ${
                active || done ? "bg-green-deep text-ivory" : "bg-white text-muted border border-border"
              }`}
            >
              {n}. {label}
            </li>
          );
        })}
      </ol>

      {step === 1 ? (
        <section className="card-surface p-6 sm:p-8">
          <h2 className="text-2xl font-bold text-green-deep">Which category do you want to donate?</h2>
          <p className="mt-2 text-sm text-muted">Choose one of the giving paths already listed on this website.</p>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {CATEGORIES.map((item) => (
              <button
                key={item.title}
                type="button"
                className={`text-left rounded-2xl border p-4 transition-colors ${
                  category === item.title
                    ? "border-gold bg-sage text-green-deep"
                    : "border-border bg-white hover:border-gold"
                }`}
                onClick={() => setCategory(item.title)}
              >
                <p className="font-semibold text-green-deep">{item.title}</p>
                <p className="mt-1 text-sm text-muted">{item.text}</p>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-gold w-full mt-6"
            disabled={!category}
            onClick={() => setStep(2)}
          >
            Continue
          </button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="card-surface p-6 sm:p-8 space-y-6">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-ochre font-semibold">Selected category</p>
            <h2 className="mt-1 text-2xl font-bold text-green-deep">{category}</h2>
            <button type="button" className="mt-2 text-sm text-green-deep underline" onClick={() => setStep(1)}>
              Change category
            </button>
          </div>

          {signedIn ? (
            <p className="text-sm text-muted">
              Donating as <strong className="text-green-deep">{signedIn.name}</strong> ({signedIn.email}).
            </p>
          ) : (
            <p className="text-sm text-muted">
              <Link href="/login" className="text-green-deep font-semibold underline">Sign in</Link> if you want this donation linked to your account.
            </p>
          )}

          <div className="rounded-2xl border border-gold/50 bg-sage/70 p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ochre font-semibold">Send payment to</p>
            <dl className="mt-3">
              <Detail label="Account Title" value={DONATE_ACCOUNT.title} />
              <Detail label="Bank Name" value={DONATE_ACCOUNT.bank} />
              <Detail label="Branch Code" value={DONATE_ACCOUNT.branchCode} />
              <Detail label="Swift Code" value={DONATE_ACCOUNT.swiftCode} />
              <Detail label="IBAN Number" value={DONATE_ACCOUNT.iban} />
              <Detail label="Account Number" value={DONATE_ACCOUNT.accountNumber} />
              <Detail label="Phone / JazzCash" value={DONATE_ACCOUNT.phone} />
            </dl>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-outline !py-2" onClick={() => copyValue("iban", DONATE_ACCOUNT.iban)}>
                {copied === "iban" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === "iban" ? "IBAN copied" : "Copy IBAN"}
              </button>
              <button type="button" className="btn btn-outline !py-2" onClick={() => copyValue("account", DONATE_ACCOUNT.accountNumber)}>
                {copied === "account" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === "account" ? "Account copied" : "Copy account"}
              </button>
              <button type="button" className="btn btn-outline !py-2" onClick={() => copyValue("phone", DONATE_ACCOUNT.phone)}>
                {copied === "phone" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === "phone" ? "Number copied" : "Copy phone"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5">
            <p className="text-xs uppercase tracking-[0.16em] text-ochre font-semibold">Account holder</p>
            <dl className="mt-3">
              <Detail label="Name" value={DONATE_ACCOUNT.name} />
              <Detail label="Father Name" value={DONATE_ACCOUNT.fatherName} />
              <Detail label="Identity Card" value={DONATE_ACCOUNT.identityCard} />
              <Detail label="Date of Birth" value={DONATE_ACCOUNT.dateOfBirth} />
            </dl>
          </div>

          <label className="block">
            <span className="text-sm font-semibold text-green-deep">Upload payment slip</span>
            <span className="mt-1 flex items-center gap-3 rounded-2xl border border-dashed border-border bg-white px-4 py-5">
              <Upload className="w-5 h-5 text-gold shrink-0" />
              <span className="text-sm text-muted">
                {slip ? slip.name : "JPG, PNG, or PDF of your bank or JazzCash receipt"}
              </span>
            </span>
            <input
              className="mt-2"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf,.pdf,.jpg,.jpeg,.png"
              onChange={(e) => setSlip(e.target.files?.[0] || null)}
            />
          </label>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button type="button" className="btn btn-gold w-full" disabled={loading} onClick={submitSlip}>
            {loading ? "Submitting..." : "Submit donation"}
          </button>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="card-surface p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sage text-green-deep">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-green-deep">Donation received</h2>
          <p className="mt-3 text-muted max-w-lg mx-auto">
            JazakAllahu Khairan. Your {category} donation slip has been submitted. Our team will verify the HBL or JazzCash payment.
          </p>
          <button
            type="button"
            className="btn btn-gold mt-8"
            onClick={() => {
              setStep(1);
              setCategory("");
              setSlip(null);
              setError("");
            }}
          >
            Make another donation
          </button>
        </section>
      ) : null}
    </div>
  );
}
