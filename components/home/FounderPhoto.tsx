import { founder } from "@/data/about";

export default function FounderPhoto({ className = "" }: { className?: string }) {
  return (
    <img
      src={founder.image}
      alt={`Photograph of ${founder.name}, founder of Alvasatiya Islamic Center`}
      className={`absolute inset-0 h-full w-full object-cover object-[center_18%] ${className}`}
      decoding="async"
      fetchPriority="high"
    />
  );
}
