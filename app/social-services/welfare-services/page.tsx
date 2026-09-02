import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import JsonLd from "@/components/seo/JsonLd";
import { welfarePrograms } from "@/data/welfare";
import { achievementStats } from "@/data/about";
import { pageMeta } from "@/lib/seo";
import { serviceSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Welfare Services | Support for Families, Orphans and Students",
  "Alvasatiya welfare support for poor families, orphans, education, food, accommodation and emergency needs, given with dignity.",
  "/social-services/welfare-services"
);

export default function Page() {
  return (
    <>
      <JsonLd data={serviceSchema("Welfare Services", "Support for poor families, orphans, education, food, accommodation and emergency needs.", "/social-services/welfare-services")} />
      <PageHero eyebrow="Social Services" title="Welfare Services" description="Helping deserving people with dignity — education, food, family support, and community care." />
      <section className="section-container py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievementStats.map((s) => (
          <article key={s.label} className="card-surface p-5 text-center">
            <p className="text-2xl font-bold text-gold">{s.value}</p>
            <p className="text-sm">{s.label}</p>
            <p className="text-xs text-muted">{s.note}</p>
          </article>
        ))}
      </section>
      <section className="section-container py-8 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {welfarePrograms.map((p) => (
          <article key={p.title} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{p.title}</h2>
            <p className="mt-2 text-sm text-muted">{p.text}</p>
          </article>
        ))}
      </section>
      <section className="section-container pb-12 text-center">
        <Link href="/social-services/donate" className="btn btn-gold">Donate Now</Link>
      </section>
    </>
  );
}
