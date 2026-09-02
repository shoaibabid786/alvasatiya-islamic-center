import PageHero from "@/components/layout/PageHero";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/seo/JsonLd";
import {
  hajjDays, hajjFaqs, hajjMistakes, hajjSections, hajjTypes, packingList, umrahSteps,
} from "@/data/hajj";
import { pageMeta } from "@/lib/seo";
import { faqSchema, serviceSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Complete Guide to Hajj & Umrah | Educational Stages, Checklists and FAQs",
  "Learn Hajj and Umrah preparation, Ihram, Tawaf, Sa'i, Arafah and related stages. Educational guidance with a reminder to consult qualified scholars.",
  "/social-services/hajj-umrah"
);

export default function Page() {
  return (
    <>
      <JsonLd data={[serviceSchema("Hajj & Umrah Education", "Educational guide to Hajj and Umrah rites and preparation.", "/social-services/hajj-umrah"), faqSchema(hajjFaqs)]} />
      <PageHero eyebrow="Social Services" title="Complete Guide to Hajj & Umrah" description="Educational stages, checklists, and reminders. Schools of jurisprudence may differ — consult a qualified scholar." />
      <section className="section-container py-12">
        <ol className="space-y-4">
          {hajjSections.map((s, i) => (
            <li key={s.title} className="card-surface p-6">
              <p className="text-gold font-bold">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="text-xl font-semibold text-green-deep mt-1">{s.title}</h2>
              <p className="mt-2 text-muted">{s.body}</p>
            </li>
          ))}
        </ol>

        <h2 className="section-title mt-14">Important Hajj days</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {hajjDays.map((d) => (
            <article key={d.day} className="card-surface p-5">
              <p className="text-xs text-gold uppercase">{d.day}</p>
              <h3 className="font-semibold text-green-deep">{d.name}</h3>
              <p className="text-sm text-muted mt-2">{d.text}</p>
            </article>
          ))}
        </div>

        <h2 className="section-title mt-14">Types of Hajj</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {hajjTypes.map((t) => (
            <article key={t.title} className="card-surface p-5">
              <h3 className="font-semibold text-green-deep">{t.title}</h3>
              <p className="text-sm text-muted mt-2">{t.text}</p>
            </article>
          ))}
        </div>

        <h2 className="section-title mt-14">Step-by-step Umrah</h2>
        <ol className="mt-6 space-y-3">
          {umrahSteps.map((step, i) => (
            <li key={step} className="card-surface p-4 flex gap-4">
              <span className="text-gold font-bold">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <h2 className="section-title mt-14">Do / Don't</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {hajjMistakes.map((m) => (
            <article key={m.do} className="card-surface p-5">
              <p className="text-sm"><strong>Don't:</strong> {m.dont}</p>
              <p className="text-sm mt-2"><strong>Do:</strong> {m.do}</p>
            </article>
          ))}
        </div>

        <h2 className="section-title mt-14">What to pack</h2>
        <ul className="mt-6 grid md:grid-cols-2 gap-2">
          {packingList.map((item) => <li key={item} className="card-surface p-4">{item}</li>)}
        </ul>

        <div className="grid md:grid-cols-2 gap-4 mt-14">
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Health and safety preparation</h2>
            <p className="text-muted mt-2">Consult a physician for vaccinations and medicines. Rest, hydrate, and follow local safety guidance in crowds. This is general advice, not medical care.</p>
          </article>
          <article className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">Ihram rules</h2>
            <p className="text-muted mt-2">Ihram includes intention, Talbiyah, clothing, and avoiding prohibited actions taught in Fiqh. Learn the details from a teacher; some rules differ by school and by gender.</p>
          </article>
        </div>
        <article className="card-surface p-6 mt-4">
          <h2 className="font-semibold text-green-deep">Duas and recommended supplications</h2>
          <p className="text-muted mt-2">Keep to authentic, taught duas. Do not invent Quran verses or prophetic wording. A teacher can provide a reliable booklet before travel.</p>
        </article>

        <h2 className="section-title mt-14 mb-6">FAQs</h2>
        <FaqAccordion />
      </section>
    </>
  );
}
