"use client";

import { useMemo, useState } from "react";
import { calculateZakat, emptyZakat, GOLD_NISAB_GRAMS, SILVER_NISAB_GRAMS, ZAKAT_RATE, type ZakatInput } from "@/lib/zakat";

const fields: Array<{ key: keyof ZakatInput; label: string; hint: string }> = [
  { key: "cash", label: "Cash", hint: "Cash, bank balances, and equivalent ready money." },
  { key: "goldGrams", label: "Gold (grams)", hint: "Weight of zakatable gold you own." },
  { key: "goldPrice", label: "Gold price per gram", hint: "Use a current local price." },
  { key: "silverGrams", label: "Silver (grams)", hint: "Weight of zakatable silver." },
  { key: "silverPrice", label: "Silver price per gram", hint: "Use a current local price." },
  { key: "investments", label: "Investments", hint: "Zakatable investments as advised by your scholar." },
  { key: "business", label: "Business assets", hint: "Inventory and zakatable business wealth." },
  { key: "receivables", label: "Receivables", hint: "Money owed to you that is likely to be received." },
  { key: "other", label: "Other eligible assets", hint: "Any other zakatable wealth." },
  { key: "liabilities", label: "Liabilities / debts", hint: "Immediate debts that reduce zakatable wealth." },
];

export default function ZakatCalculator() {
  const [input, setInput] = useState(emptyZakat());
  const result = useMemo(() => calculateZakat(input), [input]);

  return (
    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8">
      <form className="card-surface p-6 grid sm:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
        {fields.map((field) => (
          <label key={field.key} className="block text-sm">
            <span className="font-semibold text-green-deep">{field.label}</span>
            <input
              type="number"
              min={0}
              step="0.01"
              value={input[field.key] || ""}
              onChange={(e) => setInput((prev) => ({ ...prev, [field.key]: Number(e.target.value) || 0 }))}
              className="mt-1"
            />
            <span className="text-xs text-muted">{field.hint}</span>
          </label>
        ))}
      </form>
      <aside className="card-surface p-6 h-max">
        <h2 className="text-xl font-bold text-green-deep">Estimate</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Total eligible wealth" value={result.eligible} />
          <Row label="Gold nisab reference" value={result.goldNisab} note={`${GOLD_NISAB_GRAMS}g × price`} />
          <Row label="Silver nisab reference" value={result.silverNisab} note={`${SILVER_NISAB_GRAMS}g × price`} />
          <Row label={`Estimated Zakat (${ZAKAT_RATE * 100}%)`} value={result.zakat} strong />
        </dl>
        <p className="mt-6 text-sm text-muted">
          This calculator is an educational estimate. Nisab, hawl, gold versus silver nisab, and which assets are zakatable can differ in details. Please review your situation with a qualified scholar before giving Zakat.
        </p>
      </aside>
    </div>
  );
}

function Row({ label, value, note, strong }: { label: string; value: number; note?: string; strong?: boolean }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border pb-2">
      <dt>
        {label}
        {note && <span className="block text-xs text-muted">{note}</span>}
      </dt>
      <dd className={strong ? "text-gold font-bold" : ""}>{value.toFixed(2)}</dd>
    </div>
  );
}
