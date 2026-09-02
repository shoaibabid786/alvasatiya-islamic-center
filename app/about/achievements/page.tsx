import PageHero from "@/components/layout/PageHero";
import { achievementStats, achievements } from "@/data/about";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Our Achievements | Educational and Community Milestones",
  "A timeline of Alvasatiya's educational and community milestones. Figures remain placeholders until the organization confirms official statistics.",
  "/about/achievements"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="About Us" title="Our Achievements" description="Milestones in education, students served, courses, and welfare — updated as official figures are supplied." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievementStats.map((s) => (
          <article key={s.label} className="card-surface p-6 text-center">
            <p className="text-3xl font-bold text-gold">{s.value}</p>
            <p className="mt-2 font-semibold text-green-deep">{s.label}</p>
            <p className="text-xs text-muted">{s.note}</p>
          </article>
        ))}
      </section>
      <section className="section-container pb-12 space-y-4">
        {achievements.map((item) => (
          <article key={item.title} className="card-surface p-6">
            <p className="text-xs uppercase tracking-widest text-gold">{item.year}</p>
            <h2 className="font-semibold text-green-deep mt-1">{item.title}</h2>
            <p className="mt-2 text-muted">{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
