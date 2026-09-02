"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronDown, Globe } from "lucide-react";

const INFO_LINKS = [
  { label: "Headquarters — Jamia Umme Ashraf Jamal", href: "/institutions/jamia-umme-ashraf-jamal" },
  { label: "Branches — Tehfeez-ul-Quran", href: "/institutions/alvasatiya-tehfeez-ul-quran" },
  { label: "All Institutions", href: "/institutions" },
  { label: "What We Provide", href: "/what-we-provide" },
  { label: "Contact", href: "/contact" },
];

function Menu({
  label,
  tone,
  children,
}: {
  label: string;
  tone: "gold" | "ochre";
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function close(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ivory ${
          tone === "gold" ? "bg-gold text-green-deep" : "bg-ochre text-ivory"
        }`}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Globe className="w-3.5 h-3.5" />
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 min-w-[240px] dropdown-panel py-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function QuranBanner() {
  return (
    <div className="bg-green-deep">
      <div className="section-container flex flex-col sm:flex-row sm:items-center gap-2 py-2.5">
        <p
          className="font-arabic rtl flex-1 text-ivory text-sm sm:text-base md:text-lg leading-relaxed text-center sm:text-right"
          dir="rtl"
          lang="ar"
        >
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ
        </p>
        <div className="flex justify-center sm:justify-end gap-2 shrink-0">
          <Menu label="Languages" tone="gold">
            <p className="px-4 py-2.5 text-sm font-semibold text-green-deep">English</p>
            <p className="px-4 pb-2 text-xs text-muted">Urdu will be published when the translation is ready.</p>
          </Menu>
          <Menu label="Our Info" tone="ochre">
            {INFO_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className="block px-4 py-2.5 text-sm text-text hover:bg-sage hover:text-green-deep">
                {item.label}
              </Link>
            ))}
          </Menu>
        </div>
      </div>
    </div>
  );
}
