"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import type { DailyItem } from "@/data/dailyWisdom";
import { formatDailyText } from "@/data/dailyWisdom";

export default function DailyWisdomCard({ item }: { item: DailyItem }) {
  const [copied, setCopied] = useState(false);
  const text = formatDailyText(item);
  const citation = item.narrator ? `${item.source} — ${item.narrator}` : item.source;

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: item.source, text });
        return;
      } catch {
        /* user cancelled or share failed — fall through to copy */
      }
    }
    await copy();
  }

  return (
    <article className="mx-auto max-w-4xl rounded-2xl border border-[#d7e0c8] bg-white px-6 py-8 sm:px-10 shadow-sm">
      <p className="font-arabic rtl text-right text-2xl sm:text-3xl text-green-deep leading-loose" dir="rtl" lang="ar">
        {item.arabic}
      </p>
      <p className="mt-6 text-center italic text-charcoal/80 text-base sm:text-lg leading-relaxed">
        “{item.english}”
      </p>
      <p className="mt-5 text-sm">
        <span className="text-gold font-semibold">{item.source}</span>
        {item.narrator ? <span className="text-muted"> — {item.narrator}</span> : null}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={share} className="btn btn-outline btn-plain !py-2.5 !px-5">
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <button type="button" onClick={copy} className="btn btn-green btn-plain !py-2.5 !px-5">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <span className="sr-only">{citation}</span>
    </article>
  );
}
