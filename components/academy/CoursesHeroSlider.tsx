"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COURSE_SLIDER } from "@/data/academy";

const INTERVAL = 6000;

export default function CoursesHeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback((next: number) => {
    setIndex((next + COURSE_SLIDER.length) % COURSE_SLIDER.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL);
    return () => window.clearInterval(id);
  }, [index, paused, go]);

  return (
    <section
      className="relative isolate h-[240px] sm:h-[340px] md:h-[420px] lg:h-[480px] overflow-hidden bg-green-deep"
      aria-roledescription="carousel"
      aria-label="Islamic education gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        if (dx > 50) go(index - 1);
        if (dx < -50) go(index + 1);
        touchX.current = null;
      }}
    >
      {COURSE_SLIDER.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-green-deep/15" />
        </div>
      ))}
      <button
        type="button"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-gold/50 bg-green-deep/50 text-gold hover:bg-gold hover:text-green-deep"
        aria-label="Previous image"
        onClick={() => go(index - 1)}
      >
        <ChevronLeft className="mx-auto" />
      </button>
      <button
        type="button"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-gold/50 bg-green-deep/50 text-gold hover:bg-gold hover:text-green-deep"
        aria-label="Next image"
        onClick={() => go(index + 1)}
      >
        <ChevronRight className="mx-auto" />
      </button>
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Gallery indicators">
        {COURSE_SLIDER.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show image ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2.5 bg-ivory/50"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
