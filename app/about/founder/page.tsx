import PageHero from "@/components/layout/PageHero";
import FounderPhoto from "@/components/home/FounderPhoto";
import { founder } from "@/data/about";
import { pageMeta } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { personSchema } from "@/lib/schema";

export const metadata = pageMeta(
  "Our Founder | Alhaj Mufti Imadullah Qadri Naeemi",
  "Biography of Alhaj Mufti Imadullah Qadri Naeemi, founder of Alvasatiya Islamic Center, a scholar dedicated to approximately three decades of Islamic education and service.",
  "/about/founder"
);

export default function Page() {
  return (
    <>
      <JsonLd data={personSchema()} />
      <PageHero eyebrow="About Us" title="Our Founder" description={founder.role} />
      <section className="section-container py-12 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 items-start">
        <div className="relative w-full min-h-[22rem] aspect-[3/4] rounded-3xl bg-green-deep overflow-hidden border-4 border-gold/40">
          <FounderPhoto />
        </div>
        <div className="prose-islamic">
          <h1 className="section-title">{founder.name}</h1>
          {founder.biography.map((p) => <p key={p} className="mb-4">{p}</p>)}
          <ul>{founder.highlights.map((c) => <li key={c}>{c}</li>)}</ul>
          <p className="text-sm text-muted">The 700+ figure is an organization-provided claim and should be independently verified before public publication.</p>
          <h2>Islamic education</h2>
          <p>{founder.education}</p>
          <h2>Teaching experience</h2>
          <p>{founder.experience}</p>
          <h2>Contributions & services</h2>
          <ul>{founder.contributions.map((c) => <li key={c}>{c}</li>)}</ul>
          <h2>Founder’s Message</h2>
          <blockquote className="card-surface p-6 mt-4">{founder.message}</blockquote>
        </div>
      </section>
    </>
  );
}
