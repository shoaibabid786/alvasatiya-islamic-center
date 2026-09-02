"use client";

import { useEffect, useRef, useState } from "react";
import type { StatValue } from "@/data/institutions";

export default function CountUp({
  value,
  className = "",
  unpublished = "To be published",
}: {
  value: StatValue;
  className?: string;
  unpublished?: string;
}) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (value == null) return;
    const node = ref.current;
    if (!node) return;
    const play = () => {
      if (started.current) return;
      started.current = true;
      if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setShown(value);
        return;
      }
      const start = performance.now();
      const duration = 900;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) * (1 - t);
        setShown(Math.round(value * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) play();
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  if (value == null) {
    return <span className={className}>{unpublished}</span>;
  }
  return (
    <span ref={ref} className={className}>
      {shown}
    </span>
  );
}
