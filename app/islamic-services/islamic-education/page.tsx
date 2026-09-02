import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Education Pathways | Quran, Tajweed, Hifz, Fiqh and Arabic",
  "A complete Islamic education pathway at Alvasatiya: Quran, Tajweed, Hifz, Fiqh, Hadith, Seerah, Arabic, Islamic studies, children's classes and online learning.",
  "/islamic-services/islamic-education"
);

const items = [
  ["Quran", "/quran"],
  ["Tajweed", "/courses"],
  ["Hifz", "/courses/quran-hifz"],
  ["Fiqh", "/courses/ilm-ul-fiqh"],
  ["Hadith", "/courses/ilm-ul-hadees"],
  ["Seerah", "/courses/seerat-un-nabi"],
  ["Arabic", "/courses/arabic-language"],
  ["Islamic Studies", "/courses/islamic-studies"],
  ["Children's education", "/courses/childrens-islamic-education"],
  ["Online education", "/departments/faizan-online-academy"],
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Education" description="A complete pathway from first letters to deeper Islamic sciences." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map(([title, href]) => (
          <Link key={title} href={href} className="card-surface p-5 text-center font-semibold text-green-deep">{title}</Link>
        ))}
      </section>
    </>
  );
}
