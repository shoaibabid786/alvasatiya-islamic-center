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
              <article
                key={item.slug}
                className={`rounded-2xl p-6 flex flex-col min-h-[220px] ${
                  featured
                    ? "bg-gradient-to-br from-[#e7efc4] via-[#d4e09b] to-ivory text-green-deep"
                    : "bg-white/5 border border-white/10 text-ivory"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-md grid place-items-center border ${
                    featured ? "border-green-deep/20 text-green-deep" : "border-[#d4e09b]/40 text-[#d4e09b]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className={`mt-5 font-semibold text-lg ${featured ? "text-green-deep" : "text-ivory"}`}>
                  {item.title}
                </h3>
                <p className={`mt-2 text-sm flex-1 ${featured ? "text-green-deep/80" : "text-ivory/70"}`}>
                  {COPY[item.slug] ?? item.summary}
                </p>
                <Link
                  href={item.href}
                  className={`mt-5 inline-flex items-center gap-1 text-sm font-semibold ${
                    featured ? "text-green-deep" : "text-[#d4e09b]"
                  }`}
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
