"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/hero";

const INTERVAL = 7000;

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const live = heroSlides[index];

  const go = useCallback((next: number) => {
    setIndex((next + heroSlides.length) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(index + 1), INTERVAL);
    return () => window.clearInterval(id);
  }, [index, paused, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  return (
    <section
      className="relative isolate h-[500px] sm:h-[560px] md:h-[620px] lg:h-[700px] overflow-hidden bg-green-deep"
      aria-roledescription="carousel"
      aria-label="Featured stories"
      tabIndex={0}
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
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
          aria-hidden={i !== index}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            className="object-cover object-[center_30%] md:object-[center_25%] lg:object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-deep/90 via-green-deep/55 to-teal/20" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-green-deep/70 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 h-full section-container flex items-center">
        <div className="max-w-xl text-ivory animate-fade-up" aria-live="polite">
          <p className="section-eyebrow !text-gold-soft">{live.eyebrow}</p>
          <div className="gold-line w-24 my-3 !bg-none h-[2px] bg-gradient-to-r from-gold to-transparent" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">{live.heading}</h1>
          <p className="mt-4 text-ivory/85 text-base sm:text-lg">{live.description}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={live.primary.href} className="btn btn-gold">{live.primary.label}</Link>
            <Link href={live.secondary.href} className="btn btn-outline !text-ivory !border-gold-soft">{live.secondary.label}</Link>
          </div>
          <p className="mt-6 text-xs tracking-[0.3em] text-gold-soft">0{index + 1} — 04</p>
        </div>
      </div>

      <button
        type="button"
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-gold/50 bg-green-deep/50 text-gold hover:bg-gold hover:text-green-deep"
        aria-label="Previous slide"
        onClick={() => go(index - 1)}
      >
        <ChevronLeft className="mx-auto" />
      </button>
      <button
        type="button"
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full border border-gold/50 bg-green-deep/50 text-gold hover:bg-gold hover:text-green-deep"
        aria-label="Next slide"
        onClick={() => go(index + 1)}
      >
        <ChevronRight className="mx-auto" />
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2" role="tablist" aria-label="Slide indicators">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show slide ${i + 1}: ${slide.heading}`}
            className={`h-2.5 rounded-full transition-all ${i === index ? "w-8 bg-gold" : "w-2.5 bg-ivory/50"}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </section>
  );
}
