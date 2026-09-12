import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Languages, ScrollText, AudioLines, ArrowRight } from "lucide-react";
import { WHAT_WE_TEACH } from "@/data/courses";

const ICONS = [BookMarked, Languages, BookOpen, ScrollText, AudioLines, GraduationCap] as const;

export default function WhatWeTeach() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf6] py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='72' height='72' viewBox='0 0 72 72' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M36 10l6 12 12 6-12 6-6 12-6-12-12-6 12-6z' fill='%23283618'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="section-container relative grid items-start gap-12 lg:grid-cols-[minmax(240px,0.85fr)_1.35fr] lg:gap-16">
        <div className="lg:sticky lg:top-28">
          <span className="mb-4 block h-px w-12 bg-gold" />
          <h2 className="text-3xl font-semibold tracking-tight text-green-deep md:text-4xl">
            What We Teach
          </h2>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-muted">
            A clear view of the Islamic education we offer. These six pathways are a beginning — the full catalog has much more.
          </p>
          <Link
            href="#course-catalog"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-green-deep transition-colors hover:text-ochre"
          >
            Browse all courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
          {WHAT_WE_TEACH.map((item, index) => {
            const Icon = ICONS[index] ?? BookOpen;
            return (
              <Link
                key={item.slug}
                href={`/courses/${item.slug}`}
                className="group rounded-2xl p-1 transition duration-300 hover:-translate-y-1"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-green-deep/10 bg-white text-green-deep shadow-[0_6px_18px_rgba(40,54,24,0.06)] transition duration-300 group-hover:border-gold/50 group-hover:bg-[#e8efd0] group-hover:text-green-deep">
                  <Icon className="h-6 w-6" strokeWidth={1.35} />
                </span>
                <h3 className="mt-4 text-[1.05rem] font-semibold text-green-deep transition-colors group-hover:text-ochre">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
