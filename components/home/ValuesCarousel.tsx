"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { valueItems } from "@/data/values";

export default function ValuesCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  const loop = [...valueItems, ...valueItems];

  function scroll(dir: number) {
    scroller.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  }

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;
    let frame = 0;

    const tick = () => {
      if (!paused.current) {
        el.scrollLeft += 0.7;
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="relative bg-ivory border-y border-gold/30"
      aria-label="Islamic values"
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      <div className="section-container py-3 md:py-4 relative">
        <button
          type="button"
          className="absolute left-1 md:left-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gold/40 text-green-deep shadow-[var(--shadow-sm)] hover:bg-gold"
          aria-label="Previous values"
          onClick={() => scroll(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scroller}
          className="flex items-center gap-0 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mx-9 md:mx-12"
        >
          {loop.map((item, i) => (
            <div key={`${item.label}-${i}`} className="flex items-center shrink-0">
              <Link
                href={item.href}
                className="flex items-center px-4 md:px-6 py-1 rounded-xl hover:bg-sage/80 transition-colors"
              >
                <Image
                  src={item.src}
                  alt={item.label}
                  width={170}
                  height={48}
                  className="h-9 md:h-11 w-auto object-contain object-left"
                />
              </Link>
              <span
                className="hidden sm:block w-1.5 h-1.5 rotate-45 bg-gold/80 shrink-0"
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className="absolute right-1 md:right-0 top-1/2 -translate-y-1/2 z-10 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-gold/40 text-green-deep shadow-[var(--shadow-sm)] hover:bg-gold"
          aria-label="Next values"
          onClick={() => scroll(1)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
