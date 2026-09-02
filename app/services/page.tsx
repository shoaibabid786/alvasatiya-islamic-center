import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "All Services Directory | Quran, Courses, Welfare, Hajj and Prayer Times",
  "A central directory of Alvasatiya's Islamic, educational and community services, from Quran reading and courses to welfare, Hajj guidance and prayer times.",
  "/services"
);

const cards = [
  ["Al Quran", "/quran"],
  ["Quran Learning", "/education"],
  ["Islamic Courses", "/courses"],
  ["Islamic Education", "/islamic-services/islamic-education"],
  ["Books Library", "/islamic-services/books-library"],
  ["Zakat Calculator", "/islamic-services/zakat-calculator"],
  ["Fatwa Q&A", "/social-services/fatwa-qa"],
  ["Islamic Media", "/media"],
  ["New Muslims", "/islamic-services/new-muslims"],
  ["Islamic Events", "/islamic-services/islamic-events"],
  ["Islamic Blogs", "/islamic-services/islamic-blogs"],
  ["Welfare Services", "/social-services/welfare-services"],
  ["Hajj & Umrah", "/social-services/hajj-umrah"],
  ["Prayer Times", "/social-services/prayer-times"],
  ["Donate", "/social-services/donate"],
  ["Institutions", "/institutions"],
  ["What We Provide", "/what-we-provide"],
  ["Feedback", "/feedback"],
  ["Rohani Ilaj", "/departments/rohani-ilaj"],
];

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Services" title="Services" description="Everything in one calm directory." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {cards.map(([title, href]) => (
          <Link key={href} href={href} className="card-surface p-6 font-semibold text-green-deep">{title}</Link>
        ))}
      </section>
    </>
  );
}
