import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { departments } from "@/data/departments";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Alvasatiya Departments | Farz Uloom, Sisters, Media, Hajj and More",
  "Explore Alvasatiya departments including Farz Uloom, Islamic Sisters, media, education, Hajj guidance, online academy and community initiatives.",
  "/departments"
);

export default function Page() {
  return (
    <>
      <PageHero eyebrow="Departments" title="Departments" description="Educational, media, environmental, and community initiatives under Alvasatiya." />
      <section className="section-container py-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((d) => (
          <Link key={d.slug} href={`/departments/${d.slug}`} className="card-surface p-6">
            <h2 className="font-semibold text-green-deep">{d.name}</h2>
            <p className="text-sm text-muted mt-2">{d.tagline}</p>
          </Link>
        ))}
      </section>
    </>
  );
}
