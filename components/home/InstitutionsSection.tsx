import Link from "next/link";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { getHeadquarters, getTehfeezBranches } from "@/lib/institutions";
import { SITE } from "@/data/site";

function unpublishedLocation(location: string) {
  return /to be published|to be announced/i.test(location);
}

export default function InstitutionsSection() {
  const hq = getHeadquarters();
  const branches = getTehfeezBranches();
  const hqAddress = unpublishedLocation(hq.location) ? SITE.address : hq.location;

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="section-container">
        <p className="text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-green-deep">Our Institutions</p>
        <div className="mt-2 h-px w-14 bg-green-mid" />
        <h2 className="mt-4 text-2xl md:text-3xl font-bold text-green-deep">Main Headquarters &amp; Branches</h2>

        <article className="mt-8 flex flex-col sm:flex-row gap-5 sm:gap-7 rounded-2xl border border-[#e5e7eb] bg-white p-6 md:p-7">
          <div className="shrink-0 w-16 h-16 rounded-xl bg-green-deep text-ivory grid place-items-center">
            <Building2 className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-green-mid">Main Headquarters</p>
            <h3 className="mt-1 text-xl md:text-2xl font-bold text-green-deep">{hq.title}</h3>
            <p className="mt-2 text-muted">
              The main headquarters of Alvasatiya Islamic Center, serving as the central hub for Islamic education, administration, and community activities.
            </p>
            <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted">
              <MapPin className="w-4 h-4 mt-0.5 text-green-mid shrink-0" />
              {hqAddress}
            </p>
            <div className="mt-4">
              <Link href={hq.href} className="inline-flex items-center gap-1 text-sm font-semibold text-green-mid hover:text-ochre">
                View Location <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </article>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {branches.map((branch, index) => {
            const pending = unpublishedLocation(branch.location);
            return (
              <article key={branch.slug} className="rounded-2xl border border-[#e5e7eb] bg-white p-6 flex flex-col">
                <div className="w-10 h-10 rounded-full bg-[#e8efd0] text-green-deep grid place-items-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-semibold text-green-deep">
                  Alvasatiya Tehfeez-ul-Quran — Branch {index + 1}
                </h3>
                <p className="mt-2 text-sm text-muted flex-1">
                  Dedicated to Hifz-ul-Quran: memorization, revision, and Quranic manners with teacher care.
                </p>
                <p className="mt-3 inline-flex items-start gap-2 text-sm text-muted">
                  <MapPin className="w-4 h-4 mt-0.5 text-green-mid shrink-0" />
                  {pending ? "Location to be announced" : branch.location}
                </p>
                <Link
                  href={branch.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-green-mid hover:text-ochre"
                >
                  View Location <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
