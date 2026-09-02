"use client";

import { useState } from "react";
import Image from "next/image";
import { founder } from "@/data/about";

export default function FounderPhoto({ className = "" }: { className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center text-ivory p-8 text-center ${className}`}>
        <div className="w-24 h-24 rounded-full bg-gold/20 flex items-center justify-center text-4xl font-bold">M</div>
        <p className="mt-4 font-semibold">{founder.name}</p>
        <p className="text-sm text-ivory/70 mt-2">Official founder photograph coming soon.</p>
      </div>
    );
  }
  return (
    <Image
      src={founder.image}
      alt={`Photograph of ${founder.name}, founder of Alvasatiya Islamic Center`}
      fill
      className={`object-cover object-[center_18%] ${className}`}
      sizes="(max-width: 1024px) 90vw, 380px"
      onError={() => setFailed(true)}
    />
  );
}
