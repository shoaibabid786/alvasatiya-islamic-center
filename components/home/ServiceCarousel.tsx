"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  BookOpen, CalendarDays, CircleDollarSign, Clock, GraduationCap, HandHeart,
  Heart, Landmark, Library, MessageCircleQuestionMark, Clapperboard, Sparkles, ChevronLeft, ChevronRight,
} from "lucide-react";

const items = [
  { href: "/quran", title: "Al Quran", icon: BookOpen },
  { href: "/courses", title: "Courses", icon: GraduationCap },
  { href: "/education", title: "Education", icon: Sparkles },
  { href: "/islamic-services/books-library", title: "Books Library", icon: Library },
  { href: "/social-services/fatwa-qa", title: "Fatwa Q&A", icon: MessageCircleQuestionMark },
  { href: "/media", title: "Islamic Media", icon: Clapperboard },
  { href: "/islamic-services/new-muslims", title: "New Muslims", icon: HandHeart },
  { href: "/islamic-services/islamic-events", title: "Islamic Events", icon: CalendarDays },
  { href: "/social-services/hajj-umrah", title: "Hajj & Umrah", icon: Landmark },
  { href: "/social-services/prayer-times", title: "Prayer Times", icon: Clock },
  { href: "/social-services/welfare-services", title: "Welfare Services", icon: Heart },
  { href: "/social-services/donate", title: "Donate", icon: CircleDollarSign },
];

export default function ServiceCarousel() {
  const scroller = useRef<HTMLDivElement>(null);

  function scroll(dir: number) {
    scroller.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <section className="bg-ivory border-b border-border" aria-label="Quick services">
      <div className="section-container py-5 relative">
        <button type="button" className="absolute left-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-green-deep shadow-sm transition duration-200 hover:border-gold hover:bg-[#e8efd0] hover:shadow-md" aria-label="Previous services" onClick={() => scroll(-1)}>
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div
          ref={scroller}
          className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1 px-1 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="snap-start shrink-0 w-[42%] xs:w-[38%] sm:w-[30%] md:w-[22%] lg:w-[14%] xl:w-[12%] card-surface p-4 text-center hover:-translate-y-1"
            >
              <item.icon className="w-6 h-6 mx-auto text-green-deep" />
              <span className="mt-2 block text-xs font-semibold text-green-deep">{item.title}</span>
              <span className="block h-0.5 w-6 mx-auto mt-2 bg-gold/70" />
            </Link>
          ))}
        </div>
        <button type="button" className="absolute right-1 top-1/2 z-10 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-border bg-white text-green-deep shadow-sm transition duration-200 hover:border-gold hover:bg-[#e8efd0] hover:shadow-md" aria-label="Next services" onClick={() => scroll(1)}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
