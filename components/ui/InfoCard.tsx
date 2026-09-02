import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export default function InfoCard({
  title,
  text,
  href,
  icon: Icon,
}: {
  title: string;
  text: string;
  href?: string;
  icon?: LucideIcon;
}) {
  const inner = (
    <article className="card-surface h-full p-6">
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-sage text-gold flex items-center justify-center mb-4">
          <Icon className="w-5 h-5" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-green-deep">{title}</h3>
      <p className="mt-2 text-sm text-muted">{text}</p>
    </article>
  );
  if (!href) return inner;
  return <Link href={href}>{inner}</Link>;
}
