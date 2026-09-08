import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Education Portal | Quran, Hadith, Fiqh, Usul and Fraiz",
  "Alvasatiya education portal for Quran, Ilm ul Hadees, Ilm ul Fiqh, Usul al Hadees, Usul al Fiqh, and Ilm ul Fraiz.",
  "/education"
);

const items = [
  { title: "Nazira Tul Quran", href: "/courses/nazira-tul-quran" },
  { title: "Hifaz ul Quran", href: "/courses/hifaz-ul-quran" },
  { title: "Tajweed o Qirat", href: "/courses/tajweed-o-qirat" },
  { title: "Tarjima tul Quran", href: "/courses/tarjima-tul-quran" },
  { title: "Tafseer ul Quran", href: "/courses/tafseer-ul-quran" },
  { title: "Ilm ul Hadees", href: "/courses/ilm-ul-hadees" },
  { title: "Ilm ul Fiqh", href: "/courses/ilm-ul-fiqh" },
  { title: "Usul al Hadees", href: "/courses/usul-al-hadees" },
  { title: "Usul al Fiqh", href: "/courses/usul-al-fiqh" },
  { title: "Ilm ul Fraiz", href: "/courses/ilm-ul-fraiz" },
  { title: "Dars e Nizami", href: "/courses/dars-e-nizami" },
  { title: "Khatam e Nabuwat", href: "/courses/khatam-e-nabuwat" },
  { title: "Taharat", href: "/courses/taharat" },
  { title: "Hajj Course", href: "/courses/hajj-course" },
  { title: "Umrah Course", href: "/courses/umrah-course" },
  { title: "New Muslim Course", href: "/courses/new-muslim-course" },
  { title: "Ahkam e Shariat", href: "/courses/ahkam-e-shariat" },
  { title: "Basic Islam for Children", href: "/courses/basic-islam-for-children" },
  { title: "Basic Islam for Youngers", href: "/courses/basic-islam-for-youngers" },
  { title: "Urdu Language Course", href: "/courses/urdu-language-course" },
  { title: "Famous Surahs Hifaz", href: "/courses/famous-surahs-hifaz" },
  { title: "Noorani Qaida", href: "/courses/noorani-qaida" },
  { title: "Adaab e Parents", href: "/courses/adaab-e-parents" },
  { title: "Ahl e Bait Course", href: "/courses/ahl-e-bait" },
  { title: "Parents of Muhammad ﷺ", href: "/courses/parents-of-muhammad" },
  { title: "Qurbani Course", href: "/courses/qurbani-course" },
  { title: "Seerat e Mustafa", href: "/courses/seerat-e-mustafa" },
  { title: "Namaz Course", href: "/courses/namaz-course" },
  { title: "Quran education", href: "/quran" },
  { title: "Computer education", href: "/contact", text: "IT and computer skills training is offered as a community service. Details to be published." },
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
