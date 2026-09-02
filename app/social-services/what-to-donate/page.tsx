import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { donateCategories } from "@/data/welfare";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "What to Donate | Food, Clothing, Books and Orphan Support",
  "Choose how to give: food, clothing, books, school supplies, orphan support and community projects through Alvasatiya Islamic Center.",
  "/social-services/what-to-donate"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Social Services" title="What to Donate" description="Choose a charitable path that matches your intention and the community's needs." />
      <section className="section-container py-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
        {donateCategories.map((c) => (
          <article key={c.title} className="card-surface p-5">
            <h2 className="font-semibold text-green-deep">{c.title}</h2>
            <p className="mt-2 text-sm text-muted">{c.text}</p>
          </article>
        ))}
      </section>
      <section className="section-container pb-12 text-center">
        <Link href="/social-services/donate" className="btn btn-gold">Donate Now</Link>
      </section>
    </>
  );
}
