"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { SUCCESS_STORIES } from "@/data/success-stories";

export default function SuccessStoriesCarousel({ showDonate = false }: { showDonate?: boolean }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const story = SUCCESS_STORIES[index];

  const go = useCallback((next: number) => {
    setIndex((next + SUCCESS_STORIES.length) % SUCCESS_STORIES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => go(index + 1), 6500);
    return () => window.clearInterval(id);
  }, [index, paused, go]);

  return (
    <section
      className="py-14 md:py-16 bg-ivory"
      aria-label="Where donations are spent"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-gold">Success stories</p>
          <h2 className="mt-3 text-2xl md:text-3xl font-bold text-green-deep">Where your donation is spent</h2>
          <div className="mx-auto mt-3 h-px w-14 bg-gold" />
        </div>

        <div className="relative mt-8 overflow-hidden rounded-3xl border border-border bg-white">
          <div className="grid md:grid-cols-[1.1fr_0.9fr] min-h-[280px] md:min-h-[340px]">
            <div className="relative min-h-[220px] md:min-h-full">
              <Image
                src={story.image}
                alt={story.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 55vw"
              />
              <a
                href={story.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 grid place-items-center bg-green-deep/20 hover:bg-green-deep/30 transition-colors"
                aria-label={`Watch video about ${story.title}`}
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-white/95 text-green-deep shadow-md">
                  <Play className="w-6 h-6 ml-0.5" fill="currentColor" />
                </span>
              </a>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.18em] text-ochre">{story.spentOn}</p>
              <h3 className="mt-2 text-xl md:text-2xl font-semibold text-green-deep">{story.title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted leading-relaxed">{story.text}</p>
              <p className="mt-6 text-xs text-muted">
                {String(index + 1).padStart(2, "0")} — {String(SUCCESS_STORIES.length).padStart(2, "0")}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 border border-border text-green-deep"
            aria-label="Previous story"
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-white/90 border border-border text-green-deep"
            aria-label="Next story"
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-5 flex justify-center gap-2">
          {SUCCESS_STORIES.map((item, i) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Show ${item.title}`}
              className={`h-1.5 rounded-full transition-all ${i === index ? "w-7 bg-green-deep" : "w-1.5 bg-border"}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {showDonate ? (
            <Link href="/social-services/donate" className="btn btn-gold">
              Donate Now
            </Link>
          ) : null}
          <a href={story.videoUrl} target="_blank" rel="noreferrer" className="btn btn-outline">
            <Play className="w-4 h-4" />
            Watch video
          </a>
        </div>
      </div>
    </section>
  );
}
