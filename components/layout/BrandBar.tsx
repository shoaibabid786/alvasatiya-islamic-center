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
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.68rem] font-semibold tracking-[0.14em] uppercase transition-all duration-200 ${
        accent
          ? "border border-ochre/30 bg-ochre/10 text-ochre hover:bg-ochre hover:text-ivory hover:border-ochre"
          : "text-green-deep/75 hover:bg-[#e8efd0] hover:text-green-deep"
      }`}
    >
      {label}
    </Link>
  );
}

export default function BrandBar() {
  return (
    <div className="bg-white">
      <div className="section-container py-4 md:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="flex flex-wrap justify-center lg:justify-start gap-1.5">
            {QUICK_LEFT.map((item) => (
              <QuickLink key={item.href} {...item} />
            ))}
          </div>
          <div className="flex justify-center">
            <Link href="/" className="group text-center" aria-label="Alvasatiya home">
              <span className="block text-2xl sm:text-3xl md:text-[2.05rem] font-bold tracking-[0.28em] text-green-deep">
                ALVASATIYA
              </span>
              <span
                aria-hidden
                className="mx-auto mt-1.5 block h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 group-hover:w-24"
              />
            </Link>
          </div>
          <div className="flex flex-wrap justify-center lg:justify-end gap-1.5">
            {QUICK_RIGHT.map((item) => (
              <QuickLink key={item.href} {...item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
