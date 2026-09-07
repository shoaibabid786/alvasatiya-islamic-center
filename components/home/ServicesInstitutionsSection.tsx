import Link from "next/link";
import { ArrowRight, BookOpen, Building2, FlaskConical, Landmark, Monitor } from "lucide-react";
import { getServiceInstitutions } from "@/lib/institutions";

const ICONS = [Building2, Landmark, Monitor, FlaskConical, BookOpen];

const COPY: Record<string, string> = {
  "jamia-umme-ashraf-jamal":
    "The flagship institution providing comprehensive Islamic education, scholar training, and community leadership.",
  "alvasatiya-islamic-center":
    "The heart of our mission — offering Quran learning, Islamic courses, and spiritual guidance for all ages.",
  "alvasatiya-tehfeez-ul-quran":
    "Specialized Quran memorization programs across multiple branches with qualified Huffaz and teachers.",
  "alvasatiya-science-academy":
    "Science and academic education alongside Islamic studies, so students grow in both religious and worldly knowledge.",
  "alvasatiya-it-lab":
    "Computer and technology education so students can gain practical digital skills.",
};

export default function ServicesInstitutionsSection() {
  const items = getServiceInstitutions();
  const order = [
    "jamia-umme-ashraf-jamal",
    "alvasatiya-islamic-center",
    "alvasatiya-tehfeez-ul-quran",
    "alvasatiya-science-academy",
    "alvasatiya-it-lab",
  ];
  const cards = order
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <section className="py-16 md:py-20 bg-green-deep">
      <div className="section-container">
        <p className="text-center text-[0.72rem] font-semibold tracking-[0.2em] uppercase text-[#d4e09b]">
          Our Institutions
        </p>
        <div className="mx-auto mt-2 h-px w-14 bg-[#d4e09b]" />
        <p className="mt-5 text-center text-ivory/75 max-w-2xl mx-auto">
          A network of institutions dedicated to Quran, Islamic sciences, modern education and technology.
        </p>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((item, index) => {
            const Icon = ICONS[index] ?? Landmark;
            const featured = index === 0;
            return (
              <Link
                key={item.slug}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col min-h-[220px] transition duration-300 ease-out hover:-translate-y-1 hover:border-transparent hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4e09b] focus-visible:ring-offset-2 focus-visible:ring-offset-green-deep"
              >
                <span
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#e7efc4] via-[#d4e09b] to-ivory transition-opacity duration-300 ${
                    featured ? "opacity-100" : "opacity-0"
                  } group-hover:opacity-100 group-focus-visible:opacity-100`}
                />
                <div className="relative z-10 flex flex-col flex-1">
                  <div
                    className={`w-10 h-10 rounded-md grid place-items-center border transition-colors duration-300 ${
                      featured
                        ? "border-green-deep/20 text-green-deep"
                        : "border-[#d4e09b]/40 text-[#d4e09b] group-hover:border-green-deep/20 group-hover:text-green-deep group-focus-visible:border-green-deep/20 group-focus-visible:text-green-deep"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3
                    className={`mt-5 font-semibold text-lg transition-colors duration-300 ${
                      featured
                        ? "text-green-deep"
                        : "text-ivory group-hover:text-green-deep group-focus-visible:text-green-deep"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm flex-1 transition-colors duration-300 ${
                      featured
                        ? "text-green-deep/80"
                        : "text-ivory/70 group-hover:text-green-deep/80 group-focus-visible:text-green-deep/80"
                    }`}
                  >
                    {COPY[item.slug] ?? item.summary}
                  </p>
                  <span
                    className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-colors duration-300 ${
                      featured
                        ? "text-green-deep"
                        : "text-[#d4e09b] group-hover:text-green-deep group-focus-visible:text-green-deep"
                    }`}
                  >
                    Learn More{" "}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
