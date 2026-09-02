"use client";

import { useState } from "react";
import { hajjFaqs } from "@/data/hajj";

export default function FaqAccordion({ items = hajjFaqs }: { items?: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.q} className="card-surface overflow-hidden">
          <button
            className="w-full text-left p-5 font-semibold text-green-deep"
            aria-expanded={open === i}
            onClick={() => setOpen(open === i ? null : i)}
          >
            {item.q}
          </button>
          {open === i && <p className="px-5 pb-5 text-muted">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
