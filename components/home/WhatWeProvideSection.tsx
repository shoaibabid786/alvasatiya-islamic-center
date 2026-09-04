import Link from "next/link";
import {
  Baby,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  Home,
  Landmark,
  Monitor,
  School,
  UtensilsCrossed,
} from "lucide-react";
import { WHAT_WE_PROVIDE, type ProvisionItem } from "@/data/institutions";

const ICONS: Record<ProvisionItem["icon"], typeof BookOpen> = {
  mosque: Landmark,
  school: School,
  computer: Monitor,
  home: Home,
  meals: UtensilsCrossed,
  heart: HeartHandshake,
  orphan: Baby,
  graduate: GraduationCap,
};

export default function WhatWeProvideSection({ showLearnMore = true }: { showLearnMore?: boolean }) {
  return (
    <section className="py-16 md:py-20 bg-sage">
      <div className="section-container">
        <p className="section-eyebrow">Mission</p>
        <h2 className="section-title">What We Provide</h2>
        <div className="geometric-divider !mx-0" />
        <p className="section-desc mt-2 max-w-3xl">
          Alvasatiya works so that knowledge remains open. Eligible poor and orphan students can receive education, and where the office approves it, accommodation and meals, free of cost.
        </p>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {WHAT_WE_PROVIDE.map((item) => {
            const Icon = ICONS[item.icon] ?? BookOpen;
            return (
              <article key={item.id} className="card-surface p-6 bg-white group">
                <div className="w-12 h-12 rounded-full bg-sage text-green-deep grid place-items-center group-hover:bg-gold group-hover:text-green-deep transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-semibold text-green-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </article>
            );
          })}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          {showLearnMore && <Link href="/what-we-provide" className="btn btn-green">Learn More</Link>}
        </div>
      </div>
    </section>
  );
}
