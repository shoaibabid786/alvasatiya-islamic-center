import Link from "next/link";
import { QUICK_LEFT, QUICK_RIGHT } from "@/data/navigation";

function QuickLink({
  label,
  href,
  accent,
}: {
  label: string;
  href: string;
  accent?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`btn btn-rect !py-2 !px-4 text-[0.7rem] ${accent ? "btn-ochre" : "btn-green"}`}
    >
      {label}
    </Link>
  );
}

export default function BrandBar() {
  return (
    <div className="bg-white">
      <div className="section-container py-3 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-wrap justify-center lg:justify-start gap-2">
            {QUICK_LEFT.map((item) => (
              <QuickLink key={item.href} {...item} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/" className="text-center" aria-label="Alvasatiya home">
              <span className="block text-2xl sm:text-3xl md:text-[2.15rem] font-bold tracking-[0.22em] text-green-deep">
                ALVASATIYA
              </span>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end gap-2">
            {QUICK_RIGHT.map((item) => (
              <QuickLink key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
