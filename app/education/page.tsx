import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Education Portal | Quran, Tajweed, Hifz, Fiqh, Hadith and Online Learning",
  "Alvasatiya education portal for Islamic studies, Quran, Tajweed, Hifz, Fiqh, Hadith, Arabic, computer skills and online learning pathways.",
  "/education"
);

const items = [
  { title: "Islamic education", href: "/islamic-services/islamic-education" },
  { title: "Quran education", href: "/quran" },
  { title: "Tajweed", href: "/courses/tajweed-course" },
  { title: "Hifz", href: "/courses/quran-hifz" },
  { title: "Fiqh", href: "/courses/ilm-ul-fiqh" },
  { title: "Hadith", href: "/courses/ilm-ul-hadees" },
  { title: "Arabic", href: "/courses/arabic-language" },
  { title: "Computer education", href: "/contact", text: "IT and computer skills training is offered as a community service. Details to be published." },
  { title: "Communication / speech skills", href: "/contact", text: "Educational support for clear, respectful speech. Program details to be announced." },
  { title: "Online education", href: "/departments/online-courses" },
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Education" title="Education Portal" description="A doorway into Alvasatiya's learning pathways." />
      <section className="section-container py-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="card-surface p-5">
            <h2 className="font-semibold text-green-deep">{item.title}</h2>
            {item.text && <p className="text-xs text-muted mt-2">{item.text}</p>}
          </Link>
        ))}
      </section>
    </>
  );
}
