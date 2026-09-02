import Link from "next/link";
import { BookMarked, BookOpen, GraduationCap, Languages, ScrollText, AudioLines } from "lucide-react";
import { WHAT_WE_TEACH } from "@/data/courses";

const ICONS = [BookMarked, Languages, BookOpen, ScrollText, AudioLines, GraduationCap];

export default function WhatWeTeach() {
  return (
    <section className="py-16 bg-white">
      <div className="section-container">
        <p className="section-eyebrow">Academy</p>
        <h2 className="section-title">What We Teach</h2>
        <div className="geometric-divider !mx-0" />
        <div className="mt-10 grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {WHAT_WE_TEACH.map((item, index) => {
            const Icon = ICONS[index];
            return (
              <Link key={item.slug} href={`/courses/${item.slug}`} className="card-surface p-6 flex gap-4">
                <div className="shrink-0 w-12 h-12 rounded-full bg-sage text-green-deep grid place-items-center">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-deep">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted">{item.text}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
