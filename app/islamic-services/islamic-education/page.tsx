import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Islamic Education Pathways | Quran, Hadith, Fiqh, Usul and Fraiz",
  "Quran, Ilm ul Hadees, Ilm ul Fiqh, Usul al Hadees, Usul al Fiqh, and Ilm ul Fraiz at Alvasatiya Islamic Center.",
  "/islamic-services/islamic-education"
);

const items = [
  ["Nazira Tul Quran", "/courses/nazira-tul-quran"],
  ["Hifaz ul Quran", "/courses/hifaz-ul-quran"],
  ["Tajweed o Qirat", "/courses/tajweed-o-qirat"],
  ["Tarjima tul Quran", "/courses/tarjima-tul-quran"],
  ["Tafseer ul Quran", "/courses/tafseer-ul-quran"],
  ["Ilm ul Hadees", "/courses/ilm-ul-hadees"],
  ["Ilm ul Fiqh", "/courses/ilm-ul-fiqh"],
  ["Usul al Hadees", "/courses/usul-al-hadees"],
  ["Usul al Fiqh", "/courses/usul-al-fiqh"],
  ["Ilm ul Fraiz", "/courses/ilm-ul-fraiz"],
  ["Dars e Nizami", "/courses/dars-e-nizami"],
  ["Khatam e Nabuwat", "/courses/khatam-e-nabuwat"],
  ["Taharat", "/courses/taharat"],
  ["Hajj Course", "/courses/hajj-course"],
  ["Umrah Course", "/courses/umrah-course"],
  ["New Muslim Course", "/courses/new-muslim-course"],
  ["Ahkam e Shariat", "/courses/ahkam-e-shariat"],
  ["Basic Islam for Children", "/courses/basic-islam-for-children"],
  ["Basic Islam for Youngers", "/courses/basic-islam-for-youngers"],
  ["Urdu Language Course", "/courses/urdu-language-course"],
  ["Famous Surahs Hifaz", "/courses/famous-surahs-hifaz"],
  ["Noorani Qaida", "/courses/noorani-qaida"],
  ["Adaab e Parents", "/courses/adaab-e-parents"],
  ["Ahl e Bait Course", "/courses/ahl-e-bait"],
  ["Parents of Muhammad ﷺ", "/courses/parents-of-muhammad"],
  ["Qurbani Course", "/courses/qurbani-course"],
  ["Seerat e Mustafa", "/courses/seerat-e-mustafa"],
  ["Namaz Course", "/courses/namaz-course"],
  ["Al Quran", "/quran"],
  ["Online courses", "/courses"],
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Islamic Services" title="Islamic Education" description="Quran, Hadith, Fiqh, Usul, and Ilm ul Fraiz." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {items.map(([title, href]) => (
          <Link key={title} href={href} className="card-surface p-5 text-center font-semibold text-green-deep">{title}</Link>
        ))}
      </section>
    </>
  );
}
