import PageHero from "@/components/layout/PageHero";
import Link from "next/link";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import { pageMeta } from "@/lib/seo";
import { faqSchema, serviceSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "New Muslims | Shahadah, Wudu, Salah and Beginner Guidance",
  "A welcoming beginner path to Islam: Shahadah, Wudu, Salah, Quran, basic beliefs, manners, beginner courses and frequently asked questions.",
  "/islamic-services/new-muslims"
);

const faqs = [
  { q: "Do I need to know Arabic first?", a: "No. You can begin with translation, a teacher, and gradual Arabic reading." },
  { q: "Who can I ask if I feel overwhelmed?", a: "A local teacher, a trusted scholar, and our Fatwa Q&A form for educational questions." },
  { q: "Are new Muslims welcome in classes?", a: "Yes. Beginner courses are designed to be calm, clear, and respectful." },
];

const topics = [
  { title: "Welcome to Islam", text: "Islam is submission to Allah, built on sincere faith, worship, and beautiful character. You are welcome here without pressure." },
  { title: "Shahadah", text: "The testimony of faith is to bear witness that there is none worthy of worship except Allah, and that Muhammad ﷺ is His Messenger. A teacher can help you say it and understand it." },
  { title: "Wudu", text: "Wudu is the washing that prepares a person for prayer. Learn it with a demonstration from a teacher so the steps are clear." },
  { title: "Salah", text: "Salah is the daily prayer. Start with the five prayers in their times, and grow in quality with patience." },
  { title: "Quran", text: "Begin with short surahs, listening, and a kind teacher. The Quran reader on this site can support daily reading." },
  { title: "Basic beliefs", text: "Belief in Allah, His angels, His books, His messengers, the Last Day, and divine decree — taught simply and clearly." },
  { title: "Islamic manners", text: "Honesty, gentleness, cleanliness, honoring parents, and good treatment of people are part of the path." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={[serviceSchema("New Muslims Guidance", "A beginner path covering Shahadah, Wudu, Salah, Quran and Islamic manners.", "/islamic-services/new-muslims"), faqSchema(faqs)]} />
      <PageHero eyebrow="Islamic Services" title="New Muslims" description="A gentle beginning to Islam — knowledge, worship, and a welcoming community." />
      <section className="section-container py-12 grid md:grid-cols-2 gap-5">
        {topics.map((t) => (
          <article key={t.title} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{t.title}</h2>
            <p className="mt-2 text-muted">{t.text}</p>
          </article>
        ))}
      </section>
      <section className="section-container pb-6">
        <h2 className="section-title">Beginner courses</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/courses/new-muslim-course" className="btn btn-green">New Muslim Course</Link>
          <Link href="/courses/namaz-course" className="btn btn-green">Namaz Course</Link>
          <Link href="/courses/noorani-qaida" className="btn btn-green">Noorani Qaida</Link>
          <Link href="/courses/taharat" className="btn btn-green">Taharat</Link>
          <Link href="/courses" className="btn btn-gold">All Courses</Link>
        </div>
      </section>
      <section className="section-container py-12">
        <h2 className="section-title mb-6">FAQs</h2>
        <FaqAccordion items={faqs} />
        <p className="mt-8 text-muted">Resources: Quran reader, Nazira Tul Quran, Tarjima tul Quran, and the contact form for a personal welcome.</p>
      </section>
    </>
  );
}
