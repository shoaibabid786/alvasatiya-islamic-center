import PageHero from "@/components/layout/PageHero";
import { missionPoints } from "@/data/about";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Our Mission | Quran Education, Character and Community Welfare",
  "Alvasatiya's mission in Quran education, character building, youth development, welfare services, and a balanced Islamic understanding.",
  "/about/mission"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Our Mission" description="Knowledge that benefits, faith that refines, and service that uplifts." />
      <section className="section-container py-12 grid md:grid-cols-2 gap-5">
        {missionPoints.map((item) => (
          <article key={item.title} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{item.title}</h2>
            <p className="mt-2 text-muted">{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
